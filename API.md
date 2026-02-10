# AISBS API Reference

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-aisbs-domain.com/api`

## Authentication

AISBS has **no authentication** (local closed system). All endpoints are public within the network.

---

## Endpoints

### GET /api/ustav
**Return full USTAV data (all chapters, problems, prompts)**

**Response**:
```json
{
  "chapters": [
    {
      "id": "ch1",
      "number": 1,
      "title": "Financial Services",
      "intro": "The financial services industry...",
      "problems": [
        {
          "id": "ch1_p1",
          "number": 1,
          "title": "Credit Risk Assessment at Scale",
          "narrative": "...",
          "workflow": "...",
          "businessCase": "...",
          "failureModes": [...],
          "roi": "$2.3M annually | 18-month payback",
          "prompts": [
            {
              "id": "ch1_p1_pr1",
              "title": "Risk Scoring Wizard",
              "code": "...",
              "inputSchema": {...},
              "mockOutput": {...}
            }
          ]
        }
      ]
    }
  ]
}
```

---

### GET /api/chapters
**List all chapters (lightweight)**

**Query Parameters**: None

**Response**:
```json
[
  {
    "id": "ch1",
    "number": 1,
    "title": "Financial Services",
    "intro": "The financial services industry...",
    "problemCount": 5
  },
  {
    "id": "ch2",
    "number": 2,
    "title": "Healthcare & Pharmaceuticals",
    "intro": "Healthcare organizations face challenges...",
    "problemCount": 5
  },
  ...
]
```

---

### GET /api/chapters/:chapterId
**Get specific chapter with problems**

**Path Parameters**:
- `chapterId` (string): Chapter ID (e.g., `ch1`)

**Example**: `GET /api/chapters/ch1`

**Response**:
```json
{
  "id": "ch1",
  "number": 1,
  "title": "Financial Services",
  "intro": "The financial services industry...",
  "problems": [
    {
      "id": "ch1_p1",
      "number": 1,
      "title": "Credit Risk Assessment at Scale",
      "promptCount": 1
    },
    {
      "id": "ch1_p2",
      "number": 2,
      "title": "Anti-Money Laundering (AML) Detection",
      "promptCount": 1
    },
    ...
  ]
}
```

---

### GET /api/chapters/:chapterId/problems/:problemId
**Get specific problem with full details and prompts**

**Path Parameters**:
- `chapterId` (string): Chapter ID (e.g., `ch1`)
- `problemId` (string): Problem ID (e.g., `ch1_p1`)

**Example**: `GET /api/chapters/ch1/problems/ch1_p1`

**Response**:
```json
{
  "id": "ch1_p1",
  "number": 1,
  "title": "Credit Risk Assessment at Scale",
  "narrative": "A major bank processes thousands of loan applications daily. Traditional credit scoring models fail to capture non-traditional borrower profiles, leading to missed opportunities and portfolio imbalance. The challenge is to expand credit availability while maintaining risk controls.",
  "workflow": "1. Collect borrower data (credit history, income, assets, behavioral signals). 2. Retrieve similar historical cases + ROI benchmarks. 3. Model risk profile using multi-factor analysis. 4. Output risk score + recommended action (approve/reject/review). 5. Track outcome vs. prediction.",
  "businessCase": "Expected 15% increase in approved applications, 8% reduction in default rates, $2.3M annual ROI from better risk calibration.",
  "failureModes": [
    "Over-reliance on historical data misses market shifts",
    "Bias in training data perpetuates unfair lending",
    "Model drift reduces accuracy as borrower behavior changes",
    "Regulatory rejection due to explainability gaps"
  ],
  "roi": "$2.3M annually | 18-month payback",
  "prompts": [
    {
      "id": "ch1_p1_pr1",
      "title": "Risk Scoring Wizard",
      "code": "Analyze the provided borrower profile and historical loan portfolio. Score risk on a 1-10 scale, highlight key risk factors, and recommend approval decision.",
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
          { "factor": "Debt-to-Income 0.42", "impact": "Concern", "weight": 0.25 },
          { "factor": "Employment 8 years", "impact": "Positive", "weight": 0.2 },
          { "factor": "Loan Amount $150K", "impact": "Neutral", "weight": 0.15 }
        ],
        "recommendation": "CONDITIONAL_APPROVE",
        "conditions": ["Require co-signer for loans >$200K", "Reduce DTI to <0.40 via debt payoff"],
        "similarCases": 1247,
        "historicalApprovalRate": 0.87,
        "projectedDefaultRate": 0.04
      }
    }
  ]
}
```

---

### POST /api/execute
**Execute RAG prompt simulation**

**Request Body**:
```json
{
  "promptId": "ch1_p1_pr1",
  "userData": {
    "borrowerId": "CUST_XYZ_789",
    "creditScore": 720,
    "income": 150000,
    "loanAmount": 250000,
    "employmentYears": 8,
    "debtToIncome": 0.42
  },
  "mode": "mock"
}
```

**Query Parameters**:
- `promptId` (required): Prompt ID to execute
- `userData` (required): User input data (object)
- `mode` (optional): Execution mode - `"mock"` (default) or `"llm"`

**Example**: 
```bash
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "promptId": "ch1_p1_pr1",
    "userData": {
      "borrowerId": "CUST_XYZ_789",
      "creditScore": 720,
      "income": 150000,
      "loanAmount": 250000
    },
    "mode": "mock"
  }'
