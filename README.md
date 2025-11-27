# Lights Out 🏎️

**F1 Gaming Platform** - Test your Formula 1 knowledge with AI-powered adaptive quizzes and explore iconic circuits.

🌐 **Live Demo**: [lights-out-phi.vercel.app](https://lights-out-phi.vercel.app)

## Features

- 🎯 **F1 Quiz** - 20+ questions about Formula 1
- 🤖 **AI Adaptive Quiz** - Intelligent questions that adapt to your skill level
- 🌍 **GeoGuessr** - Guess F1 circuit locations
- 🏆 **Leaderboard** - Compete with other players
- 👤 **User Accounts** - Track your progress
- 📊 **Rank System** - Bronze → Silver → Gold → Platinum → Diamond

## Tech Stack

- **Frontend**: React (HTM), TailwindCSS, Framer Motion
- **Backend**: Flask, SQLite/PostgreSQL
- **AI**: Hugging Face Mistral-7B for adaptive question generation
- **Deployment**: Vercel (frontend), Local (backend)

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your HUGGINGFACE_API_TOKEN

# Run server
py app.py

# Frontend
# Open http://localhost:5000
```

## Adaptive AI Quiz

The adaptive quiz uses AI to generate questions in real-time based on your performance:

- **Adaptive Difficulty**: Questions get harder as you improve
- **Rank Progression**: Earn ranks from Bronze to Diamond
- **Performance Tracking**: Monitors accuracy, pace, and difficulty trends
- **Smart Transitions**: Smooth difficulty changes, no sudden spikes

## Status

**Version**: v0.3.0-alpha  
**Note**: Backend features (login, quiz, leaderboard) require local backend server.

## License

MIT

---

Made with ❤️ for F1 fans
