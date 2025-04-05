@echo off
echo ========================================================================
echo Legal Assistant - Ollama Setup Helper
echo ========================================================================
echo.
echo This script will help you set up Ollama for the Legal Assistant
echo.

echo Step 1: Checking if Ollama is already installed...
where ollama >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Ollama is not installed or not in PATH.
    echo.
    echo We will open the Ollama download page in your browser.
    echo Please download and install it, then restart your computer.
    echo.
    echo Press any key to open the download page...
    pause >nul
    start https://ollama.ai/download
    echo.
    echo After installing Ollama and restarting your computer,
    echo run this setup script again to continue.
    echo.
    pause
    exit /b
) else (
    echo Ollama is installed! Continuing setup...
)

echo.
echo Step 2: Checking if Ollama service is running...
curl -s http://localhost:11434/api/tags >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo The Ollama service doesn't appear to be running.
    echo.
    echo Let's try to start it for you...
    echo.
    sc start ollama >nul 2>nul
    echo Waiting for Ollama to start...
    timeout /t 5 /nobreak >nul
    
    curl -s http://localhost:11434/api/tags >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        echo.
        echo Could not start Ollama service automatically.
        echo.
        echo Please try to manually start the Ollama service:
        echo 1. Press Win+R
        echo 2. Type 'services.msc' and press Enter
        echo 3. Find 'Ollama' in the list
        echo 4. Right-click and select 'Start'
        echo.
        echo After starting the service, run this script again.
        echo.
        pause
        exit /b
    ) else (
        echo Ollama service is now running!
    )
) else (
    echo Ollama service is running!
)

echo.
echo Step 3: Checking for the Mistral model...
curl -s http://localhost:11434/api/tags | findstr mistral >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo The Mistral model is not installed.
    echo.
    echo We will download it now. This may take several minutes 
    echo depending on your internet connection (approx. 4GB download).
    echo.
    echo Press any key to start downloading the Mistral model...
    pause >nul
    
    echo.
    echo Downloading Mistral model...
    ollama pull mistral
    
    if %ERRORLEVEL% neq 0 (
        echo.
        echo There was a problem downloading the model.
        echo Please try again later or check your internet connection.
        echo.
        pause
        exit /b
    ) else (
        echo.
        echo Mistral model has been successfully downloaded!
    )
) else (
    echo Mistral model is already installed!
)

echo.
echo ========================================================================
echo Setup Complete!
echo ========================================================================
echo.
echo You can now run the Legal Assistant application.
echo To start the application, run: start-app.bat
echo.
echo Would you like to start the Legal Assistant now? (Y/N)
set /p startNow=

if /i "%startNow%"=="y" (
    echo.
    echo Starting Legal Assistant...
    call start-app.bat
) else (
    echo.
    echo You can start the Legal Assistant later by running 'start-app.bat'
    echo.
    pause
) 