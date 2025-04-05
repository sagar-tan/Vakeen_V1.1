// Load environment variables
require('dotenv').config();

// Import prompt templates
const prompts = require('./prompts');

// Ollama AI Configuration
module.exports = {
    // Ollama settings
    ollamaConfig: {
        endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
        model: process.env.OLLAMA_MODEL || 'llama3',
        apiPath: '/api/chat'
    },
    basePrompts: prompts,
    temperature: 0.7, // Controls randomness: lower values for more deterministic responses
    maxTokens: 1000, // Maximum length of response (may not be used by all Ollama models)
    fallbackEnabled: true // Whether to use local knowledge base if Ollama fails
}; 