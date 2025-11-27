# Lights Out - F1 Platform

A complete F1 trivia and GeoGuessr platform built with Python/Flask and React.

## Features
- **F1 Quiz Master**: Test your knowledge with 1000+ questions.
- **GeoGuessr Mode**: Identify circuits from satellite/street view images.
- **Leaderboard**: Compete globally for the top spot.
- **Authentication**: Secure JWT-based login and registration.
- **Responsive Design**: Premium "Carbon Black" & "Warm Red" aesthetic.

## Tech Stack
- **Backend**: Python, Flask, SQLite, JWT.
- **Frontend**: React, TailwindCSS, Framer Motion.
- **Data**: Custom JSON dataset + Mapillary integration.

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd lights-out
```

### 2. Backend Setup
Create a virtual environment and install dependencies.
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configuration
Copy the example environment file.
```bash
cp .env.example .env
# Edit .env to add your Mapillary Token if you have one
```

### 4. Database Initialization
Initialize the SQLite database and seed it with data.
```bash
# Ensure you are in the backend directory and venv is active
python -c "from database import init_db; init_db()"
# Seeds are automatically loaded on first run of app.py if tables are empty
```

### 5. Run the Application
Start the Flask server. This serves both the API and the React frontend.
```bash
python app.py
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

## Deployment

### Backend (Render/Railway)
1. Push code to GitHub.
2. Connect repository to Render/Railway.
3. Set Build Command: `pip install -r backend/requirements.txt`
4. Set Start Command: `cd backend && python app.py`
5. Add Environment Variables from `.env`.

### Frontend (Vercel - Optional)
If you prefer to host frontend separately:
1. `cd frontend`
2. `npm install`
3. `npm run build`
4. Deploy `dist` folder to Vercel.
5. Update `api.js` base URL to point to your backend.

## Data Generation
To generate the full 1000 question dataset:
```bash
cd data
python generate_questions.py
```

## License
MIT
