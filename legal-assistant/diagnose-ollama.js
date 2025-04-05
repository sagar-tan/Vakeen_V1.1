const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

// Console formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function printHeader(text) {
  console.log('\n' + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.cyan + text + colors.reset);
  console.log(colors.cyan + '='.repeat(80) + colors.reset);
}

function printSuccess(text) {
  console.log(colors.green + '✓ ' + text + colors.reset);
}

function printWarning(text) {
  console.log(colors.yellow + '⚠ ' + text + colors.reset);
}

function printError(text) {
  console.log(colors.red + '✗ ' + text + colors.reset);
}

function printStep(text) {
  console.log(colors.blue + '→ ' + text + colors.reset);
}

// Main diagnostic function
async function diagnoseProblem() {
  printHeader('OLLAMA CONNECTION DIAGNOSTICS');
  console.log('This script will help diagnose issues with connecting to Ollama\n');
  
  // Check 1: Is Ollama installed?
  printStep('Checking if Ollama is installed...');
  try {
    let ollamaInstalled = false;
    try {
      // Try to run 'ollama -v'
      execSync('ollama -v', { stdio: 'pipe' });
      ollamaInstalled = true;
    } catch (e) {
      // On Windows, check if the service exists
      if (process.platform === 'win32') {
        try {
          execSync('sc query ollama', { stdio: 'pipe' });
          ollamaInstalled = true;
        } catch (e2) {
          // Not found
        }
      }
    }
    
    if (ollamaInstalled) {
      printSuccess('Ollama appears to be installed');
    } else {
      printError('Ollama is not installed or not in PATH');
      console.log('\nTo install Ollama:');
      console.log('1. Visit: https://ollama.ai/download');
      console.log('2. Download and run the installer for your platform');
      console.log('3. Follow the installation instructions');
      return;
    }
  } catch (error) {
    printWarning('Could not determine if Ollama is installed');
  }
  
  // Check 2: Can we connect to Ollama API?
  printStep('Checking connection to Ollama API server...');
  try {
    const response = await axios.get(`${OLLAMA_ENDPOINT}/api/tags`, { timeout: 5000 });
    printSuccess('Successfully connected to Ollama API server');
    
    // Check 3: Does the model exist?
    printStep(`Checking if model '${OLLAMA_MODEL}' is available...`);
    const models = response.data.models.map(model => model.name);
    console.log(`Available models: ${models.join(', ')}`);
    
    if (models.includes(OLLAMA_MODEL)) {
      printSuccess(`Model '${OLLAMA_MODEL}' is available`);
    } else {
      printError(`Model '${OLLAMA_MODEL}' is NOT available`);
      console.log('\nTo download the model, run:');
      console.log(`ollama pull ${OLLAMA_MODEL}`);
      
      // Suggest alternative models if any are available
      if (models.length > 0) {
        console.log('\nAlternatively, you can use one of these available models:');
        console.log(`1. Update .env to use one of these: ${models.join(', ')}`);
      }
    }
  } catch (error) {
    printError('Could not connect to Ollama API server');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\nPossible reasons:');
      console.log('1. Ollama service is not running');
      console.log('2. Ollama is running on a different port');
      
      console.log('\nTry these steps:');
      if (process.platform === 'win32') {
        console.log('1. Check if Ollama service is running:');
        console.log('   - Open Services (services.msc)');
        console.log('   - Look for "Ollama" service and make sure it\'s "Running"');
        console.log('\n2. Try restarting the Ollama service:');
        console.log('   - Right-click on Ollama service and select "Restart"');
      } else if (process.platform === 'darwin') {
        console.log('1. Check if Ollama app is running in the menu bar');
        console.log('2. If not, open Ollama from Applications folder');
      } else {
        console.log('1. Start Ollama service: "sudo systemctl start ollama"');
        console.log('2. Check status: "sudo systemctl status ollama"');
      }
    } else {
      console.log(`\nError details: ${error.message}`);
    }
  }
  
  // Check 4: Check .env file configuration
  printStep('Checking .env file configuration...');
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      if (!envContent.includes('OLLAMA_ENDPOINT=')) {
        printWarning('OLLAMA_ENDPOINT is not defined in .env file');
      }
      
      if (!envContent.includes('OLLAMA_MODEL=')) {
        printWarning('OLLAMA_MODEL is not defined in .env file');
      }
      
      printSuccess('.env file exists and was checked');
    } else {
      printWarning('.env file does not exist');
      console.log('Creating a basic .env file with default Ollama settings...');
      
      const defaultEnv = `PORT=3000

# Ollama Configuration
OLLAMA_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=llama2

# Fallback options
FALLBACK_ENABLED=true
`;
      
      fs.writeFileSync(envPath, defaultEnv);
      printSuccess('Created .env file with default Ollama settings');
    }
  } catch (error) {
    printError(`Could not check .env file: ${error.message}`);
  }
  
  // Check 5: Try a test query
  printStep('Attempting a test query to Ollama...');
  try {
    const requestBody = {
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' }
      ]
    };
    
    const response = await axios.post(
      `${OLLAMA_ENDPOINT}/api/chat`,
      requestBody,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    if (response.data && response.data.message && response.data.message.content) {
      printSuccess('Test query succeeded! Ollama is working properly.');
    } else {
      printWarning('Received a response but in unexpected format.');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    printError('Test query failed');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.log('No response received from server (timeout)');
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
  
  // Summary
  printHeader('DIAGNOSIS SUMMARY');
  console.log('If you encountered any errors, please check the following:');
  console.log('1. Make sure Ollama is installed: https://ollama.ai/download');
  console.log('2. Make sure the Ollama service is running');
  console.log('3. Make sure the required model is downloaded: ollama pull llama2');
  console.log('4. Check that your .env file has the correct settings');
  console.log('5. See ollama-setup.md for detailed setup instructions');
  
  console.log('\nFor more help, visit: https://github.com/ollama/ollama/issues');
}

// Run the diagnostics
diagnoseProblem().catch(error => {
  console.error('Unexpected error during diagnostics:', error);
}); 