# Legal Assistant

An AI-powered legal assistant that provides information, answers questions, and helps with legal document preparation. This application runs locally using Ollama, providing privacy and no usage fees.

## Quick Start Setup

### Windows Users

1. Run `setup-ollama.bat` to install Ollama and set up the necessary model
2. Follow the on-screen instructions
3. The setup will guide you through:
   - Installing Ollama (if needed)
   - Downloading the required AI model
   - Starting the Legal Assistant

### macOS/Linux Users

1. Run `chmod +x setup-ollama.sh` to make the script executable
2. Run `./setup-ollama.sh` to install Ollama and set up the model
3. Follow the on-screen instructions

## Features

- 🤖 AI-powered legal assistance using locally-run models
- 💬 Chat interface for legal questions and document creation
- 📝 Document creation assistance
- 📊 Document analysis capabilities
- 🔒 Privacy-focused (all processing happens on your machine)
- 💰 No usage fees or API costs

## Detailed Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Ollama](https://ollama.ai/download) - For running AI models locally

### Step 1: Install Ollama

**IMPORTANT: You must install Ollama first!**

1. Download Ollama from [ollama.ai/download](https://ollama.ai/download)
2. Install and run Ollama
3. After installation, run this command in your terminal:
   ```bash
   ollama pull mistral
   ```
   This will download the Mistral AI model (approx. 4GB)

### Step 2: Setup the Legal Assistant

1. Install dependencies:
   ```bash
   cd legal-assistant
   npm install
   ```
2. Check that Ollama is properly connected:
   ```bash
   node diagnose-ollama.js
   ```
   Make sure it shows "Successfully connected to Ollama API server"

## Running the Application

### Quick Start

For Windows:
```bash
start-app.bat
```

For macOS/Linux:
```bash
chmod +x start-app.sh
./start-app.sh
```

### Manual Start

1. Make sure Ollama is running
2. Start the server:
   ```bash
   node server.js
   ```
3. Open a browser and navigate to: http://localhost:3000

## Usage

1. Start by selecting a mode from the sidebar:
   - **New Chat** - Start a fresh conversation
   - **History** - View past conversations
   - **Create Docs** - Get help creating legal documents
   - **Analyse Docs** - Upload documents for analysis
   - **Custom Query** - Ask specific legal questions

2. Enter your question or request in the chat box
3. The AI will respond with relevant legal information

## Troubleshooting

If you encounter issues:

1. **Run the automated setup**: 
   - Windows: `setup-ollama.bat`
   - macOS/Linux: `./setup-ollama.sh`

2. Make sure Ollama is installed and running
   - Download from: https://ollama.ai/download
   - After installation, run: `ollama pull mistral`

3. Run the diagnostic tool:
   ```bash
   node diagnose-ollama.js
   ```
   This will check your Ollama installation, connection, and model availability.

4. See `ollama-setup.md` for detailed troubleshooting steps

## Customizing the AI Model

You can create specialized versions of language models for legal assistance:

1. See the options in the `ollama-models` directory
2. Create a custom model using the Modelfiles provided
3. Update your `.env` file to use your custom model

## Privacy and Data Usage

All processing happens locally on your machine:
- No data is sent to external APIs
- No usage limits or costs
- Your legal questions remain private

## License

MIT 