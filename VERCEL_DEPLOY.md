# Vercel Deployment Guide

## 🚀 Quick Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: full Vercel deployment with Postgres"
   git push
   ```

2. **Set up Vercel Postgres**:
   - Go to your Vercel project dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name (e.g., "lights-out-db")
   - Click "Create"
   - Vercel will auto-add `POSTGRES_URL` to your environment variables

3. **Add Environment Variables** in Vercel dashboard:
   ```
   SECRET_KEY=e7f91c3aab16028d8290b0bf2dccfbe3123f53c93f8b1a25a745fbd3625190b7
   JWT_SECRET=49b96db5eaf1e55c73b81d097f87c6ade2925854ae6791fa2d8be9f45c3f120f
   MAPILLARY_TOKEN=MLY|25376847771955774|b578be85fc5f1e79dfbce7a633a4b457
   HUGGINGFACE_API_TOKEN=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
   ```

4. **Initialize Database**:
   - After first deployment, run the schema:
   - Go to Vercel Postgres dashboard
   - Click "Query" tab
   - Copy contents of `backend/schema.sql`
   - Paste and execute

5. **Seed Data** (Optional):
   - You'll need to manually insert quiz questions and geo locations
   - Or create a one-time serverless function to seed data

## ✅ What Works

- ✅ Full stack on Vercel
- ✅ PostgreSQL database
- ✅ All API endpoints as serverless functions
- ✅ No localhost required
- ✅ Auto-deploy on git push

## 📝 Notes

- Database is persistent (not like SQLite on serverless)
- Cold starts may be slower (serverless functions)
- Free tier limits: 60 hours compute/month
- Postgres free tier: 256 MB storage

## 🔧 Troubleshooting

**If deployment fails:**
1. Check Vercel logs in dashboard
2. Verify all environment variables are set
3. Make sure Postgres database is created
4. Check that schema.sql was executed

**If API calls fail:**
1. Check Vercel function logs
2. Verify POSTGRES_URL is set
3. Make sure database has tables (run schema.sql)

## 🎉 Success!

Once deployed, your app will be fully functional at:
`https://lights-out-phi.vercel.app`

No localhost needed! 🚀
