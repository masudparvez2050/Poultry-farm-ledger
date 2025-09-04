# API Test Guide

## Testing the Backend API

You can use any of these methods to test your API:

### 1. Using cURL (Command Line)

```bash
# Health Check
curl -X GET http://localhost:3000/health

# Get all records
curl -X GET http://localhost:3000/api/v1/records

# Create a new record
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

# Get statistics
curl -X GET http://localhost:3000/api/v1/records/stats
```

### 2. Using PowerShell (Windows)

```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get

# Create a new record
$body = @{
    date = "2025-09-04"
    truckId = "TR001"
    invoiceNo = "INV001"
    weights = @(45.5, 42.3, 48.1)
    buckleNumber = 3
    buckleWeight = 0.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/records" -Method Post -Body $body -ContentType "application/json"
```

### 3. Using VS Code REST Client Extension

Create a file called `api-test.http`:

```http
### Health Check
GET http://localhost:3000/health

### Get all records
GET http://localhost:3000/api/v1/records

### Create new record
POST http://localhost:3000/api/v1/records
Content-Type: application/json

{
  "date": "2025-09-04",
  "truckId": "TR001",
  "invoiceNo": "INV001",
  "weights": [45.5, 42.3, 48.1],
  "buckleNumber": 3,
  "buckleWeight": 0.5
}

### Get statistics
GET http://localhost:3000/api/v1/records/stats
```
