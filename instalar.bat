@echo off
echo ========================================
echo   BiblioTech - Instalador
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js instalado correctamente.
echo.

echo [2/4] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR al instalar dependencias del backend.
    pause
    exit /b 1
)
cd ..
echo.

echo [3/4] Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR al instalar dependencias del frontend.
    pause
    exit /b 1
)
cd ..
echo.

echo [4/4] Instalacion completada!
echo.
echo ========================================
echo   Para ejecutar el proyecto:
echo ========================================
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     cd frontend
echo     npm run dev
echo.
echo   Credenciales de administrador:
echo     Email: admin@biblioteca.com
echo     Contraseña: Admin123!
echo.
pause
