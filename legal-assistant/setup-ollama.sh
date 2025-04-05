#!/bin/bash

echo "========================================================================"
echo "Legal Assistant - Ollama Setup Helper"
echo "========================================================================"
echo 

echo "This script will help you set up Ollama for the Legal Assistant"
echo

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="Linux"
else
  OS="Unknown"
fi

echo "Step 1: Checking if Ollama is already installed..."
if ! command -v ollama &> /dev/null; then
    echo "Ollama is not installed."
    echo
    
    if [ "$OS" == "macOS" ]; then
        echo "For macOS, please:"
        echo "1. Download Ollama from https://ollama.ai/download"
        echo "2. Move it to your Applications folder"
        echo "3. Open the Ollama app"
        echo
        echo "Would you like to open the download page now? (y/n)"
        read -r openDownload
        if [[ "$openDownload" =~ ^[Yy]$ ]]; then
            open "https://ollama.ai/download"
        fi
    elif [ "$OS" == "Linux" ]; then
        echo "For Linux, we can install Ollama for you."
        echo "This will run: curl -fsSL https://ollama.ai/install.sh | sh"
        echo
        echo "Would you like to install Ollama now? (y/n)"
        read -r installNow
        if [[ "$installNow" =~ ^[Yy]$ ]]; then
            echo "Installing Ollama..."
            curl -fsSL https://ollama.ai/install.sh | sh
            
            if [ $? -ne 0 ]; then
                echo "Installation failed. Please check the error and try manually."
                echo "Visit https://ollama.ai/download for instructions."
                exit 1
            fi
            echo "Ollama has been installed!"
        else
            echo "Please install Ollama manually and run this script again."
            exit 1
        fi
    else
        echo "Please download and install Ollama from https://ollama.ai/download"
        echo "Then run this script again."
        exit 1
    fi
else
    echo "Ollama is installed! Continuing setup..."
fi

echo
echo "Step 2: Checking if Ollama service is running..."
if ! curl -s "http://localhost:11434/api/tags" &> /dev/null; then
    echo "The Ollama service doesn't appear to be running."
    echo
    
    if [ "$OS" == "macOS" ]; then
        echo "Please make sure the Ollama app is running in your menu bar."
        echo "Check your Applications folder and open the Ollama app."
    elif [ "$OS" == "Linux" ]; then
        echo "Let's try to start the Ollama service..."
        if command -v systemctl &> /dev/null; then
            sudo systemctl start ollama
            echo "Waiting for Ollama to start..."
            sleep 5
        else
            echo "Starting Ollama manually..."
            ollama serve &
            echo "Waiting for Ollama to start..."
            sleep 5
        fi
    fi
    
    if ! curl -s "http://localhost:11434/api/tags" &> /dev/null; then
        echo
        echo "Could not start Ollama service automatically."
        echo "Please start Ollama manually and run this script again."
        exit 1
    else
        echo "Ollama service is now running!"
    fi
else
    echo "Ollama service is running!"
fi

echo
echo "Step 3: Checking for the Mistral model..."
if ! curl -s "http://localhost:11434/api/tags" | grep -q "mistral"; then
    echo "The Mistral model is not installed."
    echo
    echo "We will download it now. This may take several minutes"
    echo "depending on your internet connection (approx. 4GB download)."
    echo
    echo "Press Enter to start downloading the Mistral model..."
    read -r
    
    echo
    echo "Downloading Mistral model..."
    ollama pull mistral
    
    if [ $? -ne 0 ]; then
        echo
        echo "There was a problem downloading the model."
        echo "Please try again later or check your internet connection."
        exit 1
    else
        echo
        echo "Mistral model has been successfully downloaded!"
    fi
else
    echo "Mistral model is already installed!"
fi

echo
echo "========================================================================"
echo "Setup Complete!"
echo "========================================================================"
echo
echo "You can now run the Legal Assistant application."
echo "To start the application, run: ./start-app.sh"
echo
echo "Would you like to start the Legal Assistant now? (y/n)"
read -r startNow

if [[ "$startNow" =~ ^[Yy]$ ]]; then
    echo
    echo "Starting Legal Assistant..."
    chmod +x ./start-app.sh
    ./start-app.sh
else
    echo
    echo "You can start the Legal Assistant later by running './start-app.sh'"
fi 