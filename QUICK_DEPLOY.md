# 🚀 Quick Setup Script for Deployment

## Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Poultry Farm Ledger with MongoDB Atlas support"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `poultry-farm-ledger`
3. Make it public or private
4. Click "Create repository"

## Step 3: Push to GitHub

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/poultry-farm-ledger.git
git branch -M main
git push -u origin main
```

## Step 4: MongoDB Atlas Setup (Quick)

1. Go to https://www.mongodb.com/atlas
2. Sign up for free
3. Create cluster (M0 FREE tier)
4. Create database user
5. Add IP address (0.0.0.0/0 for everywhere)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/poultry-farm-ledger`

## Step 5: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `poultry-farm-ledger` repository
4. Set environment variables:
   - `GEMINI_API_KEY`: Your Gemini AI key
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `VITE_API_BASE_URL`: https://your-app-name.vercel.app/api
5. Deploy!

## Step 6: Test Your Live App

Your app will be available at: `https://your-app-name.vercel.app`

## Environment Variables Needed:

```
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poultry-farm-ledger
VITE_API_BASE_URL=https://your-app-name.vercel.app/api
```

## API Endpoints (After Deployment):

- GET `/api/health` - Health check
- GET `/api/records` - Get all records
- POST `/api/records` - Create new record
- PUT `/api/records/[id]` - Update record
- DELETE `/api/records/[id]` - Delete record

Done! Your full-stack app is now live! 🎉
