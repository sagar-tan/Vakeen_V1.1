# Legal Assistant

An AI-powered legal assistant that provides information, answers questions, and helps with legal document preparation. This application uses Google's Gemini API for intelligent responses.

## Quick Start Setup

### Windows Users

1. Edit the `.env` file and add your Gemini API key
2. Run `start-app.bat` to start the application
3. Open your browser to http://localhost:3000

### macOS/Linux Users

1. Edit the `.env` file and add your Gemini API key
2. Run `chmod +x start-app.sh` to make the script executable
3. Run `./start-app.sh` to start the application
4. Open your browser to http://localhost:3000

## Features

- 🤖 AI-powered legal assistance using Google's Gemini API
- 💬 Chat interface for legal questions and document creation
- 📝 Document creation assistance
- 📊 Document analysis capabilities
- 🔐 Automatic fallback to OpenAI if Gemini is unavailable
- 📒 Built-in legal knowledge base for offline use

## Detailed Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Gemini API Key](https://ai.google.dev/) - Get a key from Google AI Studio

### Step 1: Get a Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy your API key

### Step 2: Configure the Application

1. Install dependencies:
   ```bash
   cd legal-assistant
   npm install
   ```
2. Edit the `.env` file:
   - Add your Gemini API key to `GEMINI_API_KEY=`
   - (Optional) Adjust the model in `GEMINI_MODEL=`

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

1. Start the server:
   ```bash
   node server.js
   ```
2. Open a browser and navigate to: http://localhost:3000

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

1. Check your Gemini API key is correctly set in the `.env` file
2. Make sure the API key is valid and has not expired
3. Check your internet connection
4. If Gemini API is unavailable, the app will try to use OpenAI as a fallback
5. If both APIs are unavailable, the app will use its built-in knowledge base

## Privacy and Data Usage

When using the Gemini API:
- Your queries are sent to Google's servers for processing
- Google's data usage policies apply
- For complete privacy, the application includes a fallback to a local knowledge base

## License

MIT 