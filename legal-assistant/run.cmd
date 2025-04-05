@echo off
echo ======================================================
echo  Legal Assistant - Starting Application
echo ======================================================
echo.

:: Change to the script directory
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo Starting the Legal Assistant server...
echo.
echo When the server starts, open your browser and go to:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

:: Start the server
call npm start

:: Keep the window open if there's an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: The server encountered an error.
    pause
)

exit /b 0 