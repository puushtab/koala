#!/bin/bash
# Quick setup script for the Gemini + MCP chatbot

echo "=== Gemini + MCP Chatbot Setup ==="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
    if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
        echo "⚠️  Warning: .env file still contains placeholder API key"
        echo "   Please edit .env and add your actual Gemini API key"
    else
        echo "✅ API key appears to be configured"
    fi
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Gemini API key!"
    echo "   Get your key from: https://aistudio.google.com/app/apikey"
fi

echo ""
echo "=== Testing MCP Connection ==="
python3 test_mcp.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete! MCP tools are working."
    echo ""
    echo "To start the chatbot, run:"
    echo "  python3 main.py"
    echo ""
    echo "Don't forget to add your Gemini API key to .env first!"
else
    echo ""
    echo "❌ MCP connection test failed"
    echo "Please check the error messages above"
    exit 1
fi
