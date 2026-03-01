@echo off
setlocal enabledelayedexpansion

:: Konfiguracija
set "SOURCE=C:\PRIVATE\AI\AISBP_1\genspark-webapp"
set "REPO_URL=https://github.com/PromptHeroStudio/genspark-aisbp.git"
set "BRANCH=main"
set "LOG=backup_log_%DATE:~-4,4%%DATE:~-10,2%%DATE:~-7,2%.txt"

:: Boje za CMD (opcionalno)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "RESET=[0m"

cls
echo %YELLOW%========================================%RESET%
echo %YELLOW%     GITHUB BACKUP SCRIPT v1.0         %RESET%
echo %YELLOW%========================================%RESET%
echo.

:: Provjera potrebnih alata
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%ERROR: Git nije instaliran ili nije u PATH%RESET%
    echo Preuzmite git sa: https://git-scm.com/downloads
    pause
    exit /b 1
)

:: Provjera source direktorija
if not exist "%SOURCE%" (
    echo %RED%ERROR: Source direktorij ne postoji%RESET%
    echo %SOURCE%
    pause
    exit /b 1
)

echo %GREEN%[OK] Source direktorij pronaden%RESET%
echo.

:: Brojanje datoteka
set /a count=0
for /r "%SOURCE%" %%f in (*) do set /a count+=1
echo %YELLOW%Pronadeno %count% datoteka za backup%RESET%
echo.

:: Privremeni direktorij
set "TEMP_REPO=%TEMP%\github_backup_%RANDOM%"
mkdir "%TEMP_REPO%"
cd /d "%TEMP_REPO%"

echo 1. Kloniram repozitorij...
git clone %REPO_URL% repo
if !errorlevel! neq 0 (
    echo %RED%ERROR: Ne mogu klonirati repozitorij%RESET%
    echo Provjerite URL i pristup
    pause
    exit /b 1
)
echo %GREEN%[OK] Repozitorij kloniran%RESET%

echo 2. Kopiram datoteke...
cd repo
robocopy "%SOURCE%" "." /E /COPY:DAT /R:3 /W:5 /NP /NDL /NFL >nul
echo %GREEN%[OK] Datoteke kopirane%RESET%

echo 3. Git operacije...
git add -A >nul 2>&1

:: Provjera ima li promjena
git diff --cached --quiet
if !errorlevel! equ 0 (
    echo %YELLOW%Nema promjena za commit%RESET%
) else (
    set "timestamp=%DATE% %TIME%"
    git commit -m "Backup %timestamp%" >nul 2>&1
    echo %GREEN%[OK] Commit kreiran%RESET%
    
    echo 4. Pusham na GitHub...
    git push origin %BRANCH%
    if !errorlevel! neq 0 (
        echo %RED%ERROR: Push neuspjesan%RESET%
        echo Molimo ručno riješite konflikt
        pause
        exit /b 1
    )
    echo %GREEN%[OK] Push uspjesan%RESET%
)

echo.
echo %GREEN%========================================%RESET%
echo %GREEN%     BACKUP ZAVRSEN - %DATE%           %RESET%
echo %GREEN%========================================%RESET%
echo.
echo Log spremljen u: %CD%\%LOG%
echo.

:: Čišćenje
cd /d "%TEMP%"
rmdir /s /q "%TEMP_REPO%" 2>nul

pause