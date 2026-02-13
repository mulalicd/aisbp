# AI SOLVED BUSINESS SOLUTIONS (AISBS)

A closed RAG (Retrieval-Augmented Generation) web application that transforms "AI Solved Business Problems" into an interactive, guided experience. AISBS is a secure, locally-deployed system with no external APIs or data influences—all content derives from the USTAV (four foundational documents).

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Windows, macOS, or Linux

### Installation

1. **Clone/Navigate to project**:
   ```bash
   cd c:\PRIVATE\AI\AISBS
   ```

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

   This installs dependencies for root, frontend, and backend.

3. **Start development servers**:
   ```bash
   npm run dev
   ```

   - React frontend: `http://localhost:3000`
   - Express backend: `http://localhost:5000`
   - Frontend proxy to backend automatically configured

4. **Open browser** and navigate to `http://localhost:3000`

## Project Structure

```
aisbs/
├── package.json                    # Root config + workspace scripts
├── frontend/
│   ├── public/index.html           # HTML entry point
│   ├── src/
│   │   ├── App.js                  # Main React component + routing
│   │   ├── App.css                 # Book design styles (exact replica)
│   │   ├── index.css               # Global styles
│   │   ├── index.js                # React entry point
│   │   ├── components/
│   │   │   ├── Layout.js           # Sidebar + main content wrapper
│   │   │   ├── Sidebar.js          # Fixed red sidebar (#D32F2F)
│   │   │   ├── Breadcrumbs.js      # Navigation breadcrumbs
│   │   │   └── PromptSplitView.js  # Split-view for prompt execution
│   │   ├── pages/
│   │   │   ├── Home.js             # Dashboard: chapters list
│   │   │   ├── ChapterView.js      # Chapter intro + problems (1-5)
│   │   │   ├── ProblemView.js      # Problem details + prompts
│   │   │   └── PromptExecution.js  # Split-view execution page
│   │   └── api/
│   │       └── client.js           # Axios HTTP client (optional future)
│   └── package.json                # Frontend dependencies
├── backend/
│   ├── server.js                   # Express app setup
│   ├── rag/
│   │   └── index.js                # RAG system (retrieve, augment, generate)
│   ├── validation/
│   │   └── schemas.js              # Joi validation schemas
│   ├── routes/
│   │   └── api.js                  # REST API endpoints
│   └── package.json                # Backend dependencies
├── data/
│   └── ustav.json                  # Parsed USTAV data (10 chapters, 50 problems, prompts)
├── tests/
│   ├── validation.test.js          # Jest tests for Joi schemas
│   └── rag.test.js                 # Jest tests for RAG system
└── README.md                        # This file
```

## Core Concepts

### USTAV (Bounded Content)
AISBS is strictly bounded by four documents:
1. **book_parsed.md** - Complete book (10 chapters/industries, 50 problems, narratives, ROIs, failure modes)
2. **RIP-SYSTEM-INSTRUCTIONS.txt** - Research packages for chapters 8-10
3. **AWA-SYSTEM-INSTRUCTIONS.txt** - Narrative generation system
4. **META PROMPT-SYSTEM-INSTRUCTIONS.txt** - Meta-prompt for Problem 10.5 (Scenario Modeler)

### RAG Architecture
```
Retrieval → Augmentation → Generation
  ↓              ↓              ↓
Find prompt   Combine with   Deterministic
+ context     user input     output
```

- **Retrieval**: Keyword search (lodash) to find prompt + related chapters/problems
- **Augmentation**: Template interpolation with user data + context
- **Generation**: Deterministic JS output matching book examples (default mock), optional LLM integration

### Navigation Flow
```
Home (Dashboard)
  ↓
Chapter (Intro + 5 Problems)
  ↓
Problem (Narrative + Workflow + Business Case + Failure Modes + ROI)
  ↓
Prompt (Split-View Execution: Left=Prompt Code, Right=Input/Output)
```

### UI Design (Book Cover Exact Replication)
- **Sidebar**: Fixed, left, 3% width, #D32F2F (red), no content
- **Title**: "AI SOLVED\nBUSINESS\nPROBLEMS" (ultra-bold, ALL CAPS)
- **Subtitle**: "50 Real-World Challenges from 10 Industries\nA Manager's Workbook"
- **Layout**: Left-aligned lists, no cards/animations/extra colors
- **Responsive**: Text scales with viewport (vw units); mobile: stack split-view

## API Endpoints

### Core Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ustav` | Return full USTAV data |
| GET | `/api/chapters` | List all 10 chapters |
| GET | `/api/chapters/:chapterId` | Get chapter + problems |
| GET | `/api/chapters/:chapterId/problems/:problemId` | Get full problem details |
| POST | `/api/execute` | Execute RAG prompt |
| POST | `/api/validate-upload` | Validate file upload (CSV/JSON) |
| GET | `/api/health` | Health check |

### Execute Prompt (POST /api/execute)

**Request**:
```json
{
  "promptId": "ch1_p1_pr1",
  "userData": { "creditScore": 750, "income": 150000 },
  "mode": "mock"
}
```

**Response**:
```json
{
  "promptId": "ch1_p1_pr1",
  "mode": "mock",
  "timestamp": "2024-02-10T14:32:00Z",
  "output": {
    "riskScore": 6.2,
    "recommendation": "CONDITIONAL_APPROVE",
    ...
  }
}
```

### Validate Upload (POST /api/validate-upload)

**Request**: `multipart/form-data`
- `promptId`: Prompt ID
- `file`: CSV or JSON file

