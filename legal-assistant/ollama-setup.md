# Setting Up Ollama for Legal Assistant

**IMPORTANT: You MUST install Ollama before using this application!**

This guide will help you set up Ollama to run AI models locally for the Legal Assistant application.

## What is Ollama?

Ollama is an application that lets you run powerful AI models on your own computer without:
- API keys
- Usage fees
- Sending your data to third-party services

## Installation Instructions

### Step 1: Install Ollama (REQUIRED)

#### Windows
1. Download the installer from the [Ollama website](https://ollama.ai/download)
2. Run the installer and follow the instructions
3. Restart your computer after installation
4. The Ollama service should start automatically

#### macOS
1. Download from [Ollama website](https://ollama.ai/download)
2. Move to Applications folder
3. Open Ollama app (it will run as a menu bar application)

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Download the Mistral Model (REQUIRED)

Once Ollama is installed, open a terminal/command prompt and run:

```bash
ollama pull mistral
```

This will download the Mistral model (approximately 4GB). The download might take some time depending on your internet connection.

### Step 3: Test Ollama Works

Verify Ollama is working by running:

```bash
ollama run mistral "Hello, how are you?"
```

You should see a conversational response. If you get any errors, see the troubleshooting section below.

## Configuration for Legal Assistant

The Legal Assistant app is configured to use Ollama with the following settings in the `.env` file:

```
OLLAMA_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=mistral
```

## Running the Legal Assistant with Ollama

1. Ensure Ollama is running (it should start automatically after installation)
2. Start the Legal Assistant server:
   ```bash
   cd legal-assistant
   node server.js
   ```
3. Open your browser to http://localhost:3000

## Troubleshooting

### Ollama Not Installed or Not Found
If the diagnostic tool shows Ollama is not installed:
1. Download and install Ollama from [ollama.ai/download](https://ollama.ai/download)
2. On Windows, make sure to restart your computer after installation
3. Run the diagnostic tool again: `node diagnose-ollama.js`

### Ollama Installed But Not Running
If Ollama is installed but not running:

#### Windows
1. Check if the Ollama service is running:
   - Press Win+R, type `services.msc` and press Enter
   - Look for "Ollama" in the list
   - If it's not running, right-click and select "Start"

#### macOS
1. Check if the Ollama app is running in the menu bar
2. If not, open Ollama from the Applications folder

#### Linux
1. Start Ollama: `sudo systemctl start ollama`
2. Check status: `sudo systemctl status ollama`

### Model Not Found
If the diagnostic tool shows the model is not available:
1. Make sure to run: `ollama pull mistral`
2. Wait for the download to complete
3. Run the diagnostic tool again

### Hardware Requirements

AI models require significant resources:
- 8GB+ RAM recommended
- 4GB+ free disk space

If your system struggles, try closing other applications while using the Legal Assistant.

## Getting Help

If you continue to have issues:
1. Visit [Ollama GitHub Issues](https://github.com/ollama/ollama/issues)
2. Join the [Ollama Discord Community](https://discord.gg/ollama) 