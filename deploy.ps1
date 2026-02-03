# Smart Deploy Script - Auto Commit & Deploy
# Auto commits changes and deploys to Vercel (Team B)

Write-Host "Starting auto-deploy..." -ForegroundColor Cyan

# Get Vercel token from .env or .env.local
$envContent = $null
if (Test-Path .env) { $envContent = Get-Content .env -Raw }
if (-not $envContent -and (Test-Path .env.local)) { $envContent = Get-Content .env.local -Raw }
if ($envContent -match 'VERCEL_TOKEN=([^\r\n]+)') {
    $vercelToken = $matches[1].Trim()
    Write-Host "OK Vercel token found" -ForegroundColor Green
} else {
    Write-Host "ERROR: VERCEL_TOKEN not found in .env or .env.local" -ForegroundColor Red
    exit 1
}

# Check for changes
Write-Host ""
Write-Host "Checking for changes..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ([string]::IsNullOrWhiteSpace($gitStatus)) {
    Write-Host "No changes detected. Deploying current code..." -ForegroundColor Cyan
} else {
    Write-Host "Changes detected. Auto-committing..." -ForegroundColor Yellow
    git add .
    $commitMessage = "Auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $commitMessage 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Changes committed: $commitMessage" -ForegroundColor Green
    } else {
        Write-Host "WARN Commit failed (may already be committed)" -ForegroundColor Yellow
    }
}

# Step 1: Try Git Push
Write-Host ""
Write-Host "Attempting Git push to GitHub..." -ForegroundColor Yellow
$gitPush = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Git push successful! Vercel will auto-deploy from GitHub." -ForegroundColor Green
    Write-Host "Check deployment: https://vercel.com/paing/azone-main" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "ERROR Git push failed: $gitPush" -ForegroundColor Red
    Write-Host ""
    Write-Host "Falling back to Vercel CLI direct deploy..." -ForegroundColor Yellow
    Write-Host "Deploying directly to Vercel..." -ForegroundColor Yellow
    $vercelDeploy = vercel --prod --token $vercelToken --team team_5LvvGTe8CnBnQTzU5h6vXxma --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Vercel CLI deploy successful!" -ForegroundColor Green
        Write-Host "Check deployment: https://vercel.com/team-5LvvGTe8CnBnQTzU5h6vXxma/azone-main" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "ERROR Vercel CLI deploy failed: $vercelDeploy" -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual options:" -ForegroundColor Yellow
        Write-Host "  1. Browser: Edit files on GitHub.com" -ForegroundColor White
        Write-Host "  2. Check build errors in Vercel dashboard" -ForegroundColor White
        exit 1
    }
}
