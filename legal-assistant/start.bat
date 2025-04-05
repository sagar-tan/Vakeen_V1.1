@echo off
echo Installing dependencies...
cd %~dp0
npm install
echo.
echo Starting Legal Assistant...
npm start
pause 