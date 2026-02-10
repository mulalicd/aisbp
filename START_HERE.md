# 🎯 START HERE

Welcome to **AISBS** (AI Solved Business Solutions)!

This document guides you through the system in 60 seconds.

---

## ⚡ Get Running (2 minutes)

```bash
# 1. Install all dependencies
npm run install-all

# 2. Start both servers
npm run dev
```

**That's it!** Your AISBS instance is live:
- 🎨 Frontend: http://localhost:3000
- 🚀 Backend: http://localhost:5000/api/health

---

## 🏃 First 10 Seconds: What You'll See

1. **Homepage**: Giant book title "AI SOLVED BUSINESS PROBLEMS"
2. **Below**: 10 chapter links (Financial Services, Healthcare, Manufacturing, etc.)
3. **Click any chapter** → See 5 problems for that industry
4. **Click a problem** → Full details (narrative, workflow, ROI, failure modes)
5. **Click a prompt** → Split-view: Left=code, Right=execute with input/output

---

## 📚 What This System Does

**AISBS** is an interactive workbook that:

✅ **Presents 50 business problems** across 10 industries  
✅ **Guides you through each problem** with narrative → workflow → execution  
✅ **Lets you simulate solutions** by entering data and executing prompts  
✅ **Returns deterministic mock results** (or real LLM inference if configured)  
✅ **Works entirely offline** (no external APIs needed)  

---

## 🎓 Try This First

1. Open browser → http://localhost:3000
2. Click "Financial Services" (Chapter 1)
3. Click "Problem 1: Credit Risk Assessment at Scale"
4. Read the full problem description
5. Scroll to "Prompts & Execution"
6. Click "Risk Scoring Wizard"
7. **In the right pane**, enter example data:
   - `borrowerId`: CUST_789
   - `creditScore`: 720
   - `income`: 150000
   - `loanAmount`: 250000
8. Click "Execute"
9. **See the output**: Risk score, recommendation, factors, etc.

**That demonstrates the entire RAG system!**

---

## 📖 Documentation

Choose based on what you need:

| Document | For Whom | Read Time |
|----------|----------|-----------|
| **QUICKSTART.md** | Everyone | 5 min |
| **README.md** | Deployers | 15 min |
| **API.md** | Developers | 20 min |
| **ARCHITECTURE.md** | Architects | 20 min |
| **PROJECT_MANIFEST.md** | Admins | 10 min |
| **PROJECT_OVERVIEW.md** | Curious | 15 min |

---

## 🎯 Key Concepts

### What's a "Chapter"?
An industry (Financial Services, Healthcare, Retail, etc.). AISBS covers 10 total.

### What's a "Problem"?
A real business challenge in that industry. Each chapter has 5, so 50 total.

### What's a "Prompt"?
An AI prompt that solves the problem. You input data, the prompt analyzes it, and returns a result.

### What's "Mock Mode"?
Default execution mode. Returns hardcoded results from the book (deterministic, instant). Perfect for demos.

### What's "LLM Mode"?
Optional. Calls real AI API (Claude/ChatGPT). Add `OPENAI_API_KEY` to .env to enable.

---

## 🧪 Test It

All 11 tests pass:

```bash
npm test
```

Output:
```
PASS  tests/validation.test.js (6 tests)
PASS  tests/rag.test.js (5 tests)
```

---

## 🚀 Production Setup

When ready to deploy:

```bash
# Build optimized frontend
npm run build

# Start backend server
cd backend && npm start
```

Backend serves:
- REST API on port 5000
- Static frontend build (if using single server)

Deploy to: Vercel (frontend), Heroku/AWS (backend)

---

## 🎨 Customize It

All styling in `frontend/src/App.css`. Book design is replicated exactly:
- Red sidebar: `#D32F2F`
- Title font: Ultra-bold sans-serif
- No extra colors/animations (by design)

---

## ➕ Add LLM Integration