```

**Response (Success - 200)**:
```json
{
  "promptId": "ch1_p1_pr1",
  "mode": "mock",
  "timestamp": "2024-02-10T14:32:00Z",
  "output": {
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

**Response (Validation Error - 422)**:
```json
{
  "message": "Input validation failed",
  "details": "creditScore must be between 300 and 850"
}
```

**Response (Prompt Not Found - 400)**:
```json
{
  "message": "Prompt ch1_p1_pr1_invalid not found in USTAV"
}
```

---

### POST /api/validate-upload
**Validate file upload (CSV/JSON) against prompt schema**

**Request Body**: `multipart/form-data`
- `promptId` (required): Prompt ID to validate against
- `file` (required): File to validate (JSON or CSV)

**Example**:
```bash
curl -X POST http://localhost:5000/api/validate-upload \
  -F "promptId=ch1_p1_pr1" \
  -F "file=@data.json"
```

**JSON File Format**:
```json
{
  "borrowerId": "CUST_789",
  "creditScore": 720,
  "income": 150000,
  "loanAmount": 250000
}
```

**CSV File Format**:
```
borrowerId,creditScore,income,loanAmount
CUST_789,720,150000,250000
```

**Response (Success - 200)**:
```json
{
  "valid": true,
  "message": "File validation passed",
  "data": {
    "borrowerId": "CUST_789",
    "creditScore": 720,
    "income": 150000,
    "loanAmount": 250000
  }
}
```

**Response (Validation Error - 422)**:
```json
{
  "message": "File validation failed",
  "details": "creditScore must be a number"
}
```

**Response (Unsupported Format - 415)**:
```json
{
  "message": "Unsupported file type (use JSON or CSV)"
}
```

---

### GET /api/health
**Health check endpoint**

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T14:32:00Z",
  "chapters": 10,
  "problems": 50
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Human-readable error message"
}
```

| Status Code | Meaning | Example |
|------------|---------|---------|
| 200 | OK | Successful execution |
| 400 | Bad Request | Missing required field, prompt not found |
| 415 | Unsupported Media Type | File format not JSON/CSV |
| 422 | Unprocessable Entity | Input validation failed |
| 500 | Internal Server Error | Unexpected backend error |

---

## Code Examples

### JavaScript/Node.js (Axios)
```javascript
const axios = require('axios');

const executePrompt = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/execute', {
      promptId: 'ch1_p1_pr1',
      userData: {
        borrowerId: 'CUST_789',
        creditScore: 720,
        income: 150000,
        loanAmount: 250000,
      },
      mode: 'mock',
    });
    console.log('Output:', response.data.output);
  } catch (error) {
    console.error('Error:', error.response.data.message);
  }
};

executePrompt();
```

### Python (Requests)
```python
import requests
import json

response = requests.post(
    'http://localhost:5000/api/execute',
    json={
        'promptId': 'ch1_p1_pr1',
        'userData': {
            'borrowerId': 'CUST_789',
            'creditScore': 720,
            'income': 150000,
            'loanAmount': 250000,
        },
        'mode': 'mock'
    }
)

if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.json()['message']}")
```

### cURL
```bash
# List chapters
curl http://localhost:5000/api/chapters

# Get specific chapter
curl http://localhost:5000/api/chapters/ch1

# Execute prompt
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "promptId": "ch1_p1_pr1",
    "userData": {"borrowerId": "X", "creditScore": 720, "income": 150000, "loanAmount": 250000},
    "mode": "mock"
  }'

# Validate file upload
curl -X POST http://localhost:5000/api/validate-upload \
  -F "promptId=ch1_p1_pr1" \
  -F "file=@data.json"

# Health check
curl http://localhost:5000/api/health
```

---

## Rate Limiting

Currently: **No rate limiting** (local dev).

For production, implement:
- `express-rate-limit` package
- Rate: ~100 requests/minute per client
- Burst allowance for file uploads

---

## Pagination

Currently: **No pagination** (all data returned at once).

For large datasets, consider:
- `?page=1&limit=10` query parameters
- Cursor-based pagination for large result sets

---

## Versioning

API Version: `1.0`

Future APIs will use `/api/v2/...` paths for backward compatibility.

---

**Last Updated**: 2024-02-10 | **Status**: MVP
