import asyncio
from typing import List, Any, Dict, Optional
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool as MCPTool, CallToolResult

class MCPClientHandler:
    def __init__(self, command: str, args: List[str]):
        self.server_params = StdioServerParameters(
            command=command,
            args=args,
            env=None
        )
        self.session: Optional[ClientSession] = None
        self._exit_stack: Optional[AsyncExitStack] = None
        self._read = None
        self._write = None

    async def connect(self):
        """Establishes connection to the MCP server via stdio."""
        print(f"🔌 Connecting to MCP Server...")
        
        try:
            # Use AsyncExitStack to properly manage the context
            self._exit_stack = AsyncExitStack()
            
            # stdio_client returns an async context manager, so we need to enter it
            stdio_transport = stdio_client(self.server_params)
            self._read, self._write = await self._exit_stack.enter_async_context(stdio_transport)
            
            self.session = ClientSession(self._read, self._write)
            await self._exit_stack.enter_async_context(self.session)
            
            await self.session.initialize()
            print("✅ Connected to MCP Server")
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            import traceback
            traceback.print_exc()
            raise

    async def list_tools(self) -> List[MCPTool]:
        """Fetches available tools from the connected MCP server."""
        if not self.session:
            return []
        result = await self.session.list_tools()
        return result.tools

    async def call_tool(self, name: str, arguments: dict) -> Any:
        """Executes a tool on the MCP server."""
        if not self.session:
            raise ConnectionError("MCP Session not active.")
        
        print(f"🛠️  Calling MCP Tool: {name} with {arguments}")
        result: CallToolResult = await self.session.call_tool(name, arguments)
        
        # Simplify the result for the LLM
        return result.content

    async def close(self):
        """Clean up connections."""
        if self._exit_stack:
            await self._exit_stack.__aexit__(None, None, None)
            self._exit_stack = None
        self.session = None
        print("🔌 MCP Connection closed.")