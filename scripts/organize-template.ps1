# PowerShell Script: Organize Template into Folder
# Usage: .\organize-template.ps1 -TemplateZip "path\to\template.zip" -TemplateName "template-name"

param(
    [Parameter(Mandatory=$true)]
    [string]$TemplateZip,
    
    [Parameter(Mandatory=$true)]
    [string]$TemplateName,
    
    [string]$Destination = "H:\My Drive\Templates"
)

# Create destination folder if it doesn't exist
if (-not (Test-Path $Destination)) {
    Write-Host "Creating destination folder: $Destination" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Create template folder
$TemplateFolder = Join-Path $Destination $TemplateName

if (Test-Path $TemplateFolder) {
    Write-Host "Template folder already exists: $TemplateFolder" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite? (y/n)"
    if ($response -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit
    }
    Remove-Item $TemplateFolder -Recurse -Force
}

Write-Host "Creating template folder: $TemplateFolder" -ForegroundColor Green
New-Item -ItemType Directory -Path $TemplateFolder -Force | Out-Null

# Extract ZIP file
if (-not (Test-Path $TemplateZip)) {
    Write-Host "Error: ZIP file not found: $TemplateZip" -ForegroundColor Red
    exit 1
}

Write-Host "Extracting template..." -ForegroundColor Green
Expand-Archive -Path $TemplateZip -DestinationPath $TemplateFolder -Force

# Get extracted folder (might be nested)
$ExtractedFolders = Get-ChildItem -Path $TemplateFolder -Directory
if ($ExtractedFolders.Count -eq 1) {
    $ExtractedFolder = $ExtractedFolders[0].FullName
    Write-Host "Moving files from nested folder..." -ForegroundColor Yellow
    Get-ChildItem -Path $ExtractedFolder | Move-Item -Destination $TemplateFolder -Force
    Remove-Item $ExtractedFolder -Force
}

# Create README
$ReadmePath = Join-Path $TemplateFolder "README.md"
$ReadmeContent = @"
# $TemplateName

Template downloaded from AZone Store.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

## Notes

- Downloaded: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- Source: AZone Store
"@

Set-Content -Path $ReadmePath -Value $ReadmeContent

Write-Host "`nTemplate organized successfully!" -ForegroundColor Green
Write-Host "Location: $TemplateFolder" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open folder in VS Code" -ForegroundColor White
Write-Host "2. Run: npm install" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White

