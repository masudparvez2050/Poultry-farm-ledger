# Poultry Farm Ledger - Backend API

A RESTful API built with Express.js and MongoDB for managing poultry farm delivery records.

## 🚀 Features

- **Full CRUD Operations** for delivery records
- **MongoDB Integration** with Mongoose ODM
- **Data Validation** using express-validator
- **Error Handling** with proper HTTP status codes
- **Security** with Helmet, CORS, and Rate Limiting
- **Performance** optimization with compression
- **Pagination and Search** functionality
- **Statistics** endpoint for analytics
- **Vercel Deployment** ready configuration

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── index.js         # Configuration settings
│   ├── controllers/
│   │   ├── recordController.js  # Business logic
│   │   └── index.js
│   ├── middleware/
│   │   ├── validation.js    # Input validation rules
│   │   ├── errorHandler.js  # Error handling middleware
│   │   └── index.js
│   ├── models/
│   │   ├── DeliveryRecord.js # Mongoose schema
│   │   └── index.js
│   ├── routes/
│   │   ├── recordRoutes.js  # API routes
│   │   └── index.js
│   └── index.js             # Main server file
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── vercel.json              # Vercel deployment config
└── README.md
```

## 🛠️ Installation

1. **Navigate to the server directory:**

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

   Update `.env` with your MongoDB connection string and other configurations.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://your-vercel-app.vercel.app/api/v1`

### Endpoints

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/health`        | Health check                      |
| GET    | `/records`       | Get all records (with pagination) |
| GET    | `/records/:id`   | Get single record                 |
| POST   | `/records`       | Create new record                 |
| PUT    | `/records/:id`   | Update record                     |
| DELETE | `/records/:id`   | Delete record                     |
| GET    | `/records/stats` | Get statistics                    |

### Query Parameters for GET /records

- `page` (number): Page number (default: 1)
- `limit` (number): Records per page (default: 100, max: 100)
- `sortBy` (string): Sort field (date, truckId, invoiceNo, grossWeight, netWeight, createdAt)
- `sortOrder` (string): Sort order (asc, desc)
- `search` (string): Search in truckId and invoiceNo

### Request/Response Examples

#### Create Record (POST /api/v1/records)

```json
{
  "date": "2025-09-04",
  "truckId": "TR001",
  "invoiceNo": "INV001",
  "weights": [45.5, 42.3, 48.1],
  "buckleNumber": 3,
  "buckleWeight": 0.5
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "66d123456789abcdef123456",
    "date": "2025-09-04",
    "truckId": "TR001",
    "invoiceNo": "INV001",
    "weights": [45.5, 42.3, 48.1],
    "buckleNumber": 3,
    "buckleWeight": 0.5,
    "grossWeight": 135.9,
    "totalBuckleWeight": 1.5,
    "netWeight": 134.4,
    "averageWeight": 44.8,
    "entryCount": 3,
    "createdAt": "2025-09-04T10:30:00.000Z",
    "updatedAt": "2025-09-04T10:30:00.000Z"
  },
  "message": "Record created successfully"
}
```

## 🔒 Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/poultry-farm-ledger?retryWrites=true&w=majority
API_BASE_URL=/api/v1
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel:**
   - Go to your project dashboard on Vercel
   - Navigate to Settings → Environment Variables
   - Add your MongoDB URI and other configuration variables

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to environment variables

## 🧪 API Testing

You can test the API using tools like:

- **Postman**: Import the collection using the endpoints above
- **cURL**: Use command line to test endpoints
- **Thunder Client**: VS Code extension for API testing

### Example cURL Commands

```bash
# Health Check
curl -X GET http://localhost:3000/health

# Get all records
curl -X GET http://localhost:3000/api/v1/records

# Create a record
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

## 📊 Features

- **Automatic Calculations**: Gross weight, net weight, and average weight are calculated automatically
- **Data Validation**: Comprehensive input validation with error messages
- **Error Handling**: Proper HTTP status codes and error responses
- **Security**: Rate limiting, CORS, helmet for security headers
- **Performance**: Compression middleware for better performance
- **Logging**: Morgan logger for request logging
- **Graceful Shutdown**: Proper cleanup on server shutdown

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📝 License

This project is licensed under the MIT License.
