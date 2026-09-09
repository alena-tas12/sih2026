# Genesis Compliance — Deploy to Google App Engine
# Run this script from the project root: c:\Users\Alena B\Downloads\SIH\genesis-compliance

Write-Host "=== Step 1: Build React Frontend ===" -ForegroundColor Cyan
Set-Location apps/web
npm install
npm run build

Write-Host "=== Step 2: Copy built frontend into API/public ===" -ForegroundColor Cyan
Set-Location ../api

# Clean and create public folder
if (Test-Path public) { Remove-Item -Recurse -Force public }
Copy-Item -Recurse ../web/dist public

Write-Host "=== Step 3: Install API dependencies ===" -ForegroundColor Cyan
npm install

# Delete the old SQLite database so it re-seeds fresh on cloud
if (Test-Path src/data/database.sqlite) { Remove-Item src/data/database.sqlite }

Write-Host "=== Step 4: Deploy to Google App Engine ===" -ForegroundColor Cyan
Write-Host "Make sure you have run:  gcloud config set project quantum-idiom-508115-r3" -ForegroundColor Yellow
gcloud app deploy --quiet

Write-Host ""
Write-Host "=== Done! Opening your deployed app... ===" -ForegroundColor Green
gcloud app browse
