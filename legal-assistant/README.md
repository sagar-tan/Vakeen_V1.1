# Legal Assistant

An AI-powered legal assistant that provides information, answers questions, and helps with legal document preparation. This application runs locally using Ollama, providing privacy and no usage fees.

## Features

- 🤖 AI-powered legal assistance using locally-run Llama models
- 💬 Chat interface for legal questions and document creation
- 📝 Document creation assistance
- 📊 Document analysis capabilities
- 🔒 Privacy-focused (all processing happens on your machine)
- 💰 No usage fees or API costs

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Ollama](https://ollama.ai/download) - For running AI models locally

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   cd legal-assistant
   npm install
   ```
3. Install and configure Ollama following the instructions in `ollama-setup.md`

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

1. Ensure Ollama is running
2. Start the server:
   ```bash
   node server.js
   ```
3. Open a browser and navigate to: http://localhost:3000

## Testing Ollama

To test that Ollama is correctly configured:
```bash
node test-ollama.js
```

## Customizing the AI Model

You can create specialized versions of language models for legal assistance:

1. See the options in the `ollama-models` directory
2. Create a custom model using the Modelfiles provided
3. Update your `.env` file to use your custom model

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

1. Check that Ollama is running (`curl http://localhost:11434/api/tags`)
2. Verify you've downloaded the necessary model (`ollama list`)
3. Check the health of the API (`http://localhost:3000/api/health`)
4. See `ollama-setup.md` for detailed troubleshooting steps

## Privacy and Data Usage

All processing happens locally on your machine:
- No data is sent to external APIs
- No usage limits or costs
- Your legal questions remain private

## License

MIT 