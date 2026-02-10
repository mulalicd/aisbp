# AISBS Technical Architecture

## System Overview

AISBS is a **closed RAG system** structured in three layers:

### 1. Data Layer (`data/ustav.json`)
- **Content**: 10 chapters, 50 problems, ~200 prompts
- **Schema**: Chapters → Problems → Prompts + Mock Outputs
- **Isolation**: No external APIs; all content self-contained
- **Loading**: Parsed at server startup; ~5MB in memory

### 2. Application Layer

#### Backend (Node.js/Express)
- **Server**: `backend/server.js` - HTTP server + static file serving
- **Routing**: `backend/routes/api.js` - REST API (7 endpoints)
- **RAG Engine**: `backend/rag/index.js`
  - Retrieve: keyword search (lodash)
  - Augment: template interpolation
  - Generate: mock (default) + LLM (optional)
- **Validation**: `backend/validation/schemas.js` - Joi schema builder + input validator

#### Frontend (React.js)
- **Routing**: React Router (Home → Chapter → Problem → Prompt)
- **Context**: UstavProvider for global data access
- **Components**: 
  - Layout (sidebar + main)
  - Breadcrumbs, PromptSplitView
  - Pages (Home, ChapterView, ProblemView, PromptExecution)
- **Styling**: CSS Grid/Flexbox; book cover design exact replica
- **HTTP**: Axios client + proxy to backend

### 3. Execution Flow

```
User Navigate → React Route
  ↓
Frontend Fetches Data (GET /api/chapter/:id)
  ↓
Backend Retrieves from ustav.json
  ↓
User Clicks Prompt → PromptExecution Page
  ↓
Form Input (validated against inputSchema)
  ↓
POST /api/execute { promptId, userData, mode }
  ↓
RAG.retrieve(promptId) → Find prompt + context
  ↓
RAG.augment(template, userData) → Combine inputs
  ↓
RAG.generate(augmented, mode) → Mock or LLM output
  ↓
Return result to frontend (JSON)
  ↓
Display in right pane of split-view
```

## Data Schema

### Prompt Example (Problem 1.1)

```javascript
{
  "id": "ch1_p1_pr1",
  "title": "Risk Scoring Wizard",
  "code": "Analyze the provided borrower profile and historical loan portfolio. Score risk on a 1-10 scale...",
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
    "factors": [
      { "factor": "Credit Score 720", "impact": "Positive", "weight": 0.3 },
      ...
    ],
    "recommendation": "CONDITIONAL_APPROVE",
    ...
  }
}
```

### API Response (Execute Prompt)

```javascript
{
  "promptId": "ch1_p1_pr1",
  "mode": "mock",
  "timestamp": "2024-02-10T14:32:00Z",
  "output": {
    "riskScore": 6.2,
    "riskLevel": "MODERATE",
    ...
  }
}
```

## Mode: Mock vs. LLM

### Mock Mode (Default)
- **Behavior**: Return `prompt.mockOutput` deterministically
- **Speed**: <1ms
- **Cost**: Free
- **Predictability**: 100% (same input = same output)
- **Use Case**: Testing, demos, deterministic flows

### LLM Mode (Optional)
- **Behavior**: Call external LLM API (Claude/ChatGPT) with augmented prompt
- **Speed**: 1-5s
- **Cost**: ~$0.01-0.10 per call
- **Predictability**: Variable (LLM is probabilistic)
- **Use Case**: Real inference, exploration, dynamic responses
- **Fallback**: If LLM fails or no API key, reverts to mock

**Switch between modes**:
- Frontend dropdown: "Mock" vs. "LLM"
- Backend routes request to `RAG.generate(augmented, mode)`

## Validation Pipeline

1. **Frontend**: Optional client-side preview (future)
2. **Backend Validation**:
   ```javascript
   // POST /api/execute
   const { valid, error } = validateInput(promptId, userData, schemas)
   if (!valid) return 422 with error details
   ```
