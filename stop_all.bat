@echo off
title Stop All Microservices
echo ========================================================
echo            STOPPING ALL MICROSERVICES
echo ========================================================
echo.

set PORTS=5000 5001 5002 5003 5004

for %%P in (%PORTS%) do (
    echo Checking port %%P...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r /c:":%%P *LISTENING"') do (
        echo   - Found process on port %%P [PID: %%a]. Stopping...
        taskkill /F /PID %%a >nul 2>&1
    )
)

:: PowerShell cleanup to ensure all listening processes on ports 5000-5004 are stopped
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 5000,5001,5002,5003,5004 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo.
echo ========================================================
echo   All microservices on ports 5000-5004 have been stopped.
echo ========================================================
echo.
pause
