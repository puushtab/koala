# FastAPI Backend for Vinted AI Chatbot

A RESTful API backend that exposes the Gemini + MCP chatbot functionality.

## Features

- 🔌 RESTful API endpoints for chat interactions
- 🤖 Powered by Gemini AI with MCP tools
- 🔍 Automatic Vinted search via AI
- 💬 Conversational interface
- 🚀 Fast and async with FastAPI

## Installation

```bash
# Install dependencies
pip install -r ../ai/requirements.txt
```

## Configuration

Create a `.env` file in the `ai/` directory:
```
GEMINI_API_KEY=your_api_key_here
```

## Running the API

### Development mode (with auto-reload):
```bash
cd /home/pushtab/ENSTA/Cesure/Hackathon/red-panda/backend
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### Production mode:
```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "mcp_connected": true,
  "tools_loaded": 2,
  "gemini_configured": true
}
```

### List Available Tools
```bash
GET /tools
```

Response:
```json
{
  "tools": [
    {
      "name": "search_items",
      "description": "Search for items on Vinted..."
    },
    {
      "name": "get_item_details",
      "description": "Get detailed information..."
    }
  ],
  "count": 2
}
```

### Chat
```bash
POST /chat
Content-Type: application/json

{
  "message": "Find vintage nike shoes under 50 euros",
  "conversation_id": "optional-session-id"
}
```

Response:
```json
{
  "response": "I found 10 Nike shoes under 50 euros:\n* Nike Air Max...",
  "conversation_id": "optional-session-id",
  "tools_used": []
}
```

### Reset Chat Session
```bash
POST /chat/reset
```

Response:
```json
{
  "status": "success",
  "message": "Chat session reset"
}
```

## Example Usage

### Using curl:
```bash
# Health check
curl http://localhost:8000/health

# Send a chat message
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Search for vintage adidas jackets"}'

# List tools
curl http://localhost:8000/tools
```

### Using Python requests:
```python
import requests

# Chat with the AI
response = requests.post("http://localhost:8000/chat", json={
    "message": "Find nike shoes under 50 euros"
})
print(response.json()["response"])
```

### Using JavaScript/Fetch:
```javascript
// Chat with the AI
fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Find vintage nike shoes'
  })
})
.then(res => res.json())
.then(data => console.log(data.response));
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│  FastAPI     │─────▶│   Gemini    │
│  (HTTP)     │      │   Backend    │      │    Agent    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌─────────────┐
                     │  MCP Client  │─────▶│   Vinted    │
                     │   Handler    │      │  MCP Tools  │
                     └──────────────┘      └─────────────┘
```

## CORS Configuration

The API is configured to allow all origins for development. For production, update the CORS settings in `api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `503` - Service unavailable (Gemini or MCP not initialized)
- `500` - Internal server error

## Notes

- The MCP server is started automatically when the API starts
- Chat sessions are stateful within the Gemini agent
- Use `/chat/reset` to start a fresh conversation
- All logging is suppressed for cleaner output
