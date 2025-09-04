<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🐓 Poultry Farm Ledger

A modern web application for poultry farms to digitally record and analyze daily truck-wise poultry weight data, replacing traditional paper-based systems with intelligent data management.

## ✨ Features

- 📊 **Digital Weight Recording**: Replace paper records with digital entries
- 🤖 **AI-Powered OCR**: Extract weight data from images using Google Gemini AI
- 📈 **Analytics Dashboard**: Visual charts and statistics for data insights
- 🚛 **Truck Management**: Track deliveries by truck ID and invoice numbers
- 💾 **MongoDB Integration**: Cloud database with automatic backup
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates**: Live data synchronization across devices

## 🛠️ Tech Stack

**Frontend:**

- React 19 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization

**Backend:**

- Node.js + Express
- MongoDB Atlas (Cloud Database)
- Mongoose ODM

**AI/ML:**

- Google Gemini AI for OCR
- Image processing for weight extraction

**Deployment:**

- Vercel (Frontend + Serverless Functions)
- MongoDB Atlas (Database)

## 🚀 Quick Start (Local Development)

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas)

1. **Clone & Install:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/poultry-farm-ledger.git
   cd poultry-farm-ledger
   npm install
   ```

2. **Environment Setup:**
   Create `.env.local`:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=mongodb://localhost:27017/poultry-farm-ledger
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

3. **Run Development:**

   ```bash
   # Start both frontend and backend
   npm run dev:fullstack

   # Or run separately:
   npm run server    # Backend only
   npm run dev       # Frontend only
   ```

4. **Access Application:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001/api

## 📤 Deployment Guide

### 🌐 Deploy to Vercel + MongoDB Atlas

1. **MongoDB Atlas Setup:**

   - Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create M0 cluster (free tier)
   - Get connection string

2. **GitHub Repository:**

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/poultry-farm-ledger.git
   git push -u origin main
   ```

3. **Vercel Deployment:**

   - Connect GitHub repo to [Vercel](https://vercel.com)
   - Set environment variables:
     ```
     GEMINI_API_KEY=your_api_key
     MONGODB_URI=mongodb+srv://...
     VITE_API_BASE_URL=https://your-app.vercel.app/api
     ```

4. **Deploy & Test:**
   - App URL: `https://your-app-name.vercel.app`
   - API Health: `https://your-app-name.vercel.app/api/health`

📖 **Detailed guides:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

## 📊 API Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/health`      | Health check             |
| GET    | `/api/records`     | Get all delivery records |
| POST   | `/api/records`     | Create new record        |
| PUT    | `/api/records/:id` | Update existing record   |
| DELETE | `/api/records/:id` | Delete record            |

## 💾 Database Schema

```javascript
{
  date: "2025-01-01",           // Delivery date
  truckId: "GK-114",            // Truck identifier
  invoiceNo: "151775",          // Invoice number
  weights: [56.7, 58.2, ...],   // Individual weights array
  buckleNumber: 5,              // Number of buckles
  buckleWeight: 8,              // Weight per buckle

  // Auto-calculated fields:
  grossWeight: 570.5,           // Sum of all weights
  totalBuckleWeight: 40,        // buckleNumber × buckleWeight
  netWeight: 530.5,             // grossWeight - totalBuckleWeight
  averageWeight: 53.05,         // netWeight ÷ entryCount
  entryCount: 10                // Total number of weights
}
```

## 🎯 Usage Guide

1. **Add New Record:**

   - Click "+" button
   - Fill delivery details
   - Add weights manually or scan image
   - Save record

2. **AI Weight Extraction:**

   - Upload image of weight sheet
   - AI automatically extracts weights
   - Review and edit if needed
   - Save extracted data

3. **View Analytics:**

   - Dashboard shows total deliveries, weights
   - Bar chart for recent deliveries
   - Expandable record cards with details

4. **Edit/Delete Records:**
   - Click edit icon on record cards
   - Modify any field
   - Delete records with confirmation

## 🔧 Development Scripts

```bash
npm run dev              # Frontend development server
npm run server          # Backend server only
npm run dev:fullstack   # Both frontend + backend
npm run build           # Production build
npm run migrate         # Migrate sample data
npm run deploy          # Deploy to Vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for OCR capabilities
- **MongoDB Atlas** for cloud database
- **Vercel** for seamless deployment
- **React + Vite** for modern development experience

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/poultry-farm-ledger/issues)
- 📖 Documentation: [Project Wiki](https://github.com/YOUR_USERNAME/poultry-farm-ledger/wiki)

---

<div align="center">

**[🚀 Live Demo](https://your-app-name.vercel.app)** | **[📊 API Docs](https://your-app-name.vercel.app/api)** | **[🤖 AI Studio](https://ai.studio/apps/drive/1OuizvSJvCPkf5qL_UfoWe6AaAXJTVaWj)**

Made with ❤️ for modern poultry farming

</div>
