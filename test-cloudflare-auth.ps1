# Test Cloudflare Authentication
# Load from .env.local - never hardcode tokens!
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match 'CLOUDFLARE_API_TOKEN=([^\r\n]+)') {
        $env:CLOUDFLARE_API_TOKEN = $matches[1].Trim()
    }
    if ($envContent -match 'CLOUDFLARE_EMAIL=([^\r\n]+)') {
        $env:CLOUDFLARE_EMAIL = $matches[1].Trim()
    }
    if ($envContent -match 'CLOUDFLARE_API_KEY=([^\r\n]+)') {
        $env:CLOUDFLARE_API_KEY = $matches[1].Trim()
    }
}
npx wrangler whoami
