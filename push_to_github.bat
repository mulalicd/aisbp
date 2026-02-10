@echo off
echo ============================================
echo  Push AISBS projekta na GitHub
echo ============================================

setlocal enabledelayedexpansion

:: Postavi varijable
set REPO_URL=https://github.com/mulalicd/aisbs.git
set PROJECT_ROOT=C:\PRIVATE\AI\AISBS
set BRANCH=main

:: PRVO PRONAĐI GIT.EXE NA SISTEMU
set GIT_EXE=

:: Provjeri najčešće lokacije za Git
for %%p in (
    "C:\Program Files\Git\bin\git.exe"
    "C:\Program Files (x86)\Git\bin\git.exe"
    "C:\Git\bin\git.exe"
    "C:\msys64\usr\bin\git.exe"
    "C:\cygwin64\bin\git.exe"
    "D:\Program Files\Git\bin\git.exe"
    "D:\Git\bin\git.exe"
    "%USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe"
    "%USERPROFILE%\Downloads\PortableGit\bin\git.exe"
    "C:\PortableGit\bin\git.exe"
) do (
    if exist %%p (
        set GIT_EXE=%%p
        echo ✓ Git pronadjen: !GIT_EXE!
        goto git_found
    )
)

:: Ako nije pronadjen u standardnim lokacijama, traži u PATH-u
echo Trazim Git u PATH-u...
for %%i in (git.exe) do (
    set "test=%%~$PATH:i"
    if not "!test!"=="" (
        if exist "!test!" (
            set GIT_EXE=!test!
            echo ✓ Git pronadjen u PATH-u: !GIT_EXE!
            goto git_found
        )
    )
)

:: Git nije pronadjen
echo.
echo ERROR: Git nije pronadjen na sistemu!
echo.
echo Instalirajte Git sa ovog linka:
echo https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe
echo.
echo ILI preuzmite PORTABLE Git (bez instalacije):
echo https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/PortableGit-2.44.0-64-bit.7z.exe
echo Ekstraktujte u: C:\PortableGit
echo.
pause
exit /b 1

:git_found
echo.

:: Kreiraj alias za git komandu
set "GIT=!GIT_EXE!"

:: Prikazi verziju
echo Git verzija:
!GIT! --version
echo.

:: Idi u root projekta
cd /d "%PROJECT_ROOT%"
if errorlevel 1 (
    echo ERROR: Ne mogu pristupiti: %PROJECT_ROOT%
    pause
    exit /b 1
)

echo ✓ Radim u: %cd%
echo.

:: Postavi Git username i email ako nisu postavljeni
!GIT! config --global user.name "aisbs-user" >nul 2>nul
!GIT! config --global user.email "aisbs@example.com" >nul 2>nul

:: Inicijaliziraj repozitorij ako ne postoji
if not exist ".git" (
    echo Inicijalizacija Git repozitorija...
    !GIT! init
    !GIT! remote add origin "%REPO_URL%"
    echo ✓ Repozitorij inicijalizovan
) else (
    echo ✓ Git repozitorij vec postoji
)

echo.
echo Dodajem sve fajlove...
!GIT! add --all

echo Komitam promjene...
!GIT! commit -m "AISBS projekt push: %date% %time%"

echo Push na GitHub...
!GIT! push -u origin %BRANCH% --force

if errorlevel 1 (
    echo.
    echo ERROR: Push nije uspio.
    echo.
    echo Probajte ručno:
    echo 1. Otvorite Command Prompt
    echo 2. cd C:\PRIVATE\AI\AISBS
    echo 3. git push https://github.com/mulalicd/aisbs.git
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  USPJEH! Projekat je push-ovan na GitHub!
echo ============================================
echo Repozitorij: %REPO_URL%
echo Datum: %date% %time%
echo ============================================
echo.
pause