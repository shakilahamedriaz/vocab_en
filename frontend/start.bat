@echo off
echo ========================================
echo  IELTS Vocab Platform - Frontend Setup
echo ========================================
echo.

cd /d "%~dp0"

echo Installing Node.js dependencies...
call npm install

echo.
echo Starting frontend development server...
call npm run dev
