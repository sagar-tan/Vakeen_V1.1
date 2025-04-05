#!/bin/bash

echo "Legal Assistant with Ollama Startup Script"
echo "========================================="
echo

# Check if Ollama is running
echo "Checking if Ollama is running..."
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Ollama does not appear to be running."
    echo
    echo "Please make sure Ollama is installed and running."
    echo "See ollama-setup.md for installation instructions."
    echo
    echo "Press Enter to exit..."
    read
    exit 1
fi

echo "Ollama is running! Starting Legal Assistant..."
echo
echo "NOTE: Keep this terminal open while using the Legal Assistant."
echo "Press Ctrl+C to stop the server when finished."
echo
echo "Starting server..."
echo

# Start the Node.js server
node server.js

# If the server exits, pause so the user can see any error messages
echo
echo "Server has stopped. Press Enter to exit..."
read 