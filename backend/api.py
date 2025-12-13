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

# Memory storage for last search
last_search_result: Optional[dict] = None

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    tools_used: list[str] = []

class SearchRequest(BaseModel):
    item_type: str  # e.g., "t-shirt", "shoes", "autre"
    context: dict  # e.g., {"taille": "M", "age": 25, "preferences": "vintage, coloré"}

class SearchResponse(BaseModel):
    chatbot_response: str  # Réponse conversationnelle du chatbot
    search_results: list  # Résultats bruts de la recherche Vinted
    enriched_results: list  # Résultats enrichis (avec diff prix, diff écologique, etc.)
    query_used: str  # La query générée par le LLM

class UpdateRequest(BaseModel):
    category: str  # Category of clothing (e.g., "t-shirt", "shoes", "jacket")
    query: str  # User's search query or description
    context: dict  # User context (e.g., {"taille": "M", "budget": 50, "style": "vintage"})

class UpdateResponse(BaseModel):
    clothes_type: str  # Type of clothes being searched
    vinted_results: list  # Raw results from Vinted search tool
    enriched_items: list  # Items with carbon emission and price difference data
    llm_response: str  # The LLM's conversational response
    raw_mcp_response: Optional[dict] = None  # Raw JSON response from MCP tool
    tool_calls: list = []  # All tool calls made during the search
    
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
            "search": "/search (POST) - Recherche intelligente avec contexte",
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

@app.post("/search", response_model=SearchResponse)
async def search_items(request: SearchRequest):
    """
    Endpoint pour rechercher des items via le LLM + agentique.
    
    STEP 1: Reçoit le type d'item (t-shirt, shoes, etc.) + contexte
    STEP 2: Construit une query intelligente avec le LLM et appelle SEARCH(query+context)
    STEP 3: Enrichit les résultats (diff prix, diff écologique)
    STEP 4: Retourne le JSON enrichi prêt pour le carousel
    
    Args:
        request: SearchRequest contenant item_type et context
        
    Returns:
        SearchResponse avec chatbot_response, search_results, enriched_results, query_used
    """
    if not gemini_agent:
        raise HTTPException(status_code=503, detail="Gemini agent not initialized")
    
    if not mcp_client:
        raise HTTPException(status_code=503, detail="MCP client not connected")
    
    try:
        # Construire le prompt pour le LLM avec le contexte
        context_str = ", ".join([f"{k}: {v}" for k, v in request.context.items()])
        user_prompt = f"""Je cherche un {request.item_type} avec les caractéristiques suivantes: {context_str}.
        
Peux-tu rechercher des articles correspondants sur Vinted et me donner les résultats ?"""
        
        # Créer une nouvelle session pour cette recherche
        temp_agent = GeminiAgent()
        temp_agent.start_chat(mcp_tools=mcp_tools)
        
        # Envoyer la requête au LLM qui va utiliser les outils MCP et récupérer les résultats
        chatbot_response, tool_results = await temp_agent.send_message(
            user_prompt, 
            mcp_client=mcp_client,
            return_tool_results=True
        )
        
        # Extraire les résultats de recherche depuis les tool calls
        search_results = []
        for tool_result in tool_results:
            if tool_result["tool_name"] == "mcp_mcp-vinted_search_items":
                # Parser les résultats de recherche
                import json
                result_content = tool_result["result"]
                # Les résultats sont dans le format MCP content
                if result_content:
                    for content_item in result_content:
                        if hasattr(content_item, 'text'):
                            try:
                                data = json.loads(content_item.text)
                                if "items" in data:
                                    search_results.extend(data["items"])
                            except:
                                pass
        
        # Enrichir les résultats avec diff de prix et diff écologique
        enriched_results = []
        for item in search_results:
            # Calculer la différence de prix (vs prix neuf estimé)
            # Pour l'instant, estimation simple: prix neuf = prix Vinted * 2.5
            current_price = float(item.get("price", {}).get("amount", 0))
            estimated_new_price = current_price * 2.5
            price_saving = estimated_new_price - current_price
            price_saving_percent = (price_saving / estimated_new_price * 100) if estimated_new_price > 0 else 0
            
            # Estimation de l'impact écologique (CO2 économisé)
            # Estimation: un t-shirt neuf = ~7kg CO2, shoes = ~14kg CO2
            co2_saved = 0
            if "shirt" in request.item_type.lower() or "t-shirt" in request.item_type.lower():
                co2_saved = 7.0
            elif "shoe" in request.item_type.lower() or "chaussure" in request.item_type.lower():
                co2_saved = 14.0
            else:
                co2_saved = 5.0  # valeur par défaut
            
            enriched_item = {
                **item,
                "enrichment": {
                    "price_difference": {
                        "original_price": current_price,
                        "estimated_new_price": round(estimated_new_price, 2),
                        "savings": round(price_saving, 2),
                        "savings_percent": round(price_saving_percent, 1)
                    },
                    "ecological_impact": {
                        "co2_saved_kg": co2_saved,
                        "trees_equivalent": round(co2_saved / 20, 2),  # 1 arbre absorbe ~20kg CO2/an
                        "water_saved_liters": round(co2_saved * 150, 0)  # estimation
                    }
                }
            }
            enriched_results.append(enriched_item)
        
        return SearchResponse(
            chatbot_response=chatbot_response,
            search_results=search_results,
            enriched_results=enriched_results,
            query_used=user_prompt
        )
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")

