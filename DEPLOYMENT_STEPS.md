# 🚀 Vercel Deployment - Step by Step Guide

## Step 1: Push Your Code to GitHub ✅

Open **GitHub Desktop** or **Git Bash** and run:
```bash
git add .
git commit -m "feat: full Vercel deployment with PostgreSQL"
git push
```

Wait for the push to complete.

---

## Step 2: Create Vercel Postgres Database 🗄️

1. Go to **https://vercel.com/dashboard**
2. Click on your project **"Lights-Out"** (or whatever you named it)
3. Click the **"Storage"** tab at the top
4. Click the **"Create Database"** button
5. Select **"Postgres"**
6. Give it a name: `lights-out-db`
7. Click **"Create"**
8. Wait ~30 seconds for it to be created

✅ **Done!** Vercel automatically adds `POSTGRES_URL` to your environment variables.

---

## Step 3: Add Environment Variables 🔐

Still in your Vercel project:

1. Click **"Settings"** tab at the top
2. Click **"Environment Variables"** in the left sidebar
3. Add these **one by one**:

**Variable 1:**
- Key: `SECRET_KEY`
- Value: `e7f91c3aab16028d8290b0bf2dccfbe3123f53c93f8b1a25a745fbd3625190b7`
- Click **"Add"**

**Variable 2:**
- Key: `JWT_SECRET`
- Value: `49b96db5eaf1e55c73b81d097f87c6ade2925854ae6791fa2d8be9f45c3f120f`
- Click **"Add"**

**Variable 3:**
- Key: `MAPILLARY_TOKEN`
- Value: `MLY|25376847771955774|b578be85fc5f1e79dfbce7a633a4b457`
- Click **"Add"**

**Variable 4:**
- Key: `HUGGINGFACE_API_TOKEN`
- Value: `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`
- Click **"Add"**

---

## Step 4: Initialize Database Schema 📋

1. Go back to **"Storage"** tab
2. Click on your **"lights-out-db"** database
3. Click **"Query"** tab
4. Open the file `backend/schema.sql` in VS Code
5. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
6. **Paste** into the Vercel Query box
7. Click **"Run Query"** or **"Execute"**

You should see: "Query executed successfully"

---

## Step 5: Redeploy 🔄

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait ~2 minutes for deployment to complete

---

## Step 6: Test Your App! 🎉

Go to: **https://lights-out-phi.vercel.app**

Try:
- ✅ Register a new account
- ✅ Login
- ✅ Start a quiz
- ✅ Check leaderboard
- ✅ Try GeoGuessr

Everything should work now! 🚀

---

## ⚠️ Note

The database will be **empty** at first. You'll need to:
- Register as a new user
- Quiz questions need to be added manually (or I can create a seed script)

---

## 🆘 If Something Goes Wrong

1. Check **"Deployments"** tab → Click latest deployment → View **"Function Logs"**
2. Look for error messages
3. Share the error with me and I'll help fix it!

---

**That's it!** Just follow these 6 steps and your app will be fully deployed on Vercel! 🎊
