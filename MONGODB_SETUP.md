# MongoDB Setup Guide

## Prerequisites

1. **MongoDB Installation**: MongoDB আপনার সিস্টেমে install করতে হবে।

### Windows এ MongoDB Install করার উপায়:

1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) থেকে download করুন
2. Installer run করুন এবং "Complete" installation বেছে নিন
3. "Install MongoDB as a Service" চেক করুন
4. MongoDB Compass (GUI) install করতে চাইলে সেটাও চেক করুন

### অথবা Chocolatey দিয়ে:

```powershell
choco install mongodb
```

## MongoDB Server চালানো

### Method 1: Service হিসেবে (Recommended)

MongoDB installation এর সময় service হিসেবে install হলে এটি automatically চালু থাকবে।

### Method 2: Manual

```powershell
mongod --dbpath "C:\data\db"
```

## Project Setup

### 1. Dependencies Install

```bash
npm install
```

### 2. Environment Variables

`.env.local` ফাইলে MongoDB connection string check করুন:

```
MONGODB_URI=mongodb://localhost:27017/poultry-farm-ledger
```

### 3. Sample Data Migration (Optional)

```bash
node server/migrate.js
```

### 4. Backend Server চালানো

```bash
npm run server
```

### 5. Frontend + Backend একসাথে চালানো

```bash
npm run dev:fullstack
```

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/records` - All delivery records
- `POST /api/records` - Create new record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

## Database Schema

```javascript
{
  date: String,           // "2025-01-01"
  truckId: String,        // "GK-114"
  invoiceNo: String,      // "151775"
  weights: [Number],      // [56.7, 58.2, ...]
  buckleNumber: Number,   // 5
  buckleWeight: Number,   // 8

  // Calculated fields
  entryCount: Number,
  grossWeight: Number,
  totalBuckleWeight: Number,
  netWeight: Number,
  averageWeight: Number,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Issues

1. MongoDB service running কিনা check করুন:

   ```powershell
   net start MongoDB
   ```

2. Port 27017 available কিনা check করুন:
   ```powershell
   netstat -an | findstr :27017
   ```

### API Connection Issues

1. Backend server running কিনা check করুন (port 3001)
2. CORS settings check করুন
3. Environment variables properly set কিনা check করুন
