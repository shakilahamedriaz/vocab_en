@echo off
echo ========================================
echo  IELTS Vocab Platform - Quick Start
echo ========================================
echo.
echo This will start both backend and frontend.
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop both servers.
echo ========================================
echo.

start "IELTS Backend" cmd /c "cd /d %~dp0backend && start.bat"
timeout /t 5 /nobreak > nul
start "IELTS Frontend" cmd /c "cd /d %~dp0frontend && start.bat"

echo Both servers are starting...
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