Want real AI inference instead of mock results?

1. Get API key from OpenAI or Anthropic
2. Create `.env` file:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Restart backend
4. Toggle "LLM" mode in frontend UI
5. Real inference works (with fallback to mock)

---

## 📊 Example: What a Prompt Does

**Prompt**: "Risk Scoring Wizard" (Problem 1.1)

**Input**:
```json
{
  "borrowerId": "CUST_789",
  "creditScore": 720,
  "income": 150000,
  "loanAmount": 250000,
  "employmentYears": 8,
  "debtToIncome": 0.42
}
```

**Processing** (in backend):
1. Validate input matches schema ✓
2. Retrieve prompt + context ✓
3. Augment with user data ✓
4. Generate output (mock or LLM) ✓

**Output**:
```json
{
  "riskScore": 6.2,
  "riskLevel": "MODERATE",
  "recommendation": "CONDITIONAL_APPROVE",
  "factors": [
    {"factor": "Credit Score 720", "impact": "Positive"},
    ...
  ],
  "conditions": [
    "Require co-signer for loans >$200K",
    ...
  ]
}
```

---

## 🔍 Check System Health

```bash
# API is running?
curl http://localhost:5000/api/health

# Got data?
curl http://localhost:5000/api/chapters

# Try a prompt?
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"promptId":"ch1_p1_pr1","userData":{"creditScore":720},"mode":"mock"}'
```

---

## 🆘 Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Port 3000 in use | `PORT=3001 npm run dev` |
| Port 5000 in use | `PORT=5001 npm run dev` (backend only) |
| Can't connect frontend to backend | Check `frontend/package.json` has `"proxy": "http://localhost:5000"` |
| Tests fail | `npm install` in backend, then `npm test` |
| Data not loading | Check `data/ustav.json` exists and is valid JSON |

---

## 📞 Next Steps

### Immediate (Next 10 minutes)
1. Run `npm run dev`
2. Explore all 10 chapters
3. Execute a few mock prompts
4. Read QUICKSTART.md

### Soon (Next 1-2 hours)
1. Read README.md (full setup guide)
2. Review API.md (understand REST API)
3. Check Project structure in PROJECT_MANIFEST.md

### Later (When ready)
1. Replace mock data with real USTAV documents
2. Add LLM integration (optional)
3. Deploy to cloud

---

## 📝 System Architecture (30-second version)

```
User clicks prompt
    ↓
Frontend sends data to backend API
    ↓
Backend validates input (Joi schema)
    ↓
RAG system retrieves prompt + context
    ↓
Augment (combine prompt + user data)
    ↓
Generate (mock output or LLM call)
    ↓
Return JSON result to frontend
    ↓
Frontend displays in split-view
```

**All data**: Embedded JSON (no database, no external APIs)

---

## 🎯 Key Features

✅ **10 Industries**: Finance, Healthcare, Retail, Manufacturing, Energy, Education, Government, Marketing, IT, Sustainability  
✅ **50 Problems**: 5 per industry, each fully detailed  
✅ **50+ Prompts**: Ready to execute  
✅ **Book Design**: Exact replica of cover (red sidebar, typography)  
✅ **Split-View**: Code + execution side-by-side  
✅ **Validation**: Input schemas ensure data quality  
✅ **Mock Mode**: Instant results for demos  
✅ **LLM Ready**: Optional real AI inference  
✅ **Comprehensive Docs**: 1200+ lines of guides  
✅ **Tested**: 11 Jest tests, all passing  

---

## 🎉 You're Ready!

```bash
npm run dev
```

Then open http://localhost:3000

**Explore. Experiment. Execute.**

---

**Questions?**
- Problems running? → See QUICKSTART.md
- How does it work? → See ARCHITECTURE.md
- What API endpoints? → See API.md
- Full setup? → See README.md

---

**AISBS Version 1.0 | Ready to Use! 🚀**
