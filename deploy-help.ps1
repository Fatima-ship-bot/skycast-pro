# PowerShell Deployment Helper Script
# Run: .\deploy-setup.ps1

Write-Host ""
Write-Host "SkyCast Pro - Final Deployment Helper" -ForegroundColor Cyan
Write-Host "Everything is prepared and ready to deploy!" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# STEP 1: Show Supabase Credentials
# ============================================================
Write-Host "STEP 1: Deploy Database Migrations" -ForegroundColor Yellow
Write-Host ""

Write-Host "Your Supabase Project Details:" -ForegroundColor Green
Write-Host "  Project ID: wsslqogckvtuttcpzcgc" -ForegroundColor White
Write-Host "  Project URL: https://wsslqogckvtuttcpzcgc.supabase.co" -ForegroundColor White
Write-Host ""

Write-Host "Follow these exact steps:" -ForegroundColor Cyan
Write-Host "  1. Open: https://app.supabase.com/project/wsslqogckvtuttcpzcgc" -ForegroundColor White
Write-Host "  2. Click: SQL Editor (left sidebar)" -ForegroundColor White
Write-Host "  3. Click: New Query" -ForegroundColor White
Write-Host "  4. Copy: SUPABASE_MANUAL_MIGRATIONS.sql (entire file)" -ForegroundColor White
Write-Host "  5. Paste into: SQL Editor query box" -ForegroundColor White
Write-Host "  6. Click: Run (or press Ctrl+Enter)" -ForegroundColor White
Write-Host "  7. Wait for: 'Query completed successfully'" -ForegroundColor White
Write-Host ""

$response = Read-Host "Have you completed Step 1? (yes/no)"
if ($response -eq "yes") {
    Write-Host "Great! Step 1 complete." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "You can come back to this script once Step 1 is done." -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================
# STEP 2: Show GitHub Secrets
# ============================================================
Write-Host "STEP 2: Add GitHub Repository Secrets" -ForegroundColor Yellow
Write-Host ""

Write-Host "Your Credentials (ready to copy):" -ForegroundColor Green
Write-Host ""
Write-Host "Secret 1:" -ForegroundColor Cyan
Write-Host "  Name:  VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "  Value: https://wsslqogckvtuttcpzcgc.supabase.co" -ForegroundColor Green

Write-Host ""
Write-Host "Secret 2:" -ForegroundColor Cyan
Write-Host "  Name:  VITE_SUPABASE_KEY" -ForegroundColor White
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzc2xxb2dja3Z0dXR0Y3B6Y2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzEwNTIsImV4cCI6MjA5MzY0NzA1Mn0._UnsY8JFEuJ2PX3GtuK56xwGR76bM5SrvHnacSYRFRA"
Write-Host "  Value: $apiKey" -ForegroundColor Green

Write-Host ""
Write-Host "Follow these exact steps:" -ForegroundColor Cyan
Write-Host "  1. Open: https://github.com/Fatima-ship-bot/skycast-pro/settings/secrets/actions" -ForegroundColor White
Write-Host "  2. Click: 'New repository secret'" -ForegroundColor White
Write-Host "  3. Enter Name: VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "  4. Enter Value: https://wsslqogckvtuttcpzcgc.supabase.co" -ForegroundColor White
Write-Host "  5. Click: 'Add secret'" -ForegroundColor White
Write-Host "  6. Repeat steps 2-5 with VITE_SUPABASE_KEY (copy entire value)" -ForegroundColor White
Write-Host "  7. Verify: Both secrets appear in the list" -ForegroundColor White
Write-Host ""

$response2 = Read-Host "Have you completed Step 2? (yes/no)"
if ($response2 -eq "yes") {
    Write-Host "Excellent! Step 2 complete." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "You can come back to this script once Step 2 is done." -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================
# COMPLETION
# ============================================================
if ($response -eq "yes" -and $response2 -eq "yes") {
    Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Your app is now live at:" -ForegroundColor Cyan
    Write-Host "https://Fatima-ship-bot.github.io/skycast-pro/" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "GitHub Actions is now building with your secrets..." -ForegroundColor White
    Write-Host "Check progress: https://github.com/Fatima-ship-bot/skycast-pro/actions" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Next, test your app:" -ForegroundColor Yellow
    Write-Host "  - Visit the app URL above" -ForegroundColor White
    Write-Host "  - Search for a city" -ForegroundColor White
    Write-Host "  - Sign up with email" -ForegroundColor White
    Write-Host "  - Create a favorite" -ForegroundColor White
    Write-Host "  - Set a weather alert" -ForegroundColor White
    Write-Host ""
    
    Write-Host "You're ready! Enjoy your weather app!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Please complete the steps above, then run this script again." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "For more details, check: COPY_PASTE_DEPLOYMENT.md" -ForegroundColor Gray
Write-Host ""
