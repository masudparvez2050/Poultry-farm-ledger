# 🚀 Deployment Guide - Poultry Farm Ledger

## 📋 Overview

এই guide আপনাকে দেখাবে কিভাবে:

1. Git repository তে project upload করবেন
2. Vercel এ frontend deploy করবেন
3. MongoDB Atlas ব্যবহার করে backend deploy করবেন
4. Production environment setup করবেন

---

## 📁 Project Structure

```
poultry-farm-ledger/
├── components/          # React components
├── services/           # API services
├── hooks/              # Custom React hooks
├── server/             # Backend API server
│   ├── index.js        # Express server
│   └── migrate.js      # Data migration script
├── package.json
├── .env.local         # Environment variables
└── vercel.json        # Vercel configuration
```

---

## 🔧 Part 1: Git Repository Setup

### 1.1 Initialize Git Repository

```bash
# Initialize git in your project directory
cd c:\Users\Masud\Desktop\Projects\poultry-farm-ledger
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Poultry Farm Ledger with MongoDB"
```

### 1.2 Create GitHub Repository

1. [GitHub](https://github.com) এ যান এবং login করুন
2. **New Repository** button এ click করুন
3. Repository name: `poultry-farm-ledger`
4. Description: `A web application for poultry farms to digitally record and analyze daily truck-wise poultry weight data`
5. **Public** বা **Private** বেছে নিন
6. **Create repository** এ click করুন

### 1.3 Push to GitHub

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/poultry-farm-ledger.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

---

## ☁️ Part 2: MongoDB Atlas Setup (Cloud Database)

### 2.1 MongoDB Atlas Account Creation

1. [MongoDB Atlas](https://www.mongodb.com/atlas) এ যান
2. **Try Free** button এ click করুন
3. Account create করুন (Google/GitHub দিয়েও signup করতে পারেন)

### 2.2 Create Database Cluster

1. **Create a deployment** এ click করুন
2. **M0 FREE** tier select করুন
3. **Provider**: AWS বা Google Cloud
4. **Region**: Singapore বা Mumbai (nearest)
5. **Cluster Name**: `poultry-farm-cluster`
6. **Create** button এ click করুন

### 2.3 Database Access Setup

1. **Database Access** section এ যান
2. **Add New Database User** এ click করুন
3. **Authentication Method**: Password
4. **Username**: `poultry-admin`
5. **Password**: একটা strong password দিন (save করে রাখুন)
6. **Database User Privileges**: Atlas admin
7. **Add User** এ click করুন

### 2.4 Network Access Setup

1. **Network Access** section এ যান
2. **Add IP Address** এ click করুন
3. **Allow Access From Anywhere**: `0.0.0.0/0` (production এর জন্য specific IP দিতে পারেন)
4. **Confirm** এ click করুন

### 2.5 Get Connection String

1. **Database** section এ যান
2. **Connect** button এ click করুন
3. **Connect your application** select করুন
4. **Driver**: Node.js
5. Connection string copy করুন:
   ```
   mongodb+srv://poultry-admin:<password>@poultry-farm-cluster.xxxxx.mongodb.net/poultry-farm-ledger?retryWrites=true&w=majority
   ```

---

## 🌐 Part 3: Vercel Deployment

### 3.1 Vercel Account Setup

1. [Vercel](https://vercel.com) এ যান
2. **Sign Up** এ click করুন
3. **Continue with GitHub** select করুন
4. GitHub account দিয়ে login করুন

### 3.2 Import GitHub Repository

1. Vercel dashboard এ **New Project** এ click করুন
2. আপনার `poultry-farm-ledger` repository খুঁজুন
3. **Import** button এ click করুন

### 3.3 Configure Build Settings

1. **Framework Preset**: Vite
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 3.4 Environment Variables Setup

Vercel এ **Environment Variables** section এ এই variables add করুন:

```bash
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Atlas Connection
VITE_API_BASE_URL=https://your-vercel-app.vercel.app/api

# MongoDB Connection String (for serverless functions)
MONGODB_URI=mongodb+srv://poultry-admin:your_password@poultry-farm-cluster.xxxxx.mongodb.net/poultry-farm-ledger?retryWrites=true&w=majority
```

### 3.5 Deploy

1. **Deploy** button এ click করুন
2. Deployment complete হওয়ার জন্য wait করুন
3. আপনার app এর URL পাবেন: `https://poultry-farm-ledger.vercel.app`

---

## ⚡ Part 4: Vercel Serverless Functions (Backend)

### 4.1 Create API Directory Structure

আপনার project এ `api` folder তৈরি করুন:

```bash
mkdir api
```

### 4.2 Move Server Files to API Directory

```bash
# Copy server files to api directory
cp server/index.js api/
cp server/migrate.js api/
```

### 4.3 Create Serverless API Endpoints

Vercel এ backend endpoints গুলো serverless functions হিসেবে তৈরি করতে হবে।

---

## 📝 Part 5: Production Environment Variables

### 5.1 Local Environment (.env.local)

```bash
# Local development
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/poultry-farm-ledger
VITE_API_BASE_URL=http://localhost:3001/api
PORT=3001
```

### 5.2 Production Environment (Vercel)

```bash
# Production deployment
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://poultry-admin:password@cluster.mongodb.net/poultry-farm-ledger
VITE_API_BASE_URL=https://your-app.vercel.app/api
```

---

## 🔄 Part 6: Data Migration to Production

### 6.1 Migrate Local Data to Atlas

```bash
# Update migrate.js with Atlas connection
# Then run migration
npm run migrate
```

### 6.2 Test Production API

```bash
# Test your production API endpoints
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/records
```

---

## 📊 Part 7: Monitoring & Maintenance

### 7.1 Vercel Dashboard Monitoring

- **Analytics**: User visits, performance metrics
- **Functions**: Serverless function logs
- **Deployments**: Deployment history

### 7.2 MongoDB Atlas Monitoring

- **Metrics**: Database performance
- **Real-time Performance Panel**: Query performance
- **Alerts**: Set up alerts for issues

---

## 🚨 Part 8: Troubleshooting

### 8.1 Common Issues

#### Frontend Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### MongoDB Connection Issues

- Check connection string format
- Verify username/password
- Check IP whitelist in Atlas
- Test connection with MongoDB Compass

#### API Endpoint Errors

- Check environment variables in Vercel
- Verify serverless function syntax
- Check function logs in Vercel dashboard

### 8.2 Debug Commands

```bash
# Local development
npm run dev:fullstack

# Production build test
npm run build
npm run preview

# Database connection test
node -e "console.log(process.env.MONGODB_URI)"
```

---

## 🎯 Part 9: Production Deployment Checklist

- [ ] ✅ GitHub repository created and code pushed
- [ ] ✅ MongoDB Atlas cluster created and configured
- [ ] ✅ MongoDB user and network access configured
- [ ] ✅ Vercel project imported from GitHub
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Frontend deployed successfully
- [ ] ✅ Serverless API functions working
- [ ] ✅ Database connection established
- [ ] ✅ Sample data migrated
- [ ] ✅ All features tested in production
- [ ] ✅ Domain configured (optional)

---

## 🌟 Part 10: Post-Deployment

### 10.1 Custom Domain (Optional)

1. Vercel dashboard এ **Domains** section এ যান
2. Custom domain add করুন
3. DNS records configure করুন

### 10.2 Performance Optimization

- Image optimization
- Code splitting
- Caching strategies
- CDN configuration

### 10.3 Security

- Environment variables security
- CORS configuration
- Rate limiting
- Input validation

---

## 📞 Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/

---

## 🎉 Conclusion

আপনার **Poultry Farm Ledger** application এখন production ready এবং live!

**Live URLs:**

- 🌐 **Frontend**: https://your-app.vercel.app
- 🔌 **API**: https://your-app.vercel.app/api
- 🗃️ **Database**: MongoDB Atlas Cloud

এই guide follow করে আপনি সফলভাবে একটি full-stack application deploy করতে পারবেন।
