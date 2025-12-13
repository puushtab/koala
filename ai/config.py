import os
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # MCP Server for Vinted tools
    MCP_SERVER_COMMAND = "python3" 
    MCP_SERVER_ARGS = [os.path.join(os.path.dirname(__file__), "vinted_server.py")]

    if not GEMINI_API_KEY:
        print("⚠️  WARNING: GEMINI_API_KEY not found in environment variables.")
        print("   Please create a .env file with your API key to use the chatbot.")
        print("   Example: cp .env.example .env and edit it with your key.")