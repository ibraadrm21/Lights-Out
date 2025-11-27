# Deploying to Vercel

## Important Notes

⚠️ **Database Limitation**: Vercel serverless functions are stateless and don't support SQLite databases. You have two options:

### Option 1: Use a Cloud Database (Recommended)
Replace SQLite with a cloud database:
- **PostgreSQL**: Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Supabase](https://supabase.com/)
- **MongoDB**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **MySQL**: Use [PlanetScale](https://planetscale.com/)

### Option 2: Deploy Backend Separately
Keep SQLite and deploy the backend to a platform that supports persistent storage:
- **Backend**: [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/)
- **Frontend**: Vercel (static site only)

## Current Setup (For Testing Only)

The current configuration will deploy to Vercel but **the database won't persist** between requests. This is only suitable for testing the deployment process.

## Deployment Steps

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings and add:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
MAPILLARY_TOKEN=your-mapillary-token-here
HUGGINGFACE_API_TOKEN=your-huggingface-token-here
```

### 2. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Recommended Production Setup

1. **Sign up for Vercel Postgres** (free tier available)
2. **Update database.py** to use PostgreSQL instead of SQLite
3. **Install psycopg2** in requirements.txt
4. **Deploy** with persistent database

## Files Created

- `vercel.json` - Vercel configuration
- `api/index.py` - Serverless function entry point
- `requirements.txt` - Python dependencies (root level)
- `.vercelignore` - Files to exclude from deployment

## Need Help?

If you want me to convert the database to PostgreSQL for proper Vercel deployment, let me know!
