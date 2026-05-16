# Project Documentation Rules (Non-Obvious Only)

## Project Organization
- Frontend-only project despite having backend/ and agents/ directories (empty placeholders)
- All active development happens in `frontend/` subdirectory
- Root README.md is empty - no project documentation exists

## Component Documentation
- StatusCards.jsx filename is misleading - contains duplicate App.jsx code (copy-paste error)
- Components have no JSDoc or inline documentation
- Mock data structures embedded in components serve as implicit API contracts

## Configuration Files
- Tailwind CSS v4 configured via Vite plugin, not traditional tailwind.config.js
- ESLint uses flat config format (eslint.config.js) with defineConfig
- No TypeScript despite @types packages in devDependencies (unused)

## Development Context
- App.css contains unused Vite template boilerplate (counter, hero, ticks classes)
- No testing framework despite project being a CI/CD monitoring tool
- Commands must be run from `frontend/` directory, not project root