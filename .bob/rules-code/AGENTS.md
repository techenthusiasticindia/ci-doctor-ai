# Project Coding Rules (Non-Obvious Only)

## Component Structure
- StatusCards.jsx is a duplicate of App.jsx (copy-paste error) - needs correction before extending
- All components embed mock data directly - no data layer separation exists

## Styling Constraints
- Dark theme colors hardcoded in each component (bg-[#0B1020], bg-[#131A2A])
- No theme system or CSS variables - changes require editing multiple files
- Tailwind v4 uses `@import "tailwindcss"` syntax (not v3's @tailwind directives)

## Import Patterns
- Components use default exports exclusively
- No barrel exports or index files
- Direct relative imports required (e.g., "./components/Navbar")

## Development Workflow
- All commands must run from `frontend/` directory, not project root
- No test framework configured despite being a CI/CD monitoring tool
- App.css contains unused Vite template styles (not removed during setup)