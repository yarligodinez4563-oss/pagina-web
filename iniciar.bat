@echo off
echo ========================================
echo   BiblioTech - Iniciando servidores
echo ========================================
echo.

start "Backend - BiblioTech" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend - BiblioTech" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados en ventanas separadas.
echo Backend: http://localhost:3001/api
echo Frontend: http://localhost:5173
echo.
pause
