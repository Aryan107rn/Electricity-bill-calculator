#!/bin/bash

# ElectraBill - Full Stack Startup Script
echo "⚡ ElectraBill Full Stack Setup"
echo "================================"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Install backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd "$ROOT_DIR/backend" && npm install

# 2. Install frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd "$ROOT_DIR" && npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the project, open two terminal windows:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd $ROOT_DIR/backend && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd $ROOT_DIR && npm run dev"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:5001/api/health"
echo ""
echo "📋 MongoDB is optional; without it, bills are stored in backend/data/bills.json."
echo "  To use MongoDB, run mongod or update backend/.env with your Atlas URI."
