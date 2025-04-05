@echo off
echo Legal Assistant with Gemini API Startup Script
echo =========================================
echo.

echo Checking .env file for Gemini API key...
findstr "GEMINI_API_KEY" .env | findstr /V "YOUR_GEMINI_API_KEY_HERE" > nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo Warning: Gemini API key not found in .env file or using default value.
    echo For the Legal Assistant to work properly, you need to set a valid Gemini API key.
    echo.
    echo Please edit the .env file and set the GEMINI_API_KEY value.
    echo.
    echo Would you like to continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" (
        echo.
        echo Exiting. Please set up your API key and try again.
        echo.
        pause
        exit /b 1
    )
)

echo Starting Legal Assistant...
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