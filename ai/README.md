# Gemini + MCP Chatbot

A terminal-based chatbot that connects Google's Gemini AI with MCP (Model Context Protocol) tools for searching Vinted.

## Features

- 🤖 Powered by Google Gemini 2.5 Flash
- 🔧 Integrates with MCP tools (Vinted search)
- 💬 Interactive terminal chat interface
- 🛠️ Automatic tool calling when needed

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key:
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Get your Gemini API key:**
   - Go to https://aistudio.google.com/app/apikey
   - Create or copy your API key
   - Add it to the `.env` file

## Usage

### Run the chatbot (recommended - clean output):
```bash
./run_clean.sh
```

### Or run directly:
```bash
python3 main.py
```

### Test MCP connection (without Gemini):
```bash
python3 test_mcp.py
```

### Quick test with sample query:
```bash
python3 test_chatbot.py
```

## Example Interactions

```
You: Find vintage nike jackets on Vinted, limit 3

🛠️  Calling tool: search_items

Gemini: I found a few items:
* kurtka puffer nike vintage czerwona dwustronna (Vintage red reversible Nike puffer jacket)
  - Price: 100.0 PLN
  - Brand: Nike
  - Size: M
  - URL: https://www.vinted.pl/items/7755773398-...

You: Tell me more about item 7755773398
Gemini: [Calls get_item_details tool and shows full details]
```

## Available MCP Tools

- **search_items**: Search for items on Vinted
  - Parameters: query, limit, price_to, order
  
- **get_item_details**: Get detailed information about a specific item
  - Parameters: item_id

## Troubleshooting

If tools aren't loading:
1. Run `python3 test_mcp.py` to test MCP connection
2. Check that vinted_server.py is working
3. Ensure all dependencies are installed

## Project Structure

- `main.py` - Main chatbot entry point
- `gemini_agent.py` - Gemini AI integration
- `mcp_handler.py` - MCP client connection handler
- `vinted_server.py` - MCP server with Vinted tools
- `config.py` - Configuration management
- `test_mcp.py` - MCP connection test script
