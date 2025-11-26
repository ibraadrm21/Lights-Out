# 🏎️ Lights Out - F1 Platform v0.1 (No-NPM Version)

Platform for F1 Trivia, GeoGuessr, and Stats.
Built with **Flask** (Backend) and **React** (Frontend via CDN).

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Database Initialization

```bash
# Ensure you are in /backend
python -c "from database import init_db; init_db()"
# Optional explicit seed:
python -c "from quiz_seed import seed_questions; seed_questions()"
python -c "from geo_seed import seed_geo_examples; seed_geo_examples()"
```

### 4. Run the App

```bash
cd ../backend
python app.py
```

Open [http://localhost:5000/](http://localhost:5000/).

**Note:** This version does **NOT** require `npm` or `node`. 
The React application is compiled in the browser using Babel Standalone. 
All dependencies are loaded via CDN.

## 📂 Structure

- `backend/`: Flask API, SQLite DB, Seeds.
- `frontend/`: React App (Source files served directly).
- `data/`: JSON data for questions.

## 📝 License

MIT
