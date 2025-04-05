# Environment Variables Setup

This application uses environment variables to manage API keys and configuration. Follow these steps to set up your environment:

## Setting Up Your `.env` File

1. Create a file named `.env` in the root directory of the application
2. Add your OpenAI API key and other settings in the format shown below

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=3000
```

## Important Notes

- **API Key Format**: OpenAI API keys typically start with `sk-` followed by a string of characters
- **Never commit** your `.env` file to version control
- The `.env` file is included in `.gitignore` to prevent accidental commits

## Getting an OpenAI API Key

To get an OpenAI API key:

1. Visit [OpenAI's website](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and paste it in your `.env` file

## Available Models

You can specify different OpenAI models:

- `gpt-3.5-turbo` (Default, faster and cheaper)
- `gpt-4` (More capable but slower and more expensive)

## Running Without an API Key

If you don't have an OpenAI API key, the application will fall back to using local responses. These are more limited but allow you to test the interface without an API key. 