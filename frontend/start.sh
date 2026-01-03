#!/bin/bash

# Quick Start Script for Red Panda Full Stack

echo "🐼 Red Panda - Quick Start"
echo "=========================="
echo ""

# Check if in correct directory
if [ ! -f "BACKEND_INTEGRATION.md" ]; then
    echo "❌ Please run this script from the pandaroux_new4 directory"
    exit 1
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 8000"
else
    echo "⚠️  Backend is NOT running!"
    echo ""
    echo "Please start the backend first:"
    echo "  cd ../backend"
    echo "  export GEMINI_API_KEY=your_key_here"
    echo "  python api.py"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

echo ""
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "🚀 Starting frontend development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend should be at: http://localhost:8000"
echo ""

npm start
