# Cloudflare Workers Deployment Script
# Uses OpenNext + Master Key

Write-Host "=== Cloudflare Workers Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Load environment variables - uses Cloudflare Master Key (Global API Key)
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    
    if ($envContent -match 'CLOUDFLARE_EMAIL=([^\r\n]+)') {
        $env:CLOUDFLARE_EMAIL = $matches[1].Trim()
        Write-Host "[OK] CLOUDFLARE_EMAIL loaded" -ForegroundColor Green
    }
    
    if ($envContent -match 'CLOUDFLARE_API_KEY=([^\r\n]+)') {
        $env:CLOUDFLARE_API_KEY = $matches[1].Trim()
        Write-Host "[OK] CLOUDFLARE_API_KEY (master key) loaded" -ForegroundColor Green
    }
    
    if ($envContent -match 'CLOUDFLARE_ACCOUNT_ID=([^\r\n]+)') {
        $env:CLOUDFLARE_ACCOUNT_ID = $matches[1].Trim()
        Write-Host "[OK] CLOUDFLARE_ACCOUNT_ID loaded" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] .env.local not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Checking authentication..." -ForegroundColor Yellow
npx wrangler whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[WARNING] Authentication check failed" -ForegroundColor Yellow
    Write-Host "Token might be missing permissions. Continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Building and deploying to Cloudflare Workers..." -ForegroundColor Yellow
Write-Host "[INFO] Using OpenNext + wrangler deploy" -ForegroundColor Cyan
Write-Host ""

# Build and deploy (OpenNext for Workers)
npm run deploy:cloudflare

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Deployment completed!" -ForegroundColor Green
    Write-Host "URL: Check Workers dashboard for your worker URL" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERROR] Local deploy failed (Windows path issue)" -ForegroundColor Red
    Write-Host ""
    Write-Host "FALLBACK - Use Git push (Cloudflare builds on Linux):" -ForegroundColor Yellow
    Write-Host "  git add -A && git commit -m 'deploy' && git push origin main" -ForegroundColor White
    Write-Host "  -> Cloudflare auto-builds and deploys successfully" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Worker URL: https://azone-main.paingxyz.workers.dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "AUTH - Master Key in .env.local:" -ForegroundColor Yellow
    Write-Host "  CLOUDFLARE_EMAIL, CLOUDFLARE_API_KEY, CLOUDFLARE_ACCOUNT_ID" -ForegroundColor White
}
