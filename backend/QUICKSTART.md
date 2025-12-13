# 🎉 FastAPI Backend - Complete!

## What's Been Created

A complete RESTful API backend that exposes your Gemini + MCP chatbot as HTTP endpoints!

### 📁 Files Created:

1. **`backend/api.py`** - Main FastAPI application
2. **`backend/requirements.txt`** - Backend dependencies
3. **`backend/README.md`** - Complete API documentation
4. **`backend/start.sh`** - Quick start script
5. **`backend/test_api.py`** - API testing script
6. **`backend/demo.html`** - Interactive web UI demo

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd /home/pushtab/ENSTA/Cesure/Hackathon/red-panda
pip install -r backend/requirements.txt
```

### 2. Start the API Server
```bash
cd backend
./start.sh
```

Or manually:
```bash
cd /home/pushtab/ENSTA/Cesure/Hackathon/red-panda
python3 -m uvicorn backend.api:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the API
- **API Server**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Web Demo**: Open `backend/demo.html` in your browser

## 📡 API Endpoints

### GET `/health`
Check if the API is running and services are connected.

**Response:**
```json
{
  "status": "healthy",
  "mcp_connected": true,
  "tools_loaded": 2,
  "gemini_configured": true
}
```

### GET `/tools`
List all available MCP tools.

**Response:**
```json
{
  "tools": [
    {
      "name": "search_items",
      "description": "Search for items on Vinted..."
    }
  ],
  "count": 2
}
```

### POST `/chat`
Send a message to the AI chatbot.

**Request:**
```json
{
  "message": "Find vintage nike shoes under 50 euros",
  "conversation_id": "optional-uuid"
}
```

**Response:**
```json
{
  "response": "I found 10 Nike shoes...",
  "conversation_id": "optional-uuid",
  "tools_used": []
}
```

### POST `/chat/reset`
Reset the conversation and start fresh.

**Response:**
```json
{
  "status": "success",
  "message": "Chat session reset"
}
```

## 🧪 Testing

### Test with curl:
```bash
# Health check
curl http://localhost:8000/health

# Chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find adidas shoes"}'
```

### Run the test script:
```bash
python3 backend/test_api.py
```

### Try the web demo:
```bash
# Open in browser
open backend/demo.html
# or
firefox backend/demo.html
```

## 🔧 Features

✅ **RESTful API** - Standard HTTP endpoints  
✅ **CORS Enabled** - Works with web frontends  
✅ **Auto Documentation** - Swagger UI + ReDoc  
✅ **Async Support** - Fast and scalable  
✅ **Error Handling** - Proper HTTP status codes  
✅ **Health Checks** - Monitor service status  
✅ **Stateful Chat** - Maintains conversation context  
✅ **Tool Integration** - Automatic MCP tool calling  

## 🎨 Web Demo Features

The included `demo.html` provides:
- Beautiful, modern UI
- Real-time chat interface
- Loading indicators
- Error handling
- Responsive design
- No build step required!

## 🔌 Integration Examples

### Python
```python
import requests

response = requests.post("http://localhost:8000/chat", json={
    "message": "Find vintage nike jackets"
})
print(response.json()["response"])
```

### JavaScript
```javascript
fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'Find nike shoes'})
})
.then(r => r.json())
.then(data => console.log(data.response));
```

### React
```jsx
const chat = async (message) => {
  const res = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message})
  });
  const data = await res.json();
  return data.response;
};
```

## 📊 Architecture

```
┌──────────────┐
│  Web Client  │
│  (Browser)   │
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────┐
│   FastAPI    │
│   Backend    │◄────┐
└──────┬───────┘     │
       │             │
       ▼             │
┌──────────────┐     │
│    Gemini    │     │
│    Agent     │     │
└──────┬───────┘     │
       │             │
       ▼             │
┌──────────────┐     │
│ MCP Handler  │─────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Vinted     │
│  MCP Tools   │
└──────────────┘
```

## 🚀 Production Deployment

### With multiple workers:
```bash
uvicorn backend.api:app --host 0.0.0.0 --port 8000 --workers 4
```

### With Gunicorn:
```bash
gunicorn backend.api:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker (optional):
```dockerfile
FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install -r backend/requirements.txt
CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Notes

- The API automatically starts the MCP server on startup
- Chat sessions are maintained in memory (not persistent)
- Use `/chat/reset` to clear conversation history
- CORS is enabled for all origins (configure for production)
- All verbose logging is suppressed for clean output

## 🎯 Next Steps

1. **Start the API**: `./backend/start.sh`
2. **Open the demo**: Open `backend/demo.html` in browser
3. **Try the API**: Visit http://localhost:8000/docs
4. **Integrate**: Use the API endpoints in your app

**Everything is ready to use! 🎊**
