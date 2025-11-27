# Commit Changelog

This file tracks all changes made during development sessions for easy commit message creation.

---

## Session: 2025-11-27 - Vercel Deployment Configuration

### Added
- `vercel.json` - Vercel deployment configuration for Flask serverless functions
- `api/index.py` - Serverless function wrapper for Flask app
- `requirements.txt` (root) - Python dependencies for Vercel
- `.vercelignore` - Deployment exclusion rules
- `DEPLOYMENT.md` - Comprehensive deployment guide with database options

### Modified
- `backend/app.py` - Added Vercel serverless compatibility configuration

### Commit Message
```
feat: add Vercel deployment configuration

- Add vercel.json for serverless Flask deployment
- Create api/index.py as serverless function entry point
- Add root requirements.txt for Vercel Python runtime
- Add .vercelignore to exclude unnecessary files
- Create DEPLOYMENT.md with setup instructions
- Update app.py for production environment compatibility

Note: SQLite not supported on Vercel serverless - see DEPLOYMENT.md for database migration options
```

---

## Session: 2025-11-26 - Language Selector & GeoGuessr Fixes

### Added
- `frontend/src/components/LanguageSelector.js` - Multi-language dropdown with flag icons
  - 8 languages: EN, ES, FR, DE, IT, PT, NL, JA
  - SVG flags from flagcdn.com
  - localStorage persistence
  - Click-outside handler
- `backend/translation.py` - AI translation service using Hugging Face NLLB-200
- `frontend/src/utils/translator.js` - Frontend translation utility (experimental, disabled)
- `CHANGELOG.md` - Project changelog following Keep a Changelog format

### Modified
- `frontend/src/components/Navbar.js` - Integrated LanguageSelector component
- `backend/geo_seed.py` - Updated with real F1 circuit image URLs
  - Monza, Monaco, Silverstone, Circuit of the Americas
  - Replaced mock Mapillary IDs with Wikipedia images
- `frontend/src/pages/GeoGuessr.js` - Fixed image display and layout
  - Proper height constraints
  - Better error handling
  - Removed placeholder text overlay
- `backend/app.py` - Added `/api/translate` endpoint
- `backend/requirements.txt` - Added `requests==2.31.0`
- `backend/.env` - Added `HUGGINGFACE_API_TOKEN`
- `backend/.env.example` - Added token placeholder

### Commit Message
```
feat: add language selector and fix GeoGuessr images

Language Selector:
- Add multi-language dropdown with 8 languages
- Implement SVG flag icons with retina support
- Save language preference to localStorage
- Add click-outside handler for dropdown

GeoGuessr Improvements:
- Replace mock Mapillary IDs with real F1 circuit images
- Fix image container layout and height issues
- Improve error handling for failed image loads
- Add real circuits: Monza, Monaco, Silverstone, COTA

Backend:
- Add translation API endpoint (experimental)
- Integrate Hugging Face NLLB-200 model
- Add requests library for HTTP calls

Docs:
- Create comprehensive CHANGELOG.md

Note: Translation feature disabled on frontend due to React compatibility issues
```

---

## How to Use This File

1. **Before committing**: Check the latest session section
2. **Copy the commit message**: Use the pre-formatted message
3. **Customize if needed**: Add/remove details based on what you're committing
4. **Clear after commit**: Archive or remove the session section once committed

---

## Template for New Sessions

```
## Session: YYYY-MM-DD - Brief Description

### Added
- `path/to/file` - Description

### Modified
- `path/to/file` - What changed

### Removed
- `path/to/file` - Why removed

### Fixed
- `path/to/file` - What bug was fixed

### Commit Message
```
feat/fix/chore: brief description

- Bullet point 1
- Bullet point 2
- Bullet point 3
```
```
