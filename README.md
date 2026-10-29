# ⚡ ElectraBill — Full Stack Electricity Bill Calculator

A production-quality full-stack electricity bill calculator built with **Node.js + Express + MongoDB + React (Vite)**.

---

## 🏗️ Architecture

```
electricity-bill-calculator/
├── backend/                 ← Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/          ← DB connection & state slab data
│   │   ├── controllers/     ← Bill & State controllers
│   │   ├── middleware/      ← Error handler
│   │   ├── models/          ← Mongoose Bill schema
│   │   ├── routes/          ← Express routes
│   │   ├── utils/           ← OOP Calculator (Factory Pattern)
│   │   └── server.js        ← Entry point
│   └── .env                 ← Environment config
│
└── src/                     ← React (Vite) frontend
    ├── components/          ← Navbar, SlabCard, BillResult, ApplianceEstimator
    ├── pages/               ← Calculator, History, Stats
    ├── hooks/               ← useDarkMode, useBills
    └── services/            ← Axios API client
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- MongoDB running locally (or an Atlas URI) for database-backed storage; without it, bills are stored in `backend/data/bills.json`.

### 1. Install all dependencies

```bash
# Run the setup script (installs both backend + frontend)
bash setup.sh
```

Or manually:
```bash
# Backend
cd backend && npm install

# Frontend (root)
cd .. && npm install
```

### 2. Configure environment

The `backend/.env` file is pre-configured for local MongoDB:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/electricity_bill_db
NODE_ENV=development
```

> 💡 To use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string. Local JSON storage keeps history and statistics available when MongoDB is offline.

### 3. Start both servers

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

- 🌐 Frontend: http://localhost:5173
- 🔌 API: http://localhost:5001/api/health

---

## ✨ Features

### Calculator Page
- **5 Indian States**: Maharashtra, Delhi, Karnataka, Gujarat, Uttar Pradesh
- **3 Connection Types**: Domestic, Commercial, Industrial
- **Real slab-rate preview** with animated bars & active slab highlighting
- **Units slider** for quick input
- **Appliance Estimator** — select from 12 preset appliances or add custom ones to estimate your monthly kWh
- **Auto-save** — calculations save to MongoDB when connected, with a local JSON fallback otherwise
- **Print / PDF** — browser-based bill printing with formatted receipt

### History Page
- Full bill history from MongoDB or the local JSON fallback
- Filter by **state** and **connection type**
- Summary stats (count, total spend, average)
- **Delete** individual records with animation

### Statistics Page
- Overview stat cards (total bills, spend, avg, max units)
- **Pie chart** — spend breakdown by connection type
- **Bar chart** — spend by state
- **Line chart** — bill amount trend over time
- Highest / Lowest bill highlights

### UI/UX
- **Dark / Light mode** toggle (persisted to localStorage)
- Animated background mesh
- Glassmorphism card design
- Responsive for all screen sizes
- Toast notifications (react-hot-toast)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/states` | Get all state slab configurations |
| POST | `/api/bills/calculate` | Calculate + save a bill |
| GET | `/api/bills/history` | Get bill history |
| GET | `/api/bills/stats` | Get aggregated statistics |
| DELETE | `/api/bills/:id` | Delete a bill |
| POST | `/api/bills/estimate-appliances` | Estimate units from appliances |

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| Charts | Recharts |
| HTTP | Axios |
| Toasts | react-hot-toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| OOP Pattern | Factory Pattern (BaseCalculator) |
