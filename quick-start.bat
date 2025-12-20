@echo off
REM Blinkey It - Quick Start Script for Windows
REM This script helps you get started quickly with the project

echo.
echo ========================================
echo   Blinkey It - Quick Start Setup
echo ========================================
echo.

echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [+] Node.js installed: %NODE_VERSION%

where mongosh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    where mongo >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [!] MongoDB CLI not found. You'll need MongoDB running or use MongoDB Atlas.
    ) else (
        echo [+] MongoDB CLI found
    )
) else (
    echo [+] MongoDB CLI found
)

echo.
echo Installing dependencies...
echo.

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install server dependencies
    cd ..
    pause
    exit /b 1
)
echo [+] Server dependencies installed

REM Install client dependencies
echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
echo [+] Client dependencies installed

cd ..

echo.
echo Setting up environment files...
echo.

REM Create .env files if they don't exist
if not exist "server\.env" (
    copy server\.env.example server\.env >nul
    echo [+] Created server\.env from template
    echo [!] Please edit server\.env with your configuration
) else (
    echo [!] server\.env already exists
)

if not exist "client\.env" (
    copy client\.env.example client\.env >nul
    echo [+] Created client\.env from template
    echo [!] Please edit client\.env with your configuration
) else (
    echo [!] client\.env already exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Configure your environment variables:
echo    - Edit server\.env with your MongoDB URI, JWT secrets, etc.
echo    - Edit client\.env with your API URL
echo.
echo 2. Start the development servers:
echo    Terminal 1: cd server ^&^& npm run dev
echo    Terminal 2: cd client ^&^& npm run dev
echo.
echo 3. Access the application:
echo    - Frontend: http://localhost:5173
echo    - Backend: http://localhost:8080
echo    - Health Check: http://localhost:8080/health
echo.
echo Documentation:
echo    - README.md - Project overview
echo    - SETUP_GUIDE.md - Detailed setup instructions
echo    - API_DOCUMENTATION.md - API reference
echo    - SECURITY.md - Security guidelines
echo.
echo Happy coding!
echo.
pause
