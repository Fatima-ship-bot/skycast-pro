#!/usr/bin/env powershell

# SkyCast Pro - Deployment Setup Script
# This script helps with the final deployment steps

Write-Host "🚀 SkyCast Pro - Final Deployment Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Display GitHub Secrets
Write-Host "📋 STEP 1: Add GitHub Secrets`n" -ForegroundColor Yellow
Write-Host "Go to: https://github.com/Fatima-ship-bot/skycast-pro/settings/secrets/actions`n" -ForegroundColor Green

Write-Host "Add these 2 repository secrets:`n" -ForegroundColor White
Write-Host "Secret 1: VITE_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "Value: https://wsslqogckvtuttcpzcgc.supabase.co`n" -ForegroundColor Green

Write-Host "Secret 2: VITE_SUPABASE_KEY" -ForegroundColor Cyan
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzc2xxb2dja3Z0dXR0Y3B6Y2djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzEwNTIsImV4cCI6MjA5MzY0NzA1Mn0._UnsY8JFEuJ2PX3GtuK56xwGR76bM5SrvHnacSYRFRA"
Write-Host "Value: $key`n" -ForegroundColor Green

Write-Host "⚠️  IMPORTANT: Copy and paste EXACTLY as shown above.`n" -ForegroundColor Yellow

# Step 2: Instructions for Supabase Migrations
Write-Host "`n📋 STEP 2: Deploy Database Migrations`n" -ForegroundColor Yellow
Write-Host "Go to: https://app.supabase.com/project/wsslqogckvtuttcpzcgc`n" -ForegroundColor Green

Write-Host "1. Click 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "2. Click 'New Query'" -ForegroundColor White
Write-Host "3. Copy the entire contents of: SUPABASE_MANUAL_MIGRATIONS.sql" -ForegroundColor White
Write-Host "4. Paste into the SQL Editor" -ForegroundColor White
Write-Host "5. Click 'Run' (or press Ctrl+Enter)" -ForegroundColor White
Write-Host "6. Wait for all migrations to complete`n" -ForegroundColor White

# Check if .env.github exists
Write-Host "`n✅ To help with deployment, you can:" -ForegroundColor Green
Write-Host "   1. Open this file to copy the secrets easily" -ForegroundColor White
Write-Host "   2. Follow the Supabase migration steps manually`n" -ForegroundColor White

Write-Host "Once both steps are complete:" -ForegroundColor Cyan
Write-Host "✅ Your app will be live at: https://Fatima-ship-bot.github.io/skycast-pro/" -ForegroundColor Green
Write-Host "✅ Backend will be fully connected to Supabase" -ForegroundColor Green
Write-Host "✅ All features will be functional`n" -ForegroundColor Green

Write-Host "Need help? Check QUICK_DEPLOYMENT.md for more details." -ForegroundColor Yellow
