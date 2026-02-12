@ECHO OFF
REM Simple script to parse, verify, and start server

SETLOCAL ENABLEDELAYEDEXPANSION

CD /D c:\PRIVATE\AI\AISBS

ECHO Deleting old JSON...
IF EXIST data\ustav.json DEL data\ustav.json

ECHO Running parser...
node backend\scripts\parseBook.js

ECHO.
ECHO Checking if JSON was created...
IF EXIST data\ustav.json (
  ECHO ✓ JSON file created
  ECHO.
  ECHO Starting backend server...
  START /B node backend\server.js
  TIMEOUT /T 3 /NOBREAK
  
  ECHO.
  ECHO Testing API endpoints...
  
  REM Test using PowerShell
  PowerShell -Command ^
    "$try = $true; " ^
    "try { " ^
    "$resp = Invoke-WebRequest -Uri 'http://localhost:5000/api/chapters' -Method Get -ErrorAction Stop; " ^
    "$data = $resp.Content | ConvertFrom-Json; " ^
    "Write-Host '✓ GET /api/chapters - Status: ' $resp.StatusCode; " ^
    "Write-Host '  Chapters returned: ' $data.totalChapters; " ^
    "Write-Host '  Problems returned: ' $data.totalProblems; " ^
    "} catch { " ^
    "Write-Host '✗ Error: ' $_.Message; " ^
    "$try = $false; " ^
    "} " ^
    "exit ($try ? 0 : 1)"
  
  ECHO.
  ECHO Frontend running at: http://localhost:5000
  ECHO.
) ELSE (
  ECHO ✗ JSON file was NOT created - Parse failed
  EXIT /B 1
)
