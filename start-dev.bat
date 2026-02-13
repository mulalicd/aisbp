@echo off
REM Ensure System32 is in PATH for cmd.exe
set PATH=%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem;%PATH%

echo STARTING AISBS CLEANUP...
echo ------------------------------------------

REM Kill any existing node.exe processes to free up ports 3000 and 5000
echo | set /p="> Stopping existing node processes... "
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 ( echo DONE ) else ( echo NONE FOUND )

echo.
echo Starting AISBS Development Environment (Unified Log)...
echo This will launch both Backend (Port 5000) and Frontend (Port 3000) in this window.
echo Press Ctrl+C to stop both servers.
echo.

REM Try executing directly to see if simple NPM works
call npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start unified dev server.
    echo Fallback: Launching separately...
    start "AISBS Backend" cmd /k "cd backend && npm run dev"
    start "AISBS Frontend" cmd /k "cd frontend && npm start"
)
pause
