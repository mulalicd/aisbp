# AISBS Quick Start Guide

## 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd c:\PRIVATE\AI\AISBS
```

### Step 2: Install Dependencies
```bash
npm run install-all
```

This installs packages for:
- Root workspace
- Frontend (`frontend/package.json`)
- Backend (`backend/package.json`)

**Expected output**:
```
added X packages in Xs
...frontend setup...
...backend setup...
```

### Step 3: Start Development Environment
```bash
npm run dev
```

Two servers start automatically:
- **Frontend**: http://localhost:3000 (React dev server)
- **Backend**: http://localhost:5000 (Express API)

**Expected output**:
```
✓ AISBS Backend running on http://localhost:5000
✓ RAG system initialized with 10 chapters (50 problems)

Compiled successfully!

You can now view aisbs in the browser.
  Local:            http://localhost:3000
```

### Step 4: Open Browser
Navigate to **http://localhost:3000**

**Expected Flow**:
1. **Home Page**: Displays book title + 10 chapters (Financial Services, Healthcare, Manufacturing, etc.)
2. **Click a Chapter**: Shows chapter intro + 5 problems for that industry
3. **Click a Problem**: Shows problem details (narrative, workflow, business case, failure modes, ROI)
4. **Click a Prompt**: Opens split-view
   - Left: Prompt code
   - Right: Input form + execution button
5. **Execute**: Enter data (e.g., credit score, income) and click "Execute"
   - Mock output appears in right pane (JSON with result)

---

## Testing

### Run All Tests
```bash
npm test
```

**Expected**: 11 tests pass (6 validation + 5 RAG)

### Run Backend Tests Only
```bash
cd backend
npm test
```

### Run Frontend Tests (Optional)
```bash
cd frontend
npm test
```

---

## Build for Production

```bash
npm run build
```

This creates:
- `frontend/build/` - optimized React SPA
- `backend/server.js` - Express backend auto-serves static files

Deploy `build/` folder + backend on same server.

---

## Troubleshooting

### Port Already in Use
```bash
# Kill existing process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port
PORT=3001 npm run dev
```

### Can't Connect to Backend
Check:
1. Backend running: `npm run dev` runs both servers
2. Proxy configured: `frontend/package.json` has `"proxy": "http://localhost:5000"`
3. Firewall: Allow localhost connections

### Tests Failing
```bash
# Clear cache
npm test -- --clearCache

# Reinstall
cd backend && npm install
npm test
```

---

## Next Steps

### 1. Upload Real USTAV Documents
Replace mock data in `data/ustav.json`:
- Parse "AI SOLVED BUSINESS PROBLEMS.txt"
- Extract 10 chapters, 50 problems, prompts
- Maintain JSON structure

### 2. Extend Backend
- Add LLM integration (Claude/OpenAI API)
- Update `.env` with API keys
- Toggle `mode: 'llm'` in frontend

### 3. Customize UI
- Edit `frontend/src/App.css` for design tweaks
- Modify colors/typography while maintaining book design principle

### 4. Deploy
- Build: `npm run build`
- Deploy `frontend/build/` to CDN (Vercel/Netlify)
- Deploy `backend/` to cloud (Heroku/AWS/Azure)

---

## File Reference

| File | Purpose |
|------|---------|
| `data/ustav.json` | All 10 chapters, 50 problems, prompts |
| `frontend/src/App.js` | React router + context |
| `frontend/src/pages/*` | Page components (Home, Chapter, Problem, Prompt) |
| `backend/server.js` | Express server + USTAV loader |
| `backend/rag/index.js` | RAG engine (retrieve, augment, generate) |
| `backend/routes/api.js` | REST API endpoints (7 total) |
| `backend/validation/schemas.js` | Joi validation builder |
| `tests/*` | Jest tests (11 total) |

---

## Key Features

✅ **10 Industries** (50 problems total)
✅ **Mock Execution** (deterministic outputs)
✅ **Input Validation** (Joi schemas)
✅ **Split-View Prompts** (side-by-side code + results)
✅ **Book Cover Design** (exact UI replica)
✅ **No External APIs** (closed RAG system)
✅ **Full-Stack** (React + Node.js + Express)
✅ **Comprehensive Docs** (README, API, Architecture)

---

## Support

- **README.md**: Full setup + architecture overview
- **API.md**: REST API documentation + examples
- **ARCHITECTURE.md**: Technical deep dive
- **Tests**: See `tests/` for validation examples

---

**Version**: 1.0 | **Status**: Ready to use | **Last Updated**: 2024-02-10
