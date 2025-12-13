from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import logging
import warnings
import sys
from pathlib import Path

# Add the ai directory to path so we can import modules
ai_dir = Path(__file__).parent.parent / "ai"
sys.path.insert(0, str(ai_dir))

# Suppress warnings and set up logging
warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.ERROR)
for logger_name in ['mcp', 'vinted', 'urllib3', 'docket', 'asyncio', 'fastmcp', 'mcp.server', 'mcp.client']:
    logging.getLogger(logger_name).setLevel(logging.ERROR)
    logging.getLogger(logger_name).propagate = False

from config import Config
from mcp_handler import MCPClientHandler
from gemini_agent import GeminiAgent

# Initialize FastAPI app
app = FastAPI(
    title="Vinted AI Chatbot API",
    description="AI-powered chatbot with Vinted search capabilities via MCP tools",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for MCP and agent
mcp_client: Optional[MCPClientHandler] = None
gemini_agent: Optional[GeminiAgent] = None
mcp_tools = []

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    tools_used: list[str] = []

class HealthResponse(BaseModel):
    status: str
    mcp_connected: bool
    tools_loaded: int
    gemini_configured: bool

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize MCP connection and Gemini agent on startup."""
    global mcp_client, gemini_agent, mcp_tools
    
    print("🚀 Starting Vinted AI Chatbot API...")
    
    # Initialize MCP
    mcp_client = MCPClientHandler(Config.MCP_SERVER_COMMAND, Config.MCP_SERVER_ARGS)
    
    try:
        await mcp_client.connect()
        mcp_tools = await mcp_client.list_tools()
        print(f"✅ MCP Connected - {len(mcp_tools)} tools loaded")
    except Exception as e:
        print(f"⚠️  MCP Connection warning: {e}")
        mcp_tools = []
    
    # Initialize Gemini agent
    try:
        gemini_agent = GeminiAgent()
        gemini_agent.start_chat(mcp_tools=mcp_tools)
        print("✅ Gemini Agent initialized")
    except Exception as e:
        print(f"❌ Failed to initialize Gemini: {e}")
        raise

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up MCP connection on shutdown."""
    global mcp_client
    if mcp_client:
        await mcp_client.close()
        print("🔌 MCP Connection closed")

# API Endpoints
@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Vinted AI Chatbot API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "chat": "/chat (POST)",
            "tools": "/tools"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and service status."""
    return HealthResponse(
        status="healthy" if gemini_agent else "degraded",
        mcp_connected=mcp_client is not None and len(mcp_tools) > 0,
        tools_loaded=len(mcp_tools),
        gemini_configured=Config.GEMINI_API_KEY is not None
    )

@app.get("/tools")
async def list_tools():
    """List available MCP tools."""
    return {
        "tools": [
            {
                "name": tool.name,
                "description": tool.description
            }
            for tool in mcp_tools
        ],
        "count": len(mcp_tools)
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the AI chatbot and get a response.
    
    The chatbot can automatically search Vinted when asked about items.
    """
    if not gemini_agent:
        raise HTTPException(status_code=503, detail="Gemini agent not initialized")
    
    if not mcp_client:
        raise HTTPException(status_code=503, detail="MCP client not connected")
    
    try:
        # Send message to agent
        response = await gemini_agent.send_message(request.message, mcp_client=mcp_client)
        
        return ChatResponse(
            response=response,
            conversation_id=request.conversation_id,
            tools_used=[]  # Could track which tools were called
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.post("/chat/reset")
async def reset_chat():
    """Reset the chat session and start fresh."""
    global gemini_agent
    
    try:
        gemini_agent = GeminiAgent()
        gemini_agent.start_chat(mcp_tools=mcp_tools)
        return {"status": "success", "message": "Chat session reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting chat: {str(e)}")

# Run with: uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
