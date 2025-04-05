#!/bin/bash

echo "Legal Assistant with Gemini API Startup Script"
echo "========================================="
echo

echo "Checking .env file for Gemini API key..."
if ! grep -q "GEMINI_API_KEY" .env || grep -q "GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE" .env; then
    echo
    echo "Warning: Gemini API key not found in .env file or using default value."
    echo "For the Legal Assistant to work properly, you need to set a valid Gemini API key."
    echo
    echo "Please edit the .env file and set the GEMINI_API_KEY value."
    echo
    echo "Would you like to continue anyway? (y/n)"
    read -r continue
    if [[ ! "$continue" =~ ^[Yy]$ ]]; then
        echo
        echo "Exiting. Please set up your API key and try again."
        echo
        exit 1
    fi
fi

echo "Starting Legal Assistant..."
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