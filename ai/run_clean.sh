#!/bin/bash
# Clean demo of the chatbot without verbose logs

echo "Starting Gemini + MCP Chatbot..."
echo ""

# Run with stderr filtered for cleaner output
python3 main.py 2> >(grep -v -E "FutureWarning|DEBUG|INFO|╭|│|╰|FastMCP|Starting MCP|Initializing|Registering|Processing|Dispatching|Response sent|Scheduling|Getting|Starting worker|trace\(|fail\(|sleep\(" >&2)
