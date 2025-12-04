# Quick Deployment Script for Windows PowerShell
# Run this script to quickly deploy to Vercel

Write-Host "🚀 Cloud To-Do List - Vercel Deployment Helper" -ForegroundColor Magenta
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Stage all files
Write-Host "📦 Staging files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy: Cloud To-Do List"
}
git commit -m $commitMessage

Write-Host "✅ Files committed!" -ForegroundColor Green
Write-Host ""

# Ask for GitHub setup
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Name it: cloud-todo-list" -ForegroundColor White
Write-Host "3. Copy the repository URL (e.g., https://github.com/username/cloud-todo-list.git)" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (or press Enter to skip)"

if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "🔗 Adding remote..." -ForegroundColor Yellow
    git branch -M main
    git remote add origin $repoUrl
    
    Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Now deploy on Vercel:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. Import your 'cloud-todo-list' repository" -ForegroundColor White
    Write-Host "4. Click 'Deploy' 🚀" -ForegroundColor White
} else {
    Write-Host "Skipped GitHub push. You can do it manually later." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual commands:" -ForegroundColor Cyan
    Write-Host "git remote add origin YOUR_REPO_URL" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ Done! Your app is ready for Vercel deployment! ✨" -ForegroundColor Magenta
