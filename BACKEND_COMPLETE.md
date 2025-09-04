# 🐔 Poultry Farm Ledger Backend API

## ✅ সম্পূর্ণ MVC Pattern এ Backend API তৈরি হয়েছে

আপনার Poultry Farm Ledger প্রোজেক্টের জন্য সম্পূর্ণ MVC প্যাটার্নে একটি Backend API তৈরি করা হয়েছে যা MongoDB ডাটাবেস ব্যবহার করে এবং Vercel-এ deploy করার জন্য সম্পূর্ণভাবে configured।

## 📁 প্রোজেক্ট স্ট্রাকচার

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   └── index.js      # App configuration
│   ├── controllers/      # Business logic
│   │   ├── recordController.js
│   │   └── index.js
│   ├── middleware/       # Custom middleware
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── index.js
│   ├── models/          # Database models
│   │   ├── DeliveryRecord.js
│   │   └── index.js
│   ├── routes/          # API routes
│   │   ├── recordRoutes.js
│   │   └── index.js
│   └── index.js         # Main server file
├── scripts/
│   └── migrate.js       # Data migration script
├── .env.example         # Environment variables template
├── package.json
├── vercel.json         # Vercel deployment config
└── README.md
```

## 🚀 Features

### ✨ Complete CRUD Operations

- ✅ GET all records (with pagination, sorting, search)
- ✅ GET single record by ID
- ✅ POST create new record
- ✅ PUT update existing record
- ✅ DELETE record
- ✅ GET statistics

### 🔐 Security & Performance

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Compression for better performance
- ✅ Request logging with Morgan

### 🗄️ Database

- ✅ MongoDB with Mongoose ODM
- ✅ Automatic field calculations (gross weight, net weight, average)
- ✅ Data validation at database level
- ✅ Indexes for better performance
- ✅ Proper schema design

### 🌐 Deployment Ready

- ✅ Vercel configuration
- ✅ Environment variables setup
- ✅ Production optimizations
- ✅ Graceful shutdown handling

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Frontend Update

Frontend এর `apiService.ts` ফাইল update করা হয়েছে যা এখন localStorage এর পরিবর্তে আপনার Backend API ব্যবহার করবে।

```bash
# Root directory তে
cp .env.example .env.local
# Edit .env.local with your API URL
```

## 🌐 API Endpoints

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/health`               | Server health check |
| GET    | `/api/v1/records`       | Get all records     |
| GET    | `/api/v1/records/:id`   | Get single record   |
| POST   | `/api/v1/records`       | Create new record   |
| PUT    | `/api/v1/records/:id`   | Update record       |
| DELETE | `/api/v1/records/:id`   | Delete record       |
| GET    | `/api/v1/records/stats` | Get statistics      |

## 📊 Sample API Request

```bash
# Create new record
curl -X POST http://localhost:3000/api/v1/records \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-09-04",
    "truckId": "TR001",
    "invoiceNo": "INV001",
    "weights": [45.5, 42.3, 48.1],
    "buckleNumber": 3,
    "buckleWeight": 0.5
  }'
```

## 🚀 Deployment Steps

### MongoDB Atlas Setup

1. [MongoDB Atlas](https://cloud.mongodb.com/) এ account তৈরি করুন
2. New cluster create করুন
3. Database user create করুন
4. IP whitelist করুন (0.0.0.0/0)
5. Connection string copy করুন

### Backend Deployment (Vercel)

```bash
cd server
npm install -g vercel
vercel login
vercel
```

### Environment Variables (Vercel Dashboard)

- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB connection string
- `CORS_ORIGIN`: Your frontend URL

### Frontend Update

`.env.local` ফাইলে production API URL add করুন:

```
VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

## 🧪 Testing

সার্ভার চালু করার পর test করুন:

```bash
# Server start করুন
cd server
npm run dev

# আরেকটি terminal এ test করুন
curl http://localhost:3000/health
```

## ✅ Migration থেকে Database

যদি আপনার localStorage এ আগে থেকে data থাকে, তাহলে migration script ব্যবহার করুন:

```bash
cd server
npm run migrate
```

## 🎯 Next Steps

1. ✅ MongoDB Atlas এ database setup করুন
2. ✅ Backend Vercel এ deploy করুন
3. ✅ Environment variables set করুন
4. ✅ Frontend এর `.env.local` update করুন
5. ✅ Frontend deploy করুন

আপনার প্রোজেক্ট এখন সম্পূর্ণভাবে Backend API এর সাথে connected এবং production-ready! 🚀
