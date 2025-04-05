// Load environment variables
require('dotenv').config();

// Import prompt templates
const prompts = require('./prompts');

// Available Gemini models in order of preference to try
// Based on Gemini API documentation
const geminiModels = [
    'gemini-pro',         // Standard model
    'gemini-1.0-pro',     // Alternative format 
    'models/gemini-pro'   // Full path format
];

// Gemini AI Configuration
module.exports = {
    // Gemini settings
    geminiConfig: {
        apiKey: process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        fallbackModels: geminiModels, // Models to try if primary fails
        endpoint: 'https://generativelanguage.googleapis.com/v1beta'
    },
    
    basePrompts: prompts,
    temperature: 0.7, // Controls randomness: lower values for more deterministic responses
    maxTokens: 2048, // Maximum length of response
    fallbackEnabled: true // Whether to use local knowledge base if AI service fails
}; 