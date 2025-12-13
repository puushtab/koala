#!/bin/bash
# Quick start script for the FastAPI backend

echo "🚀 Starting Vinted AI Chatbot API..."
echo ""

# Check if in backend directory
if [ ! -f "api.py" ]; then
    echo "❌ Error: Must run from backend directory"
    exit 1
fi

# Check if .env exists in ai directory
if [ ! -f "../ai/.env" ]; then
    echo "⚠️  Warning: ../ai/.env not found"
    echo "   Please create it with your GEMINI_API_KEY"
    echo ""
fi

# Install dependencies if needed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r ../ai/requirements.txt
    echo ""
fi

# Start the server
echo "✅ Starting server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""

cd ..
python3 -m uvicorn backend.api:app --reload --host 0.0.0.0 --port 8000
