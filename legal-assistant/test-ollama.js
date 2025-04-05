const axios = require('axios');
require('dotenv').config();

// Get configuration from .env or use defaults
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

console.log('Ollama Test Tool');
console.log('================');
console.log(`Testing connection to: ${OLLAMA_ENDPOINT}`);
console.log(`Using model: ${OLLAMA_MODEL}`);
console.log('----------------');

// First test - check if Ollama is running by getting available models
async function testOllamaConnection() {
    try {
        console.log('1. Testing connection to Ollama server...');
        const response = await axios.get(`${OLLAMA_ENDPOINT}/api/tags`);
        
        if (response.status === 200) {
            console.log('✅ Ollama server is running!');
            
            // Check if our configured model is available
            const models = response.data.models.map(model => model.name);
            console.log(`Available models: ${models.join(', ')}`);
            
            if (models.includes(OLLAMA_MODEL)) {
                console.log(`✅ Configured model '${OLLAMA_MODEL}' is available`);
            } else {
                console.log(`❌ Configured model '${OLLAMA_MODEL}' is NOT available. You need to run:`);
                console.log(`   ollama pull ${OLLAMA_MODEL}`);
            }
            
            return true;
        } else {
            console.log(`❌ Ollama server returned unexpected status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Failed to connect to Ollama server:');
        if (error.code === 'ECONNREFUSED') {
            console.log('   Ollama is not running. Please start Ollama first.');
        } else {
            console.log(`   Error: ${error.message}`);
        }
        return false;
    }
}

// Second test - test a simple query to verify the model works
async function testModelQuery() {
    try {
        console.log('\n2. Testing model with a simple legal query...');
        
        const requestBody = {
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: 'You are a legal assistant. Provide brief, accurate responses to legal questions.' },
                { role: 'user', content: 'What is the definition of a contract?' }
            ],
            options: {
                temperature: 0.7
            }
        };
        
        console.log('   Sending query to model (this may take a few seconds)...');
        const startTime = Date.now();
        
        const response = await axios.post(
            `${OLLAMA_ENDPOINT}/api/chat`,
            requestBody,
            { headers: { 'Content-Type': 'application/json' } }
        );
        
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000;
        
        if (response.data && response.data.message && response.data.message.content) {
            console.log(`✅ Model responded in ${timeTaken.toFixed(2)} seconds!`);
            console.log('   Preview of response:');
            const preview = response.data.message.content.substring(0, 150) + '...';
            console.log(`   "${preview}"`);
            return true;
        } else {
            console.log('❌ Model response format was unexpected:');
            console.log(JSON.stringify(response.data, null, 2));
            return false;
        }
    } catch (error) {
        console.log('❌ Error testing model query:');
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.log(`   Error: ${error.message}`);
        }
        return false;
    }
}

// Run tests in sequence
async function runTests() {
    console.log('Starting Ollama tests...\n');
    
    const connectionSuccess = await testOllamaConnection();
    
    if (connectionSuccess) {
        const querySuccess = await testModelQuery();
        
        console.log('\nTest Results Summary:');
        console.log('--------------------');
        console.log(`Ollama Connection: ${connectionSuccess ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Model Query Test: ${querySuccess ? '✅ PASS' : '❌ FAIL'}`);
        
        if (connectionSuccess && querySuccess) {
            console.log('\n🎉 All tests passed! Your Ollama setup is working correctly.');
            console.log('You can now use the Legal Assistant application with Ollama.');
        } else {
            console.log('\n⚠️ Some tests failed. Please check the errors above and refer to the ollama-setup.md guide for troubleshooting.');
        }
    } else {
        console.log('\nTest Results Summary:');
        console.log('--------------------');
        console.log(`Ollama Connection: ❌ FAIL`);
        console.log(`Model Query Test: ⏭️ SKIPPED (connection required)`);
        console.log('\n⚠️ Could not connect to Ollama. Please make sure Ollama is installed and running.');
        console.log('Refer to the ollama-setup.md guide for installation instructions.');
    }
}

// Run the tests
runTests(); 