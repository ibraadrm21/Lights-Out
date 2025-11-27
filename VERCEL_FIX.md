# Vercel Deployment Fix

## Issue
Vercel was serving JavaScript files as HTML, causing MIME type errors.

## Solution
Updated `vercel.json` with:
1. **Proper rewrites** for `/src` folder
2. **MIME type headers** for JavaScript files
3. **Fallback routing** to index.html

## Deploy
```bash
git add vercel.json
git commit -m "fix: configure Vercel to serve JS files with correct MIME type"
git push
```

Vercel will auto-deploy on push.

## Important Notes
⚠️ **Backend APIs won't work** - This only deploys the frontend. All API calls will fail.

To make the app fully functional on Vercel, you need to:
1. Deploy backend separately (Railway/Render)
2. Update `frontend/src/utils/api.js` with the backend URL
3. Or migrate to Vercel Postgres and serverless functions

## Current Status
- ✅ Frontend loads on Vercel
- ❌ Login/Quiz/Leaderboard won't work (no backend)
