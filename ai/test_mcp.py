#!/usr/bin/env python3
"""Test script to verify MCP connection works independently."""
import asyncio
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from mcp_handler import MCPClientHandler

async def main():
    print("=== Testing MCP Connection ===\n")
    
    # Initialize MCP handler
    server_command = "python3"
    server_args = [os.path.join(os.path.dirname(__file__), "vinted_server.py")]
    
    mcp = MCPClientHandler(server_command, server_args)
    
    try:
        # Connect
        await mcp.connect()
        
        # List tools
        tools = await mcp.list_tools()
        print(f"\n✅ Successfully loaded {len(tools)} tools:")
        for tool in tools:
            print(f"  - {tool.name}: {tool.description}")
        
        # Test a tool call
        print("\n📞 Testing search_items tool...")
        result = await mcp.call_tool("search_items", {
            "query": "nike shoes",
            "limit": 3
        })
        print(f"✅ Tool call successful!")
        print(f"Result preview: {str(result)[:200]}...")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        await mcp.close()
    
    print("\n=== Test Complete ===")
    return True

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