3. **Input Schema Enforcement**:
   - Type checking (string, number, array, etc.)
   - Range validation (min, max)
   - Enum constraints
   - Required fields

## Retrieval Strategy

Currently: **Keyword Search** (O(n))
```javascript
find(prompt => prompt.id === promptId)
```

Future: **Vector Search** (for semantic retrieval)
- Embed prompts + problem narratives
- Find similar problems for context
- k-NN retrieval for augmentation

## File Upload Handling

**POST /api/validate-upload**:
1. Accept multipart/form-data (JSON or CSV)
2. Parse file (JSON.parse or CSV parsing)
3. Validate against Joi schema
4. Return structured data or error

**Supported Formats**:
- JSON: `{ "field1": value, "field2": value }`
- CSV: Headers + one data row (simplified)

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Server startup | 50ms | Load USTAV into memory |
| API request latency | 5-10ms | Without LLM |
| Mock prompt execution | <1ms | Deterministic |
| LLM prompt execution | 1-5s | Depends on API |
| Frontend page load | 300-500ms | React app + data fetch |
| Search prompt by ID | O(n) | Linear search (few hundred prompts) |

**Optimization Opportunities**:
- Index prompts by ID (hash map)
- Vector embeddings for semantic search
- Caching (Redis for frequent queries)
- CDN for frontend assets

## Security Considerations

1. **Input Validation**: Joi schemas prevent injection attacks
2. **File Upload**: Type checking + size limits
3. **CORS**: Configured for localhost; update for production
4. **Error Handling**: No stack traces exposed; user-friendly messages
5. **API Keys**: Stored in .env (not committed)
6. **Data Isolation**: No external data sources; offline-capable

## Extensibility Points

### Add Custom Validation
```javascript
// backend/validation/schemas.js
const customSchema = Joi.object({
  customField: Joi.string().pattern(/^[A-Z]{2}$/) // Only 2 caps
});
```

### Add LLM Integration
```javascript
// backend/rag/index.js
const callLLM = async (augmentedPrompt, apiKey) => {
  const response = await axios.post('https://api.openai.com/...', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: augmentedPrompt }],
  }, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  return response.data.choices[0].message.content;
};
```

### Add Semantic Retrieval
```javascript
// backend/rag/index.js
const retrieveSemanticallySimilar = async (queryPromptId, embedding_model) => {
  // 1. Get query embedding
  // 2. Search vector DB for similar prompts
  // 3. Return top-k results
};
```

## Testing Strategy

**Unit Tests** (Jest):
- Validation schemas: 6 tests
- RAG system: 5 tests
- Future: Component tests, API integration tests

**Manual Testing**:
1. Navigate through all 10 chapters
2. Execute mock prompts with valid/invalid inputs
3. Test file uploads (CSV/JSON)
4. Verify error messages user-friendly

## Deployment

### Local Development
```bash
npm run dev  # Frontend + Backend concurrently
```

### Production Build
```bash
npm run build  # React → frontend/build/
npm run start  # Backend serves static + API
```

### Deployment Targets
- **Vercel/Netlify**: Frontend SPA (requires backend API elsewhere)
- **Heroku**: Full-stack (frontend + backend)
- **AWS Lambda** (with API Gateway): Serverless backend
- **Docker**: Containerize backend, frontend static CDN

## Future Roadmap

1. **Phase 2**: Real USTAV documents (50 problems with real prompts)
2. **Phase 3**: LLM integration (Claude/ChatGPT)
3. **Phase 4**: Vector search + semantic retrieval
4. **Phase 5**: User sessions + saved executions
5. **Phase 6**: Export results (PDF/Excel)
6. **Phase 7**: Analytics dashboard
7. **Phase 8**: Mobile app (React Native)

---

**Architecture Version**: 1.0 | **Last Updated**: 2024-02-10
