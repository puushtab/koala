#!/usr/bin/env python3
"""Quick test of the chatbot with a single query."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from mcp_handler import MCPClientHandler
from gemini_agent import GeminiAgent

async def test():
    print("=== Quick Chatbot Test ===\n")
    
    # Initialize MCP
    mcp = MCPClientHandler(Config.MCP_SERVER_COMMAND, Config.MCP_SERVER_ARGS)
    mcp_tools = []
    
    try:
        await mcp.connect()
        mcp_tools = await mcp.list_tools()
        print(f"✅ Loaded {len(mcp_tools)} MCP tools\n")
    except Exception as e:
        print(f"⚠️ MCP warning: {e}\n")
    
    # Initialize Gemini
    try:
        agent = GeminiAgent()
        agent.start_chat(mcp_tools=mcp_tools)
        print("✅ Gemini agent ready\n")
    except ValueError as e:
        print(f"❌ {e}")
        print("Please set your GEMINI_API_KEY in .env file")
        return False
    
    # Test query
    query = "Find vintage nike jackets on Vinted, limit 3"
    print(f"Query: {query}\n")
    
    response = await agent.send_message(query, mcp_client=mcp)
    print(f"\nResponse:\n{response}\n")
    
    await mcp.close()
    return True

if __name__ == "__main__":
    success = asyncio.run(test())
    sys.exit(0 if success else 1)
