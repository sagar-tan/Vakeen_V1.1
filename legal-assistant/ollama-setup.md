# Setting Up Ollama for Legal Assistant

This guide will help you set up Ollama to run Llama locally for the Legal Assistant application.

## Why Ollama?

Ollama provides a simple way to run powerful large language models (like Llama) locally on your machine without:
- API keys
- Usage fees
- Sending your data to third-party services

## Installation Instructions

### Step 1: Install Ollama

#### Windows
1. Download the installer from the [Ollama website](https://ollama.ai/download)
2. Run the installer and follow the instructions
3. Once installed, Ollama will run as a background service on `http://localhost:11434`

#### macOS
1. Download from [Ollama website](https://ollama.ai/download)
2. Move to Applications folder
3. Open Ollama app (it will run as a menu bar application)

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 2: Download the Llama3 Model

Once Ollama is installed, open a terminal/command prompt and run:

```bash
ollama pull llama3
```

This will download the Llama3 model (~4GB). You can also try smaller models:
- `ollama pull llama3:8b` (smaller version)
- `ollama pull mistral` (alternative model if Llama is too resource-intensive)

### Step 3: Test Ollama

Verify Ollama is working by running:

```bash
ollama run llama3 "What is a legal contract?"
```

You should see a detailed response about legal contracts.

## Configuration for Legal Assistant

The Legal Assistant app is already configured to use Ollama with the following settings in the `.env` file:

```
OLLAMA_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=llama3
```

If you installed a different model, update the `OLLAMA_MODEL` value to match that model name.

## Running the Legal Assistant with Ollama

1. Ensure Ollama is running (it should start automatically after installation)
2. Start the Legal Assistant server:
   ```bash
   cd legal-assistant
   node server.js
   ```
3. Open your browser to http://localhost:3000

## Troubleshooting

### Ollama Not Connecting
If you see "Ollama is not running or not connected" in the Legal Assistant:

1. Check if Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```
   You should see a JSON response with available models.

2. If no response, restart Ollama:
   - Windows: Restart the Ollama service in Windows Services
   - macOS: Quit and restart the Ollama app
   - Linux: `sudo systemctl restart ollama`

### Hardware Requirements

Llama models require significant resources:
- **llama3**: 8GB+ RAM recommended
- **llama3:8b**: 4GB+ RAM
- **mistral**: 4GB+ RAM

If your system struggles, try a smaller model and update the `.env` file accordingly.

## Advanced: Using Different Models

To use a different model:
1. Pull the model: `ollama pull modelname`
2. Update the `.env` file: `OLLAMA_MODEL=modelname`
3. Restart the Legal Assistant server

## Available Models

Visit [Ollama Library](https://ollama.ai/library) for a list of available models. 