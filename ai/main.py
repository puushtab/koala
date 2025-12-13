import asyncio
import sys
from config import Config
from mcp_handler import MCPClientHandler
from gemini_agent import GeminiAgent

async def main():
    # Suppress ALL debug logs before anything else
    import logging
    import warnings
    
    # Suppress warnings
    warnings.filterwarnings("ignore")
    
    # Set logging levels to suppress debug output
    logging.basicConfig(level=logging.ERROR)
    for logger_name in ['mcp', 'vinted', 'urllib3', 'docket', 'asyncio', 'fastmcp', 'mcp.server', 'mcp.client']:
        logging.getLogger(logger_name).setLevel(logging.ERROR)
        logging.getLogger(logger_name).propagate = False
    
    print("--- Gemini + MCP Terminal Chatbot ---")
    
    # 1. Initialize MCP (Basic Block)
    # We wrap this in try-except so the bot works even if you don't have a server running yet.
    mcp = MCPClientHandler(Config.MCP_SERVER_COMMAND, Config.MCP_SERVER_ARGS)
    mcp_tools = []
    
    try:
        await mcp.connect() 
        mcp_tools = await mcp.list_tools()
        print(f"✅ Loaded {len(mcp_tools)} MCP tools")
    except Exception as e:
        print(f"⚠️  MCP Server warning (skipping tools): {e}")

    # 2. Initialize Gemini
    agent = GeminiAgent()
    agent.start_chat(mcp_tools=mcp_tools)

    print(f"Bot ready. (Connected to {len(mcp_tools)} tools). Type 'exit' to quit.\n")

    # 3. Main Event Loop
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                break
            
            # Send to agent (asynchronous call)
            print("Gemini: ...", end="\r")
            response = await agent.send_message(user_input, mcp_client=mcp)
            
            # Clear waiting line and print response
            print(f"Gemini: {response}")

        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")

    # Cleanup
    await mcp.close()
    print("\nGoodbye.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())