# Vercel Deployment Guide - Updated

## 🚀 Quick Deploy Steps

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "fix: Vercel deployment configuration with adaptive quiz"
git push origin main
```

### 2. Connect to Vercel (First Time Only)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `Lights-Out` repository
5. Vercel will auto-detect the configuration from `vercel.json`

### 3. Set Up Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name it `lights-out-db`
6. Click **Create**
7. Vercel automatically adds `POSTGRES_URL` to environment variables

### 4. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
SECRET_KEY=e7f91c3aab16028d8290b0bf2dccfbe3123f53c93f8b1a25a745fbd3625190b7
JWT_SECRET=49b96db5eaf1e55c73b81d097f87c6ade2925854ae6791fa2d8be9f45c3f120f
MAPILLARY_TOKEN=MLY|25376847771955774|b578be85fc5f1e79dfbce7a633a4b457
HUGGINGFACE_API_TOKEN=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
```

> **Note**: `POSTGRES_URL` is automatically set when you create the database.

### 5. Initialize Database Schema

1. Go to Vercel Postgres dashboard
2. Click **Query** tab
3. Copy the entire contents of `backend/schema.sql`
4. Paste and click **Execute**
5. Verify tables are created

### 6. Seed Quiz Questions (Optional)

You'll need to manually insert quiz questions or create a one-time seed script.

---

## ✅ What's Configured

- ✅ **Frontend**: Vite build with React
- ✅ **Backend**: Python serverless functions in `/api`
- ✅ **Database**: PostgreSQL (Vercel Postgres)
- ✅ **AI Quiz**: Adaptive quiz endpoint with HuggingFace
- ✅ **Auto-deploy**: Triggers on every git push

---

## 🔧 New Features Deployed

### Adaptive AI Quiz
- **Endpoint**: `/api/quiz/adaptive`
- **Method**: POST
- **Features**: 
  - AI-generated questions
  - Difficulty adaptation based on performance
  - Rank progression system
  - HuggingFace integration

### Updated Build Process
- Frontend builds with Vite to `frontend/dist`
- Proper asset routing and caching
- Static file optimization

---

## 📋 Deployment Checklist

- [x] Updated `vercel.json` with build configuration
- [x] Created `/api/adaptive_quiz.py` endpoint
- [x] Added `requirements.txt` for Python dependencies
- [x] Created shared database utilities
- [ ] Push code to GitHub
- [ ] Verify Vercel auto-deployment
- [ ] Set environment variables in Vercel
- [ ] Create Postgres database
- [ ] Run schema.sql in Vercel Postgres
- [ ] Test deployed application

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify `frontend/package.json` has all dependencies
- Ensure `npm run build` works locally

### API Errors
- Check Vercel function logs
- Verify `POSTGRES_URL` environment variable is set
- Ensure database schema is initialized

### Database Connection Issues
- Verify Postgres database is created
- Check that `schema.sql` was executed successfully
- Ensure all environment variables are set

### Old Version Still Showing
- Check Vercel deployments tab for latest deployment
- Clear browser cache
- Verify correct branch is connected in Vercel settings

---

## 🎯 Next Steps After Deployment

1. **Test the application** at your Vercel URL
2. **Monitor function logs** for any errors
3. **Seed quiz questions** into the database
4. **Test adaptive quiz** functionality
5. **Set up custom domain** (optional)

---

## 📊 Database Schema Updates

The schema now includes:
- `coins` column in `users` table
- `quiz_sessions` table for adaptive quiz tracking
- `player_metrics` table for performance analytics
- Proper indexes for query optimization

Make sure to run the updated `schema.sql` in Vercel Postgres!

---

**Your app will be live at**: `https://lights-out-[your-project].vercel.app`

🚀 **Auto-deploy is enabled** - every push to `main` triggers a new deployment!
