# 🚀 QUICK START GUIDE - AISBS WEB APP

## ⚡ NAJBRŽI PUT (3 koraka)

### 1️⃣ Recovery (Optional - ako se pojave greške)
```bash
cd c:\PRIVATE\AI\AISBS
recovery-and-fresh-start.bat
# Čeka se: "RECOVERY COMPLETE"
```

### 2️⃣ Terminal 1 - Backend Server
```bash
cd c:\PRIVATE\AI\AISBS\backend
npm run dev
```

**Čeka se:**
```
✓ Loaded USTAV data with 1 chapters and 1 problems
✓ Server running on port 5000
```

### 3️⃣ Terminal 2 - Frontend App
```bash
cd c:\PRIVATE\AI\AISBS\frontend
npm start
```

**Čeka se:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## ✅ U BROWSER-U

```
http://localhost:3000
```

**Trebao viditi:**
- Red sidebar (3% left)
- "AI SOLVED BUSINESS PROBLEMS" naslov
- "50 Real-World Challenges..." subtitle
- Chapter 1 card
- Author: "Davor Mulalić"

---

## 🔍 TROUBLESHOOTING

### ❌ "Port 3000 already in use"
```bash
# Kill port 3000
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### ❌ "Cannot find module axios"
```bash
cd frontend
npm install axios
cd ../backend
npm install axios
```

### ❌ "Cannot connect to localhost:5000"
- Backend nije pokrenut!
- Provjerite Terminal 1
- Vidi greške u console-u

### ❌ "Blank white screen"
- Otvori F12 (Developer Tools)
- Klikni Console tab
- Provjeri greške
- Refresh stranicu (Ctrl+R)

---

## 📋 FILE CHECKLIST

| File | Status |
|------|--------|
| `frontend/src/pages/Home.js` | ✅ Updated |
| `frontend/public/index.html` | ✅ Updated |
| `backend/routes/api.js` | ✅ Working |
| `data/ustav.json` | ✅ Complete |
| all node_modules | ❓ Need to install |

---

## 💡 TIPS

1. **Always start Backend FIRST** (Terminal 1)
2. **Wait 5 seconds** before starting Frontend
3. **Never close terminal windows** - they keep servers running
4. **F12 is your friend** - check Console for errors
5. **Refresh browser** (Ctrl+R) if nothing shows

---

## 🎯 SUCCESS CHECKLIST

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Compiled successfully!"
- [ ] Browser shows home page with red sidebar
- [ ] No errors in browser console (F12)
- [ ] Can click "Chapter 1" without errors
- [ ] Can see "The Freight Leak" problem

**If all ✅ - YOU'RE DONE! App je spreman! 🎉**

---

## 📞 IF PROBLEMS PERSIST

1. Run recovery script: `recovery-and-fresh-start.bat`
2. Check DIAGNOSTIC_REPORT.md for detailed analysis
3. Look for error messages in console
4. Check that ports 3000 and 5000 are not blocked
5. Make sure you have Node.js installed (check: `node -v`)

---

**ACA, slijedi ove 3 koraka tačno kako napisano. Report status! 🚀**
