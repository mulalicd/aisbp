@echo off
echo ==========================================
echo  SYNCING PROJEKT SA GITHUB-OM
echo ==========================================
echo.

echo 1. Dodajem sve promjene...
git add .

echo.
echo 2. Kreiram commit...
git commit -m "Fix Execution Prompt: Corrected parser output, improved mock generation with HTML reports, resolved API route conflicts"

echo.
echo 3. Podesavam remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/mulalicd/aisbp.git

echo.
echo 4. Saljem na GitHub (main branch)...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo  USPJESNO ZAVRSENO!
echo ==========================================
pause
