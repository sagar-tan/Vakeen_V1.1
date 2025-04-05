@echo off
echo Legal Assistant with Ollama Startup Script
echo =========================================
echo.

REM Check if Ollama is running
echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags > nul
if %ERRORLEVEL% neq 0 (
    echo Ollama does not appear to be running.
    echo.
    echo Please make sure Ollama is installed and running.
    echo See ollama-setup.md for installation instructions.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 1
)

echo Ollama is running! Starting Legal Assistant...
echo.
echo NOTE: Keep this window open while using the Legal Assistant.
echo Press Ctrl+C to stop the server when finished.
echo.
echo Starting server...
echo.

REM Start the Node.js server
node server.js

REM If the server exits, pause so the user can see any error messages
echo.
echo Server has stopped. Press any key to exit...
pause > nul 