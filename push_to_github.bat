@echo off
:: Fast push skripta za AISBS
:: Sačuvaj kao: C:\PRIVATE\AI\AISBS\push.bat

cd /d "C:\PRIVATE\AI\AISBS"

echo AISBS GitHub Push (main grana)
echo ===============================

:: Provjeri da li smo na main
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%i"
if not "%CURRENT_BRANCH%"=="main" (
    echo Niste na main grani! Trenutno: %CURRENT_BRANCH%
    echo Prebacujem na main...
    git checkout main 2>nul
)

:: Add, commit, push
git add --all
git commit -m "Update: %date% %time%"
git push origin main

echo.
echo ✓ Push-ovano na: https://github.com/mulalicd/aisbs
echo.
pause