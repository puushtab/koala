#!/bin/bash
# All-in-one demo script

echo "🎉 Vinted AI Chatbot - Full Demo"
echo "================================"
echo ""

# Check dependencies
echo "📦 Checking dependencies..."
pip install -q fastapi uvicorn requests 2>/dev/null

# Start the API in background
echo "🚀 Starting API server..."
cd "$(dirname "$0")/.."
python3 -m uvicorn backend.api:app --host 0.0.0.0 --port 8000 > /tmp/vinted_api.log 2>&1 &
API_PID=$!

echo "   API PID: $API_PID"
echo "   Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ Failed to start API server"
    echo "   Check logs: tail /tmp/vinted_api.log"
    kill $API_PID 2>/dev/null
    exit 1
fi

echo "✅ API server is running!"
echo ""

# Show available options
echo "📋 Available Options:"
echo ""
echo "  1. View API docs:    http://localhost:8000/docs"
echo "  2. Test with curl:   curl http://localhost:8000/health"
echo "  3. Run test script:  python3 backend/test_api.py"
echo "  4. Open web demo:    backend/demo.html"
echo ""
echo "  API is running on http://localhost:8000"
echo "  Press Ctrl+C to stop"
echo ""

# Show live logs
echo "📊 Live Logs:"
echo "───────────────"
tail -f /tmp/vinted_api.log &
TAIL_PID=$!

# Cleanup on exit
trap "echo ''; echo '🛑 Stopping server...'; kill $API_PID $TAIL_PID 2>/dev/null; exit" INT TERM

# Wait forever
wait $API_PID
