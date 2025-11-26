# Changelog

All notable changes to the Lights Out F1 Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Language Selector Component** - Multi-language dropdown in navbar with flag icons
  - 8 supported languages: English, Spanish, French, German, Italian, Portuguese, Dutch, Japanese
  - SVG flag icons from flagcdn.com with retina support
  - Language preference saved to localStorage
  - Click-outside handler to close dropdown
  - Visual checkmark for selected language
  
- **GeoGuessr Mode** - F1 circuit location guessing game
  - Real F1 circuit images (Monza, Monaco, Silverstone, Circuit of the Americas)
  - Reveal location functionality
  - Coordinates display
  - Next location button
  - Fixed image loading with proper error handling

- **Backend Translation API** - AI-powered translation endpoint (experimental)
  - `/api/translate` endpoint using Hugging Face NLLB-200 model
  - Batch translation support
  - 7 target languages supported
  - Translation caching system
  - Note: Frontend integration disabled due to React compatibility issues

### Changed
- **GeoGuessr Images** - Replaced mock Mapillary IDs with real Wikipedia image URLs
- **Database Seeding** - Updated `geo_seed.py` to clear old data and insert real circuit images
- **Requirements** - Added `requests==2.31.0` for HTTP API calls

### Fixed
- **GeoGuessr Layout** - Fixed image container height and centering issues
- **Language Selector** - Removed non-functional translation feature that conflicted with React rendering
- **Flag Display** - Replaced emoji flags with reliable SVG images

### Technical Details
- **No-NPM Setup** - Maintained CDN-only frontend architecture
- **HTM (Hyperscript Tagged Markup)** - Used for React components without JSX compilation
- **Flask Backend** - Python 3.x with SQLite database
- **Environment Variables** - Added `HUGGINGFACE_API_TOKEN` to `.env`

### Known Issues
- Translation feature disabled - DOM manipulation conflicts with React's virtual DOM
- Future implementation would require React i18n library (e.g., react-i18next)

---

## [0.1.0] - Initial Release

### Added
- F1 Quiz game with 20 questions
- User authentication (register/login) with JWT
- Points system and leaderboard
- Profile page
- Responsive design with TailwindCSS
- Framer Motion animations
- SQLite database
- Flask backend API

### Features
- **Quiz Mode**: Multiple choice F1 questions with scoring
- **Authentication**: Secure JWT-based login system
- **Leaderboard**: Top players ranking
- **Profile**: User stats and points display
- **Responsive UI**: Mobile-friendly design
- **Dark Theme**: F1-inspired color scheme (#FF1E00 red accent)

### Tech Stack
- **Frontend**: React 18 (via CDN), HTM, TailwindCSS, Framer Motion
- **Backend**: Flask 3.0, SQLite, PyJWT
- **Architecture**: No-NPM, CDN-based dependencies
- **Deployment**: Development server on localhost:5000

---

## Future Roadmap

### Planned Features
- [ ] Proper i18n implementation with react-i18next
- [ ] AI-powered dynamic quiz question generation
- [ ] Rank progression system (Bronze → Diamond)
- [ ] Adaptive difficulty based on player performance
- [ ] More GeoGuessr locations
- [ ] Social features (friends, challenges)
- [ ] Mobile app version

### Under Consideration
- [ ] Real-time multiplayer quiz mode
- [ ] F1 news integration
- [ ] Race predictions and betting system
- [ ] Achievement badges
- [ ] Custom quiz creation

---

**Project**: Lights Out - F1 Gaming Platform  
**Repository**: https://github.com/[ibraadrm21]/Lights-Out  
**License**: MIT  
**Last Updated**: 2025-11-26