@app.post("/update", response_model=UpdateResponse)
async def update_search(request: UpdateRequest):
    """
    Intelligent search endpoint that:
    1. Takes category, user query, and context
    2. Uses LLM to call Vinted search with optimal parameters
    3. Returns enriched results with carbon emissions and price differences
    4. Stores the result in memory
    
    Args:
        request: UpdateRequest with category, query, and context
        
    Returns:
        UpdateResponse with clothes_type, vinted_results, enriched_items, and llm_response
    """
    global last_search_result
    
    if not gemini_agent:
        raise HTTPException(status_code=503, detail="Gemini agent not initialized")
    
    if not mcp_client:
        raise HTTPException(status_code=503, detail="MCP client not connected")
    
    try:
        # Build the prompt for the LLM
        context_str = ", ".join([f"{k}: {v}" for k, v in request.context.items()])
        user_prompt = f"""I'm looking for {request.category} items. 
User query: {request.query}
Context: {context_str}

Please search for matching items on Vinted and provide me with the results."""
        
        # Create a fresh agent for this search
        temp_agent = GeminiAgent()
        temp_agent.start_chat(mcp_tools=mcp_tools)
        
        # Send the query to LLM which will use MCP tools and capture results
        llm_response, tool_results = await temp_agent.send_message(
            user_prompt, 
            mcp_client=mcp_client,
            return_tool_results=True
        )
        
        # Debug: Print tool results structure
        print(f"\n🔍 DEBUG: Got {len(tool_results)} tool results")
        for idx, tr in enumerate(tool_results):
            print(f"Tool {idx}: {tr.get('tool_name', 'unknown')}")
            print(f"  Arguments: {tr.get('arguments', {})}")
            print(f"  Result type: {type(tr.get('result'))}")
        
        # Extract search results from tool calls
        import json
        vinted_results = []
        raw_mcp_response = None  # Store the raw MCP JSON
        
        for tool_result in tool_results:
            if "search_items" in tool_result["tool_name"]:  # Match any search tool
                # Parse the search results
                result_content = tool_result["result"]
                print(f"\n🔍 Processing tool result, type: {type(result_content)}")
                
                if result_content:
                    # Handle list of content items
                    if isinstance(result_content, list):
                        for content_item in result_content:
                            # Check if it's a dict with 'text' key
                            if isinstance(content_item, dict) and 'text' in content_item:
                                try:
                                    # Parse the JSON string
                                    data = json.loads(content_item['text'])
                                    vinted_results = data  # This is already the array of items
                                    # Wrap in a dict structure for the response model
                                    raw_mcp_response = {
                                        "items": data,
                                        "count": len(data) if isinstance(data, list) else 0,
                                        "query": tool_result.get("arguments", {}).get("query", "")
                                    }
                                    print(f"✅ Parsed {len(data)} items from MCP response")
                                except Exception as e:
                                    print(f"❌ Error parsing MCP result: {e}")
                                    print(f"Content: {content_item.get('text', '')[:200]}")
                            # Handle object with text attribute
                            elif hasattr(content_item, 'text'):
                                try:
                                    data = json.loads(content_item.text)
                                    vinted_results = data
                                    raw_mcp_response = {
                                        "items": data,
                                        "count": len(data) if isinstance(data, list) else 0,
                                        "query": tool_result.get("arguments", {}).get("query", "")
                                    }
                                    print(f"✅ Parsed {len(data)} items from MCP response (attr)")
                                except Exception as e:
                                    print(f"❌ Error parsing MCP result (attr): {e}")
        
        # Enrich results with price difference and carbon emission data
        enriched_items = []
        
        # Ensure vinted_results is a list
        if not isinstance(vinted_results, list):
            print(f"⚠️ vinted_results is not a list, it's: {type(vinted_results)}")
            vinted_results = []
        
        print(f"📊 Enriching {len(vinted_results)} items...")
        
        for item in vinted_results:
            # Calculate price difference (vs estimated new price)
            # Simple estimation: new price = Vinted price * 2.5
            price_obj = item.get("price", {})
            price_amount = price_obj.get("amount", 0)
            # Handle both string and float prices
            current_price = float(price_amount) if price_amount else 0.0
            estimated_new_price = current_price * 2.5
            price_saving = estimated_new_price - current_price
            price_saving_percent = (price_saving / estimated_new_price * 100) if estimated_new_price > 0 else 0
            
            # Estimate carbon emission savings (fake but realistic)
            # Based on category of clothing
            co2_saved_kg = 0
            water_saved_liters = 0
            
            category_lower = request.category.lower()
            if "shirt" in category_lower or "t-shirt" in category_lower or "blouse" in category_lower:
                co2_saved_kg = 7.0  # A new t-shirt generates ~7kg CO2
                water_saved_liters = 2700  # ~2700 liters for a cotton t-shirt
            elif "jean" in category_lower or "pant" in category_lower:
                co2_saved_kg = 33.4  # Jeans are very carbon-intensive
                water_saved_liters = 10000  # ~10000 liters for jeans
            elif "shoe" in category_lower or "boot" in category_lower or "sneaker" in category_lower:
                co2_saved_kg = 14.0
                water_saved_liters = 8000
            elif "jacket" in category_lower or "coat" in category_lower:
                co2_saved_kg = 20.0
                water_saved_liters = 5000
            elif "dress" in category_lower:
                co2_saved_kg = 11.0
                water_saved_liters = 4000
            else:
                co2_saved_kg = 8.0  # Default value
                water_saved_liters = 3000
            
            enriched_item = {
                **item,
                "carbon_emission_saved_kg": round(co2_saved_kg, 2),
                "water_saved_liters": int(water_saved_liters),
                "trees_equivalent": round(co2_saved_kg / 20, 2),  # 1 tree absorbs ~20kg CO2/year
                "price_difference": {
                    "vinted_price": round(current_price, 2),
                    "estimated_new_price": round(estimated_new_price, 2),
                    "savings_amount": round(price_saving, 2),
                    "savings_percent": round(price_saving_percent, 1)
                }
            }
            enriched_items.append(enriched_item)
        
        # Build the response with raw MCP data
        response_data = {
            "clothes_type": request.category,
            "vinted_results": vinted_results,
            "enriched_items": enriched_items,
            "llm_response": llm_response,
            "raw_mcp_response": raw_mcp_response,  # Include raw MCP JSON
            "tool_calls": tool_results  # Include all tool call details
        }
        
        # Store in memory
        last_search_result = response_data
        
        return UpdateResponse(**response_data)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing update: {str(e)}")

@app.get("/last-search")
async def get_last_search():
    """
    Retrieve the last search result from memory.
    
    Returns:
        The last search result or a message if no search has been performed yet.
    """
    if last_search_result is None:
        return {"message": "No search has been performed yet", "data": None}
    
    return {"message": "Last search result", "data": last_search_result}

# Run with: uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
