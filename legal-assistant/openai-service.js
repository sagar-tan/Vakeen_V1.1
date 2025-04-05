const axios = require('axios');
const config = require('./config');

/**
 * Process user query through OpenAI API
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
        
        // Define API URL - make sure we're using the correct endpoint
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        // Create request body for OpenAI API
        const requestBody = {
            model: "gpt-3.5-turbo", // Use a model that's definitely available
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            max_tokens: config.maxTokens,
            temperature: config.temperature,
        };

        console.log('Sending request to OpenAI API:', apiUrl);
        
        // Make the API request to OpenAI API directly
        const response = await axios({
            method: 'post',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openaiApiKey}`
            },
            data: requestBody
        });
        
        // Log success but not the entire response (which might be large)
        console.log('Received successful response from OpenAI API');
        
        // Extract and return the generated text
        if (response.data && 
            response.data.choices && 
            response.data.choices.length > 0 && 
            response.data.choices[0].message) {
            return response.data.choices[0].message.content.trim();
        } else {
            console.error('Unexpected response structure:', JSON.stringify(response.data));
            return "I received a response but couldn't interpret it correctly. Please try again.";
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error.message);
        
        // More detailed error logging
        if (error.response) {
            console.error('Error details:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
            return `I apologize, but I encountered an error processing your request. (Error: ${error.response.status})`;
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            return "I apologize, but I didn't receive a response from my knowledge service. Please try again later.";
        } else {
            // Something else caused the error
            return "I apologize, but I encountered an error processing your request. Please try again later.";
        }
    }
}

module.exports = {
    processQuery
}; 