# 🐨 Koala - AI Shopping Assistant for Vinted

Search second-hand clothing on Vinted using natural language. Built with React, FastAPI, and Google Gemini AI.

## 🎯 What It Does

Koala lets you find items on Vinted by chatting naturally:
- Ask in plain language: "Find vintage Nike jackets under 50 euros"
- Get relevant results powered by AI
- Save time browsing through listings

## 🏗️ Architecture

```
red-panda/
├── frontend/          # React web application
├── backend/           # FastAPI REST API
└── ai/                # Gemini AI + MCP chatbot core
```

- **Frontend**: React UI for searching items
- **Backend**: FastAPI REST API
- **AI**: Google Gemini with Vinted search tools

## 🚀 Quick Start

### Prerequisites

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
```bash
# 1. Install AI dependencies
cd ai
pip install -r requirements.txt
cp .env.example .env
# Add your Gemini API key to .env

# 2. Start backend (new terminal)
cd backend
pip install -r requirements.txt
uvicorn api:app --reload --port 8000

# 3. Start frontend (new terminal)
cd frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## 📖 Usage

### Via Frontend (Recommended)

1. Open `http://localhost:3000`
2. Click the **+** button to start a new search
3. Select a category (Tops, Bottoms, Shoes, Accessories)
4. Enter a natural language query like:
   - "Find vintage Nike jackets under 50 euros"
   - "Red wool sweater, size M"
   - "Affordable running shoes in good condition"
5. Click "✨ Search with AI" to get intelligent results

### Via API

**Web Interface**: Open `http://localhost:3000`, click **+**, select a category, and type your search.

**API**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Find vintage Nike shoes under 50 euros"}'
```

**CLI**: 
```bash
cd ai && python3 main.py
``` /tools
```

Returns MCP tools (search_items, get_item_details).

### Chat
```
## 🔧 API Endpoints

- `GET /health` - Check API status
- `GET /tools` - List available search tools
- `POST /chat` - Send a search query
- `POST /reset` - Clear conversation history Vinted
  - Parameters: query, limit, price_to, order
  
- **`get_item_details`**: Get detailed information about a specific item
  - Parameters: item_id

## 📁 Project Structure

```
red-panda/
│
├── ai/
│   ├── main.py                 # CLI chatbot entry point
│   ├── gemini_agent.py         # Gemini AI integration
│   ├── mcp_handler.py          # MCP client connection
│   ├── vinted_server.py        # MCP server with Vinted tools
│   ├── config.py               # Configuration management
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # API keys (not committed)
│
├── backend/
│   ├── api.py                  # FastAPI REST endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── test_api.py             # API tests
│   └── start.sh                # Server startup script
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js              # Main routing component
    │   ├── components/
## 🛠️ AI Tools

- `search_items` - Search Vinted by query, price, etc.
- `get_item_details` - Get details for a specific item

### Test Backend API
```bash
cd backend
python3 test_api.py
```

### Test Frontend
Open `backend/test_frontend.html` in a browser or run:
```bash
cd backend
./demo.sh
```

## 🔐 Environment Variables

Create `ai/.env` with:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 📚 Documentation

- **Frontend**: See `frontend/README.md` for detailed UI documentation
- **Backend**: See `backend/README.md` for API documentation and examples
- **AI Core**: See `ai/README.md` for MCP and Gemini integration details
- **LLM Integration**: See `frontend/LLM_INTEGRATION_GUIDE.md` for integration guide

## 🐛 Troubleshooting

- **Tools not loading**: Run `python3 ai/test_mcp.py`
- **API issues**: Check backend is on port 8000 and API key is set
- **Frontend issues**: Check browser console for errors

---

Built for the X-HEC Impact Hackathon 🎓