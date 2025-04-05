// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const ollamaService = require('./ollama-service');
const config = require('./config');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

// Legal assistant responses database (mock) - kept for fallback scenarios
const legalKnowledgeBase = {
    // General legal terms and concepts
    'contract': 'A contract is a legally binding agreement between two or more parties. For a contract to be valid, it typically requires an offer, acceptance, consideration, and the intention to create legal relations.',
    'tort': 'A tort is a civil wrong that causes harm or loss, resulting in legal liability for the person who commits the act. Examples include negligence, defamation, and trespass.',
    'liability': 'Legal liability refers to the responsibility for one\'s actions or omissions that cause harm or damage to another person or entity, potentially resulting in legal obligations to provide compensation.',
    'jurisdiction': 'Jurisdiction refers to the authority of a court or legal body to hear and determine cases within a particular geographic area or over certain types of legal matters.',
    
    // Legal documents
    'will': 'A will is a legal document that expresses a person\'s wishes regarding the distribution of their property and the care of any minor children after death. If a person dies without a will, those wishes may not be honored.',
    'power of attorney': 'A power of attorney is a legal document that authorizes someone to act on another\'s behalf in legal or financial matters. It can be general (covering all matters) or limited to specific issues.',
    'deed': 'A deed is a legal document that transfers ownership of real property from one person to another. It must typically be signed, witnessed, and recorded with the appropriate government agency.',
    
    // Legal processes
    'litigation': 'Litigation is the process of taking legal action through the court system to resolve disputes. It typically involves filing a lawsuit, discovery, potential settlement negotiations, and possibly a trial.',
    'arbitration': 'Arbitration is a form of alternative dispute resolution where parties agree to resolve their dispute outside of court. An arbitrator or panel of arbitrators hears evidence and makes a binding decision.',
    'mediation': 'Mediation is a voluntary process where a neutral third party helps disputing parties reach a mutually acceptable resolution. Unlike arbitration, the mediator does not make a decision for the parties.',
    
    // Specific legal areas
    'divorce': 'Divorce is the legal dissolution of a marriage. The process varies by jurisdiction but often involves decisions about property division, child custody, and potentially alimony.',
    'bankruptcy': 'Bankruptcy is a legal process that provides relief for individuals or businesses that cannot pay their debts. The main types in the US are Chapter 7 (liquidation) and Chapter 13 (reorganization for individuals).',
    'intellectual property': 'Intellectual property refers to creations of the mind, such as inventions, literary and artistic works, designs, symbols, and names used in commerce. Protection includes patents, trademarks, and copyrights.',
    
    // Legal professionals
    'lawyer': 'A lawyer (also called an attorney) is a licensed professional who advises and represents clients in legal matters. Lawyers can specialize in various areas such as criminal law, family law, or corporate law.',
    'paralegal': 'A paralegal is a trained professional who assists lawyers in various legal tasks but cannot give legal advice or represent clients in court.',
    'judge': 'A judge is a public official appointed or elected to hear and decide cases in a court of law. Judges preside over legal proceedings and ensure that the law is properly applied.'
};

// Routes
// Main route serves the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to handle legal queries
app.post('/api/query', async (req, res) => {
    const { query, mode } = req.body;
    
    // Handle history mode separately as it doesn't need Ollama
    if (mode === 'history') {
        const historyResponse = {
            message: "Here are your previous conversations:",
            history: [
                { id: 1, date: '2023-04-15', topic: 'Contract Review' },
                { id: 2, date: '2023-04-10', topic: 'Trademark Registration' },
                { id: 3, date: '2023-03-28', topic: 'Legal Consultation' }
            ]
        };
        
        return res.json({ response: historyResponse });
    }
    
    try {
        console.log(`Processing ${mode} query: "${query && query.substring(0, 50)}${query && query.length > 50 ? '...' : ''}"`);
        
        // Process the query through Ollama
        const response = await ollamaService.processQuery(query, mode);
        
        console.log('Ollama API response received successfully');
        
        // Send the response with a slight delay for a more natural feel
        setTimeout(() => {
            res.json({ response });
        }, 500);
    } catch (error) {
        console.error('Error processing query:', error);
        
        // If fallback is enabled, use local knowledge base
        if (config.fallbackEnabled) {
            console.log('Using fallback response system');
            let fallbackResponse = generateFallbackResponse(query, mode);
            
            res.json({ 
                response: fallbackResponse,
                isFallback: true
            });
        } else {
            // Otherwise return the error to the client
            res.status(500).json({
                response: "I apologize, but I encountered an error processing your request. Please try again later.",
                error: error.message,
                isFallback: false
            });
        }
    }
});

// Endpoint to check Ollama connection
app.get('/api/health', async (req, res) => {
    try {
        // Try to connect to the Ollama API
        const response = await fetch(`${config.ollamaConfig.endpoint}/api/tags`);
        const data = await response.json();
        
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: 'Legal Assistant API',
            version: '1.0.2',
            ollama: {
                connected: true,
                models: data.models ? data.models.map(m => m.name) : []
            }
        });
    } catch (error) {
        res.json({
            status: 'warning',
            timestamp: new Date().toISOString(),
            server: 'Legal Assistant API',
            version: '1.0.2',
            ollama: {
                connected: false,
                error: error.message
            },
            message: 'Ollama connection failed. Using fallback responses.'
        });
    }
});

// Function to generate a fallback response if Ollama fails
function generateFallbackResponse(query, mode) {
    query = (query || '').toLowerCase();
    
    // Check if any keywords in our knowledge base match the query
    for (const [keyword, response] of Object.entries(legalKnowledgeBase)) {
        if (query.includes(keyword)) {
            return response;
        }
    }
    
    // Default responses based on mode
    switch(mode) {
        case 'new-chat':
        case 'custom-query':
            return "I understand you have a legal question. However, I'm having trouble connecting to my knowledge base at the moment. Could you try again later or rephrase your question?";
        case 'create-docs':
            return "I'd be happy to help you create a legal document. However, I'm having trouble accessing my templates at the moment. Could you try again later or provide more details about what you're looking to create?";
        case 'analyse-docs':
            return "I'd be glad to analyze a legal document for you. However, I'm having trouble connecting to my analysis tools at the moment. Could you try again later or provide more details about the document you'd like analyzed?";
        default:
            return "I'm having trouble processing your request at the moment. Could you try again later?";
    }
}

// Start the server with error handling
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open your browser and navigate to: http://localhost:${PORT}`);
    console.log(`API Health check: http://localhost:${PORT}/api/health`);
    console.log(`Make sure Ollama is running locally at: ${config.ollamaConfig.endpoint}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        const newServer = app.listen(PORT + 1, () => {
            const newPort = newServer.address().port;
            console.log(`Server is now running on port ${newPort}`);
            console.log(`Open your browser and navigate to: http://localhost:${newPort}`);
            console.log(`API Health check: http://localhost:${newPort}/api/health`);
            console.log(`Make sure Ollama is running locally at: ${config.ollamaConfig.endpoint}`);
        });
    } else {
        console.error('Server error:', err);
    }
}); 