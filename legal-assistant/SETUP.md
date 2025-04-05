# Legal Assistant Setup Guide

This guide will help you install, configure, and run the Legal Assistant application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- An OpenAI API key (optional)

## Installation

1. Clone this repository or download the files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Configuration

### Environment Variables

The application uses environment variables for configuration. You need to set up a `.env` file:

1. Create a file named `.env` in the root directory of the project
2. Add the following variables:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=3000
```

**Note:** If you don't have an OpenAI API key, the application will still work using a local knowledge base, but responses will be more limited.

### API Key Information

- Standard OpenAI API keys start with `sk-` followed by a string of characters
- You can get an API key from the [OpenAI platform](https://platform.openai.com/)
- Keep your API key confidential and never commit it to version control

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Production Mode

```bash
npm start
```

### Install and Start in One Step

```bash
npm run install-and-start
```

## Using the Application

1. Open your browser and navigate to `http://localhost:3000` (or whatever port you configured)
2. The interface includes:
   - A sidebar with different modes (Custom Query, New Chat, History, etc.)
   - A chat area where responses appear
   - An input field at the bottom to enter your queries

## Troubleshooting

### API Connection Issues

If you see 404 errors or other API connection issues:
- Verify that your API key is correct and active
- Ensure your `.env` file is properly configured
- Check your internet connection

### Port Already in Use

If the default port (3000) is already in use, the application will automatically try the next port (3001).

## Customization

### Modifying Prompts

You can modify the prompt templates used for each mode by editing the `prompts.js` file.

### Styling

The application uses CSS for styling. You can modify the look and feel by editing `styles.css`.

## Security Notes

- Never share your API key
- The `.env` file is included in `.gitignore` to prevent accidental commits
- If deploying to a production environment, use proper environment variable management 