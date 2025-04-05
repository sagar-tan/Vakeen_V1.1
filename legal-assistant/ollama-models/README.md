# Ollama Model Customization for Legal Assistant

This directory contains model definition files (Modelfiles) for creating specialized versions of language models optimized for legal assistance.

## What is a Modelfile?

A Modelfile is a configuration file used by Ollama to create customized versions of language models with specific behaviors, system prompts, and parameters. This allows us to tune models for specific tasks without requiring full fine-tuning.

## Available Models

### legal-llama

`legal-llama.txt` - A specialized version of Llama3 tuned for legal assistance with:
- Custom system prompt focused on legal guidance
- Temperature set to 0.5 for balanced creativity and precision
- Preconfigured with legal expertise areas

## How to Create a Custom Model

To create a custom model from a Modelfile:

1. Ensure Ollama is installed and running
2. Open a terminal/command prompt
3. Navigate to the legal-assistant directory
4. Run the following command:

```bash
# For Windows
ollama create legal-llama -f ./ollama-models/legal-llama.txt

# For macOS/Linux
ollama create legal-llama -f ./ollama-models/legal-llama.txt
```

5. Update your `.env` file to use the new model:
```
OLLAMA_MODEL=legal-llama
```

6. Restart the Legal Assistant server

## Creating Your Own Models

You can create your own specialized models by:

1. Copy one of the existing .txt files as a template
2. Modify the SYSTEM prompt to change the model's behavior
3. Adjust the PARAMETER values to control generation style
4. Change the NAME and DESCRIPTION
5. Create the model using the commands above, with your new file

## Testing Your Model

Once you've created a custom model, you can test it directly with:

```bash
ollama run legal-llama "What is a legal contract?"
```

Or by running the test-ollama.js script after updating your .env file:

```bash
node test-ollama.js
```

## Resources

- [Ollama Modelfile Documentation](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)
- [Ollama Library](https://ollama.ai/library) - Browse available base models 