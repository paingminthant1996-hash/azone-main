# Project Cleanup Script
# Removes unnecessary files and folders

Write-Host "🧹 Cleaning up project..." -ForegroundColor Cyan

# Files to keep (essential documentation)
$keepFiles = @(
    "README.md",
    "README_SETUP.md",
    "PROJECT_STATUS_FINAL.md"
)

# Get all .md files
$mdFiles = Get-ChildItem -Path . -Filter "*.md" -File

# Delete guide files (except essential ones)
$deletedCount = 0
foreach ($file in $mdFiles) {
    if ($keepFiles -notcontains $file.Name) {
        Write-Host "Deleting: $($file.Name)" -ForegroundColor Yellow
        Remove-Item $file.FullName -Force
        $deletedCount++
    }
}

Write-Host "✅ Deleted $deletedCount guide files" -ForegroundColor Green

# Delete test results
if (Test-Path "test-results") {
    Write-Host "Deleting: test-results/" -ForegroundColor Yellow
    Remove-Item "test-results" -Recurse -Force
    Write-Host "✅ Deleted test-results/" -ForegroundColor Green
}

if (Test-Path "playwright-report") {
    Write-Host "Deleting: playwright-report/" -ForegroundColor Yellow
    Remove-Item "playwright-report" -Recurse -Force
    Write-Host "✅ Deleted playwright-report/" -ForegroundColor Green
}

# Delete build artifacts
if (Test-Path ".next") {
    Write-Host "Deleting: .next/ (build output)" -ForegroundColor Yellow
    Remove-Item ".next" -Recurse -Force
    Write-Host "✅ Deleted .next/" -ForegroundColor Green
}

if (Test-Path ".swc") {
    Write-Host "Deleting: .swc/ (build cache)" -ForegroundColor Yellow
    Remove-Item ".swc" -Recurse -Force
    Write-Host "✅ Deleted .swc/" -ForegroundColor Green
}

# Delete temporary text files
$tempFiles = Get-ChildItem -Path . -Filter "*.txt" -File | Where-Object { $_.Name -like "*EDGE_FUNCTION*" -or $_.Name -like "*TEMP*" }
foreach ($file in $tempFiles) {
    Write-Host "Deleting: $($file.Name)" -ForegroundColor Yellow
    Remove-Item $file.FullName -Force
    $deletedCount++
}

Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Kept essential files:" -ForegroundColor Cyan
foreach ($file in $keepFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor White
    }
}

