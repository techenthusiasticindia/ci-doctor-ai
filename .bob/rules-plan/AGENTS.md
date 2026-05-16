# Project Architecture Rules (Non-Obvious Only)

## Project Structure Constraints
- Backend and agents directories exist but are completely empty (future placeholders)
- All functionality currently frontend-only with no backend integration
- No state management library - components manage their own mock data

## Data Architecture
- Mock data embedded directly in each component (pipelineData, diagnosis, fixData, prData)
- No API layer, data fetching, or state management
- Components are tightly coupled to their data structures

## Styling Architecture
- No centralized theme system - colors hardcoded per component
- Dark theme values (bg-[#0B1020], bg-[#131A2A]) repeated across files
- Tailwind v4 configured via Vite plugin instead of config file

## Component Architecture
- StatusCards.jsx is a duplicate of App.jsx (architectural error from copy-paste)
- All components use default exports with no barrel exports
- No component composition patterns - each component is self-contained

## Build Architecture
- Vite dev server must run from `frontend/` directory, not project root
- No monorepo setup despite having multiple top-level directories
- No test infrastructure despite being a CI/CD monitoring application