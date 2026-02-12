@echo off
REM ============================================
REM AISBS - Complete App Recovery & Fresh Start
REM ============================================

echo.
echo ========================================
echo AISBS APP - CRASH RECOVERY PROCEDURE
echo ========================================
echo.

REM Step 1: Kill existing processes
echo [STEP 1/6] Killing existing processes on ports 3000 and 5000...
netstat -ano | findstr :3000 >nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul
    timeout /t 1 >nul
)

netstat -ano | findstr :5000 >nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F 2>nul
    timeout /t 1 >nul
)

echo [DONE] Processes killed.
echo.

REM Step 2: Clean frontend
echo [STEP 2/6] Cleaning frontend dependencies...
cd frontend

if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json 2>nul
)

echo Done.
echo.

REM Step 3: Fresh npm install frontend
echo [STEP 3/6] Installing frontend dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: npm install failed for frontend!
    pause
    exit /b 1
)

echo [DONE] Frontend dependencies installed.
echo.

REM Step 4: Clean backend
echo [STEP 4/6] Cleaning backend dependencies...
cd ..\backend

if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json 2>nul
)

echo Done.
echo.

REM Step 5: Fresh npm install backend
echo [STEP 5/6] Installing backend dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: npm install failed for backend!
    pause
    exit /b 1
)

echo [DONE] Backend dependencies installed.
echo.

REM Step 6: Instructions
echo [STEP 6/6] Ready to start!
echo.
echo ========================================
echo RECOVERY COMPLETE
echo ========================================
echo.
echo Next steps:
echo.
echo TERMINAL 1 (Backend):
echo   cd c:\PRIVATE\AI\AISBS\backend
echo   npm run dev
echo.
echo TERMINAL 2 (Frontend) - After backend starts:
echo   cd c:\PRIVATE\AI\AISBS\frontend
echo   npm start
echo.
echo BROWSER:
echo   http://localhost:3000
echo.
echo Then press F12 for Developer Tools and check Console for errors.
echo.

pause
