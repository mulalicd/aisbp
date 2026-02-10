@echo off
echo Starting AISBS Development Servers...
echo.
echo Starting backend development server...
start "AISBS Backend" cmd /k "cd backend && npm run dev"
echo.
echo Starting frontend development server...
start "AISBS Frontend" cmd /k "cd frontend && npm start"
echo.
echo Both servers are running in separate windows
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
