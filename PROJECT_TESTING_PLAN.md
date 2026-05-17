# CI Doctor AI - Project Testing Plan

## Project Overview
**CI Doctor AI** is an AI-powered CI/CD pipeline debugger that analyzes GitHub Actions failures and generates automated fixes.

### Architecture
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4
- **Backend**: Node.js + Express + GitHub API (Octokit) + Google Gemini AI
- **Repository**: techenthusiasticindia/ci-doctor-ai

---

## Current Configuration Status

### ✅ Backend Configuration
- **Location**: `backend/`
- **Dependencies**: Express, Octokit, Google Generative AI, CORS, dotenv
- **Environment Variables**: Configured in `backend/.env`
  - `GITHUB_TOKEN`: ✅ Configured
  - `GEMINI_API_KEY`: ✅ Configured
  - `GITHUB_OWNER`: techenthusiasticindia
  - `GITHUB_REPO`: ci-doctor-ai
  - `PORT`: 3001

### ✅ Frontend Configuration
- **Location**: `frontend/`
- **Dependencies**: React 19, Vite 8, Tailwind CSS v4, Lucide React
- **API Endpoint**: `http://localhost:3001/api` (configurable via `VITE_API_URL`)
- **Dev Server**: Port 5173 (Vite default)

---

## Testing Checklist

### Phase 1: Dependency Installation
1. **Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
   - Expected: Install Express, Octokit, @google/generative-ai, cors, dotenv

2. **Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```
   - Expected: Install React 19, Vite 8, Tailwind CSS v4, Lucide React

### Phase 2: Backend Testing
3. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   - Expected: Server starts on port 3001
   - Expected: Console shows GitHub/AI configuration status
   - Expected: No startup errors

4. **Test Health Endpoint**
   ```bash
   curl http://localhost:3001/api/health
   ```
   - Expected: `{"status":"ok","service":"CI Doctor AI Backend","timestamp":"..."}`

5. **Test Dashboard Endpoint**
   ```bash
   curl http://localhost:3001/api/dashboard
   ```
   - Expected: JSON with `totalPipelines`, `failedBuilds`, `autoRecoveries`, `aiConfidence`, `successRate`
   - Tests: GitHub API connectivity

6. **Test Pipelines Endpoint**
   ```bash
   curl http://localhost:3001/api/pipelines
   ```
   - Expected: JSON with `runs` array containing recent workflow runs
   - Tests: GitHub API authentication and data fetching

### Phase 3: Frontend Testing
7. **Start Frontend Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```
   - Expected: Vite dev server starts on port 5173
   - Expected: No compilation errors
   - Expected: Tailwind CSS v4 loads correctly

8. **Test Frontend in Browser**
   - Open: `http://localhost:5173`
   - Expected: CI Doctor AI dashboard loads
   - Expected: Status cards display (may show loading or connection error if backend not running)
   - Expected: No console errors related to React/Vite

### Phase 4: Integration Testing
9. **Full Stack Integration**
   - Backend running on port 3001
   - Frontend running on port 5173
   - Expected: Frontend successfully fetches data from backend
   - Expected: Dashboard shows real GitHub Actions data
   - Expected: Pipeline list displays recent runs
   - Expected: Can select a failed pipeline and view details

10. **AI Features Testing**
    - Select a failed pipeline
    - Click "Diagnose" button
    - Expected: AI diagnosis appears with root cause, confidence, affected files
    - Click "Generate Fix" button
    - Expected: AI-generated fix with diff and PR details

### Phase 5: API Validation
11. **GitHub API Connectivity**
    - Verify token has correct permissions (repo, actions read)
    - Test: `curl http://localhost:3001/api/pipelines`
    - Expected: Returns actual workflow runs from the repository

12. **Gemini AI Connectivity**
    - Test diagnosis endpoint with a failed run ID
    - Expected: AI generates intelligent diagnosis
    - Fallback: If API fails, should use pattern-matching fallback

---

## Known Architecture Details

### Backend API Endpoints
- `GET /` - API documentation
- `GET /api/health` - Health check
- `GET /api/dashboard` - Dashboard statistics
- `GET /api/pipelines` - List recent workflow runs
- `GET /api/pipelines/:id/failure` - Get failure details
- `POST /api/pipelines/:id/diagnose` - AI diagnosis
- `POST /api/pipelines/:id/fix` - AI fix generation
- `GET /api/stats` - Internal store statistics

### Frontend Components
- `Navbar.jsx` - Top navigation
- `StatusCards.jsx` - Dashboard metrics (note: duplicate of App.jsx content)
- `PipelineList.jsx` - List of workflow runs
- `FailurePanel.jsx` - Failure details display
- `DiagnosisCard.jsx` - AI diagnosis display
- `FixPanel.jsx` - AI fix display with diff

### Data Flow
1. Frontend fetches dashboard stats and pipelines on load
2. User selects a failed pipeline
3. Frontend fetches failure details
4. User clicks "Diagnose" → Backend calls Gemini AI
5. User clicks "Generate Fix" → Backend generates fix with AI
6. Results cached in-memory store for performance

---

## Potential Issues to Check

### Backend
- [ ] Node.js version compatibility (requires ES modules support)
- [ ] GitHub token permissions (needs repo + actions read)
- [ ] Gemini API key validity and quota
- [ ] CORS configuration for frontend origin
- [ ] Rate limiting on GitHub/Gemini APIs

### Frontend
- [ ] Tailwind CSS v4 import syntax (`@import "tailwindcss"`)
- [ ] React 19 compatibility with dependencies
- [ ] API_BASE URL configuration
- [ ] Error handling for backend connection failures
- [ ] StatusCards.jsx duplicate content issue

### Integration
- [ ] CORS headers allow frontend origin (localhost:5173)
- [ ] Backend responds before frontend timeout
- [ ] Error messages propagate correctly to UI
- [ ] Loading states work properly

---

## Success Criteria

✅ **Project is Working** if:
1. Backend starts without errors and responds to health check
2. Frontend starts without errors and loads in browser
3. Frontend can fetch data from backend (dashboard, pipelines)
4. GitHub API returns actual workflow run data
5. AI diagnosis generates for a failed pipeline
6. AI fix generation works for diagnosed failures
7. No critical errors in browser console or terminal

❌ **Project Has Issues** if:
1. Dependencies fail to install
2. Backend crashes on startup
3. Frontend compilation errors
4. API endpoints return 500 errors
5. GitHub API authentication fails
6. Gemini AI returns errors
7. Frontend cannot connect to backend

---

## Next Steps
After completing this testing plan, we will:
1. Document all findings
2. List any bugs or issues discovered
3. Provide recommendations for fixes
4. Suggest improvements for production readiness