**Response**:
```json
{
  "valid": true,
  "message": "File validation passed",
  "data": { ... }
}
```

## Prompt Schema Example

From Problem 1.1 (Credit Risk Assessment):

```javascript
{
  "id": "ch1_p1_pr1",
  "title": "Risk Scoring Wizard",
  "code": "Analyze borrower profile and score risk 1-10...",
  "inputSchema": {
    "type": "object",
    "properties": {
      "borrowerId": { "type": "string" },
      "creditScore": { "type": "number", "min": 300, "max": 850 },
      "income": { "type": "number", "min": 0 },
      "loanAmount": { "type": "number", "min": 0 },
      "employmentYears": { "type": "number", "min": 0 },
      "debtToIncome": { "type": "number", "min": 0, "max": 1 }
    },
    "required": ["borrowerId", "creditScore", "income", "loanAmount"]
  },
  "mockOutput": {
    "riskScore": 6.2,
    "riskLevel": "MODERATE",
    "recommendation": "CONDITIONAL_APPROVE",
    ...
  }
}
```

## Mode: Mock vs. LLM

By default, AISBS runs in **mock mode**—all prompt executions return deterministic outputs matching book examples (hardcoded in `ustav.json` under `mockOutput`).

### Optional LLM Integration

To enable real LLM inference:

1. **Set environment variable** (backend/.env):
   ```
   OPENAI_API_KEY=sk-...
   # or
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. **Send `mode: 'llm'` in prompt execution request**

3. Backend will attempt external API call; falls back to mock if API unavailable

## Development & Testing

### Run Tests
```bash
npm test                   # All tests
npm run test:backend       # Backend tests only
npm run test:frontend      # Frontend tests only
```

### Available Tests
- **backend/validation.test.js**: Joi schema validation (6 tests)
- **backend/rag.test.js**: RAG retrieval/generation (5 tests)

### Build for Production
```bash
npm run build
```

Outputs React SPA to `frontend/build/`, served by Express backend on `/`.

## Adding USTAV Documents

When you have the four USTAV documents, parse them into `data/ustav.json` following this structure:

```json
{
  "chapters": [
    {
      "id": "ch1",
      "number": 1,
      "title": "Financial Services",
      "intro": "Chapter introduction...",
      "problems": [
        {
          "id": "ch1_p1",
          "number": 1,
          "title": "Credit Risk Assessment at Scale",
          "narrative": "Problem narrative...",
          "workflow": "1. Step 1...",
          "businessCase": "ROI and impact...",
          "failureModes": ["Mode 1", "Mode 2"],
          "roi": "$2.3M annually",
          "prompts": [
            {
              "id": "ch1_p1_pr1",
              "title": "Prompt title",
              "code": "Prompt code/instructions",
              "inputSchema": { ... },
              "mockOutput": { ... }
            }
          ]
        }
      ]
    }
    ...
  ]
}
```

## Customization & Extension

### Add a New Problem
1. Edit `data/ustav.json`: Add problem object to chapter
2. Frontend auto-loads from API—no code change needed

### Add a New Prompt
1. Edit `data/ustav.json`: Add prompt to problem, include `inputSchema` + `mockOutput`
2. Optional: Update `backend/validation/schemas.js` if special logic needed

### Modify UI Design
- Edit `frontend/src/App.css` (main styles)
- Color palette: `#D32F2F` (red), `#000000` (black), `#FFFFFF` (white), `#BDBDBD` (dividers)
- Typography: Ultra-bold sans-serif, large `vw` units for scaling

### Extend RAG System
- Modify `backend/rag/index.js` (`retrieve`, `augment`, `generate`)
- Add LLM integration in `generate()` function
- Update vector search if needed (currently: keyword-based)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000/5000 in use | Kill existing process or change PORT env var |
| USTAV data not loading | Check `data/ustav.json` exists and valid JSON |
| Frontend can't reach backend | Ensure `proxy: "http://localhost:5000"` in `frontend/package.json` |
| Tests failing | Run `npm install` in backend, then `npm test` |
| Prompt validation fails | Check `inputSchema` in `ustav.json` matches submitted data |

## Performance Notes

- **Data Loading**: USTAV (10 chapters, 50 problems, ~200 prompts) loads in memory (~5MB)
- **Retrieval**: O(n) search across prompts; acceptable for current size, can optimize with vector indexing
- **Mock Generation**: <1ms (JS template); LLM: 1-5s (depends on API)
- **Frontend**: React SPA with client-side routing; no server-side rendering needed

## Security

- **No External Data**: All content bounded by USTAV; no internet access
- **Input Validation**: Joi schemas enforce strict input types/ranges
- **File Uploads**: Validated before processing; size limits configurable
- **Error Handling**: User-friendly messages; no stack traces exposed
- **CORS**: Configured for localhost dev; update for production deployment

## License

AISBS is proprietary software. All content derives from "AI Solved Business Problems" (Davor Mulalić).

## Support & Next Steps

1. **Upload USTAV documents**: Replace mock data in `data/ustav.json` with real book chapters
2. **Extend backend**: Add LLM integration (Claude/ChatGPT) in `backend/rag/index.js`
3. **Add more problems**: Scale to all 50 problems with real prompts
4. **Deploy**: Build (`npm run build`) and deploy to cloud platform (Vercel, Heroku, AWS)

---

**Version**: 1.0.0 | **Status**: MVP (10 chapters, mock data) | **Last Updated**: 2024-02-10
