Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host "`nStarting Legal Assistant..." -ForegroundColor Green
npm start

# Keep the window open
Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 