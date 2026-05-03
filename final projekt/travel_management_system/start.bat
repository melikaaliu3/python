@echo off
echo ========================================
echo   Travel Management System Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Check if requirements are installed
echo 📦 Installing dependencies...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo.
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Start the application
echo 🚀 Starting Travel Management System...
echo 📍 Application will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo ⏹️  Press Ctrl+C to stop the server
echo ========================================
echo.

python start_app.py

pause
