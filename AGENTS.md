# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure

- **Frontend-only project**: React + Vite + Tailwind CSS v4
- Backend/agents directories exist but are empty (placeholders)
- All active code is in `frontend/` directory

## Commands

Run from `frontend/` directory:
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Non-Standard Patterns

### Tailwind CSS v4 Import
- Uses `@import "tailwindcss"` in index.css (v4 syntax, not v3's @tailwind directives)
- Configured via Vite plugin, not tailwind.config.js

### Component File Naming
- StatusCards.jsx contains duplicate App.jsx content (likely copy-paste error)
- Components use default exports, not named exports

### Styling Approach
- Custom dark theme colors hardcoded in components (bg-[#0B1020], bg-[#131A2A])
- No centralized theme configuration
- Extensive use of Tailwind opacity modifiers (e.g., border-red-500/10)

### Data Patterns
- Mock data embedded directly in components (pipelineData, diagnosis, fixData, prData)
- No API integration or state management library
- Components are purely presentational with hardcoded values