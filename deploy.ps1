# Smart Deploy Script - Auto Commit & Deploy
# Auto commits changes and deploys to Vercel (Team B)

Write-Host "🚀 Starting auto-deploy..." -ForegroundColor Cyan

# Get Vercel token from .env
$envContent = Get-Content .env -Raw
if ($envContent -match 'VERCEL_TOKEN=([^\r\n]+)') {
    $vercelToken = $matches[1].Trim()
    Write-Host "✅ Vercel token found" -ForegroundColor Green
} else {
    Write-Host "❌ Vercel token not found in .env" -ForegroundColor Red
    exit 1
}

# Check for changes
Write-Host "`n📋 Checking for changes..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ([string]::IsNullOrWhiteSpace($gitStatus)) {
    Write-Host "ℹ️  No changes detected. Deploying current code..." -ForegroundColor Cyan
} else {
    Write-Host "📝 Changes detected. Auto-committing..." -ForegroundColor Yellow
    
    # Auto add all changes
    git add .
    
    # Generate commit message with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    
    # Commit changes
    git commit -m $commitMessage 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Changes committed: $commitMessage" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Commit failed (may already be committed)" -ForegroundColor Yellow
    }
}

# Step 1: Try Git Push
Write-Host "`n📤 Attempting Git push to GitHub..." -ForegroundColor Yellow
$gitPush = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git push successful! Vercel will auto-deploy from GitHub." -ForegroundColor Green
    Write-Host "🔗 Check deployment: https://vercel.com/paing/azone-main" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "❌ Git push failed: $gitPush" -ForegroundColor Red
    Write-Host "`n🔄 Falling back to Vercel CLI direct deploy..." -ForegroundColor Yellow
    
    # Step 2: Vercel CLI Deploy
    Write-Host "📦 Deploying directly to Vercel..." -ForegroundColor Yellow
    
    $vercelDeploy = vercel --prod --token $vercelToken --team team_5LvvGTe8CnBnQTzU5h6vXxma --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI deploy successful!" -ForegroundColor Green
        Write-Host "🔗 Check deployment: https://vercel.com/team-5LvvGTe8CnBnQTzU5h6vXxma/azone-main" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "❌ Vercel CLI deploy failed: $vercelDeploy" -ForegroundColor Red
        Write-Host "`n💡 Manual options:" -ForegroundColor Yellow
        Write-Host "   1. Browser: Edit files on GitHub.com" -ForegroundColor White
        Write-Host "   2. Check build errors in Vercel dashboard" -ForegroundColor White
        exit 1
    }
}
