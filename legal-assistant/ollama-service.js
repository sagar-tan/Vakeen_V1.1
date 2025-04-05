const axios = require('axios');
const config = require('./config');

/**
 * Process user query through Ollama AI
 * @param {string} query - User's query text
 * @param {string} mode - The current chat mode (custom-query, new-chat, create-docs, analyse-docs)
 * @returns {Promise<string>} - The AI generated response
 */
async function processQuery(query, mode) {
    try {
        // Get the appropriate base prompt for the current mode
        const basePrompt = config.basePrompts[mode] || config.basePrompts['custom-query'];
        
        // Combine the base prompt with the user's query
        const systemPrompt = basePrompt.replace('USER QUERY: ', '');
        
        // Create full API URL
        const apiUrl = `${config.ollamaConfig.endpoint}${config.ollamaConfig.apiPath}`;
        
        // Create request body for Ollama API
        const requestBody = {
            model: config.ollamaConfig.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            options: {
                temperature: config.temperature
            }
        };

        console.log(`Sending request to Ollama API (${config.ollamaConfig.model}): ${apiUrl}`);
        
        // Make the API request to Ollama API
        const response = await axios({
            method: 'post',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        });
        
        // Log success but not the entire response
        console.log('Received successful response from Ollama API');
        
        // Extract and return the generated text
        if (response.data && response.data.message && response.data.message.content) {
            return response.data.message.content.trim();
        } else {
            console.error('Unexpected response structure:', JSON.stringify(response.data));
            return "I received a response but couldn't interpret it correctly. Please try again.";
        }
    } catch (error) {
        console.error('Error calling Ollama API:', error.message);
        
        // More detailed error logging
        if (error.response) {
            console.error('Error details:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
            return `I apologize, but I encountered an error processing your request. (Error: ${error.response.status})`;
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            return "No response received from Ollama. Please make sure the model is downloaded using 'ollama pull llama2' or check that Ollama is running properly.";
        } else {
            // Something else caused the error
            return "Error connecting to Ollama. Please ensure Ollama is installed and the correct model is downloaded. See ollama-setup.md for instructions.";
        }
    }
}

module.exports = {
    processQuery
}; 