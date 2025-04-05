const axios = require('axios');
const config = require('./config');

/**
 * Process user query through Google's Gemini API
 * @param {string} query - User's query text
 * @param {string} mode - The current chat mode (custom-query, new-chat, create-docs, analyse-docs)
 * @returns {Promise<string>} - The AI generated response
 */
async function processQuery(query, mode) {
    // Get the appropriate base prompt for the current mode
    const basePrompt = config.basePrompts[mode] || config.basePrompts['custom-query'];
    
    // Combine the base prompt with the user's query
    const systemPrompt = basePrompt.replace('USER QUERY: ', '');
    
    // Start with the configured model
    let modelsToTry = [config.geminiConfig.model];
    
    // Add fallback models that aren't already in the list
    if (config.geminiConfig.fallbackModels) {
        for (const model of config.geminiConfig.fallbackModels) {
            if (model !== config.geminiConfig.model && !modelsToTry.includes(model)) {
                modelsToTry.push(model);
            }
        }
    }
    
    // Try each model until one succeeds
    let lastError = null;
    
    for (const model of modelsToTry) {
        try {
            console.log(`Trying Gemini model: ${model}...`);
            
            // Different possible URL formats to try
            const urls = [
                `${config.geminiConfig.endpoint}/models/${model}:generateContent`,
                `${config.geminiConfig.endpoint}/${model}:generateContent`
            ];
            
            // Try each URL format
            let response = null;
            let successUrl = null;
            
            for (const url of urls) {
                try {
                    const apiUrl = `${url}?key=${config.geminiConfig.apiKey}`;
                    console.log(`Trying API URL: ${apiUrl}`);
                    
                    // Create the request body
                    const requestBody = {
                        contents: [{
                            parts: [
                                { text: `You are a legal assistant. ${systemPrompt}\n\nUser question: ${query}` }
                            ]
                        }],
                        generationConfig: {
                            temperature: config.temperature,
                            maxOutputTokens: config.maxTokens,
                            topP: 0.8,
                            topK: 40
                        }
                    };
                    
                    // Make the API request
                    response = await axios({
                        method: 'post',
                        url: apiUrl,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: requestBody,
                        timeout: 30000 // 30 second timeout
                    });
                    
                    // If successful, break out of the URL loop
                    if (response && response.status === 200) {
                        successUrl = apiUrl;
                        break;
                    }
                } catch (urlError) {
                    console.log(`URL format ${url} failed: ${urlError.message}`);
                    // Continue to the next URL format
                }
            }
            
            // If no successful response, continue to the next model
            if (!response || !successUrl) {
                continue;
            }
            
            // Log success
            console.log(`Received successful response from Gemini API using model: ${model}`);
            console.log(`Successful URL: ${successUrl}`);
            
            // Extract the response text
            if (response.data && 
                response.data.candidates && 
                response.data.candidates[0] && 
                response.data.candidates[0].content && 
                response.data.candidates[0].content.parts && 
                response.data.candidates[0].content.parts[0]) {
                
                return response.data.candidates[0].content.parts[0].text;
            } else {
                console.error('Unexpected response structure:', JSON.stringify(response.data, null, 2));
                continue; // Try the next model if response format is unexpected
            }
        } catch (error) {
            // Store the error to throw if all models fail
            lastError = error;
            
            // Log error and try next model
            console.error(`Error with Gemini model ${model}:`, error.message);
            
            if (error.response && error.response.data && error.response.data.error) {
                const apiError = error.response.data.error;
                console.error('API Error details:', apiError);
                
                // If this is a model not found error, try the next model
                if (apiError.message && (
                    apiError.message.includes('not found for API version') ||
                    apiError.message.includes('not supported for generateContent'))) {
                    console.log(`Model ${model} not available, trying next model...`);
                    continue;
                }
            }
            
            // For other errors like network issues, also try the next model
            continue;
        }
    }
    
    // If we've tried all models and they all failed, throw the last error
    if (lastError) {
        // Handle error details
        if (lastError.response) {
            console.error('All Gemini models failed. Error details:');
            console.error('Status:', lastError.response.status);
            
            if (lastError.response.data && lastError.response.data.error) {
                const apiError = lastError.response.data.error;
                
                // Handle rate limiting
                if (apiError.code === 429) {
                    return "I'm processing too many requests right now. Please try again in a moment.";
                }
                
                // Handle invalid API key
                if (apiError.status === "PERMISSION_DENIED" || apiError.status === "INVALID_ARGUMENT") {
                    return "There seems to be an issue with the API configuration. Please check your API key and settings.";
                }
                
                // Return the error message from the API if available
                if (apiError.message) {
                    return `I apologize, but I encountered an error: ${apiError.message}`;
                }
            }
            
            return `I apologize, but I encountered an error processing your request. (Error: ${lastError.response.status})`;
        } else if (lastError.request) {
            // Request was made but no response received (timeout)
            console.error('No response received (timeout):', lastError.request);
            return "I apologize, but the request timed out. Please try again with a simpler question.";
        } else {
            // Something else caused the error
            return "I apologize, but I'm having trouble connecting to the Gemini API at the moment. Please try again later.";
        }
    }
    
    // This should not normally be reached, but just in case
    return "I apologize, but I couldn't generate a response with any available Gemini model. Please try again later.";
}

module.exports = {
    processQuery
}; 