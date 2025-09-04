# Poultry Farm Ledger - Development & Deployment Guide

## 📋 Quick Start

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poultry-farm-ledger
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate back to root directory:**

   ```bash
   cd ..
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env.local
   ```

3. **Start frontend development server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Backend (Vercel)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy backend:**

   ```bash
   cd server
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI`
   - `CORS_ORIGIN` (your frontend URL)

### Frontend (Vercel)

1. **Update `.env.local` with production API URL:**

   ```env
   VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
   ```

2. **Deploy frontend:**
   ```bash
   vercel
   ```

## 📊 MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create new project and cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and add to backend `.env`

## 🔧 Development Commands

### Backend

```bash
cd server
npm run dev        # Start development server
npm start          # Start production server
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📡 API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/records` - Get all records
- `GET /api/v1/records/:id` - Get single record
- `POST /api/v1/records` - Create record
- `PUT /api/v1/records/:id` - Update record
- `DELETE /api/v1/records/:id` - Delete record
- `GET /api/v1/records/stats` - Get statistics
