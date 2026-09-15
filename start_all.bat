@echo off
title Start All Microservices
echo ========================================================
echo           STARTING ALL MICROSERVICES
echo ========================================================
echo.

set ROOT_DIR=%~dp0

:: 1. Registration Service (Port 5001)
echo [1/5] Launching Registration Service (Port 5001)...
start "Microservice: Registration (Port 5001)" cmd /k "cd /d "%ROOT_DIR%Registration" && title Registration Service [Port 5001] && node index.js"

:: 2. Login Service (Port 5002)
echo [2/5] Launching Login Service (Port 5002)...
start "Microservice: Login (Port 5002)" cmd /k "cd /d "%ROOT_DIR%Login" && title Login Service [Port 5002] && node index.js"

:: 3. Admin Service (Port 5003)
echo [3/5] Launching Admin Service (Port 5003)...
start "Microservice: Admin (Port 5003)" cmd /k "cd /d "%ROOT_DIR%Admin" && title Admin Service [Port 5003] && node index.js"

:: 4. User Service (Port 5004)
echo [4/5] Launching User Service (Port 5004)...
start "Microservice: User (Port 5004)" cmd /k "cd /d "%ROOT_DIR%User" && title User Service [Port 5004] && node index.js"

:: 5. API Gateway (Port 5000)
echo [5/5] Launching API Gateway (Port 5000)...
start "Microservice: API Gateway (Port 5000)" cmd /k "cd /d "%ROOT_DIR%APIgateway" && title API Gateway [Port 5000] && node index.js"

echo.
echo ========================================================
echo   All 5 services have been started in separate windows!
echo.
echo   - API Gateway:          http://localhost:5000
echo   - Registration Service: http://localhost:5001
echo   - Login Service:        http://localhost:5002
echo   - Admin Service:        http://localhost:5003
echo   - User Service:         http://localhost:5004
echo.
echo   To stop all services, run stop_all.bat
echo ========================================================
echo.
pause
