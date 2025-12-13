#!/usr/bin/env python3
import logging
import warnings
import sys
import os

# Suppress all debug logging from the MCP server
warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.CRITICAL, stream=sys.stderr)

# Disable verbose loggers
for logger_name in ['mcp', 'vinted', 'urllib3', 'docket', 'asyncio', 'fastmcp', 'mcp.server', 'anyio', 'rich']:
    logging.getLogger(logger_name).setLevel(logging.CRITICAL)
    logging.getLogger(logger_name).propagate = False

# Disable FastMCP banner by setting environment variable
os.environ['FASTMCP_QUIET'] = '1'

from fastmcp import FastMCP
from vinted import Vinted
from typing import Optional, List, Dict, Any

# Initialize the FastMCP server (with minimal output)
mcp = FastMCP("Vinted Explorer")

# Initialize the Vinted wrapper
# Note: usage of proxies is recommended for heavy use to avoid rate limiting
vinted = Vinted()

@mcp.tool
def search_items(
    query: str, 
    limit: int = 10, 
    price_to: Optional[float] = None, 
    order: str = "newest_first"
) -> List[Dict[str, Any]]:
    """
    Search for items on Vinted.
    
    Args:
        query: The search keyword (e.g., "vintage nike jacket")
        limit: Number of items to return (default: 10)
        price_to: Maximum price in default currency
        order: Sort order (options: "newest_first", "price_low_to_high", "price_high_to_low")
    """
    try:
        # Build API URL with parameters
        api_url = f"{vinted.api_url}/catalog/items?search_text={query}&per_page={limit}&order={order}"
        
        if price_to:
            api_url += f"&price_to={price_to}"

        # Use scraper to get raw JSON data
        response = vinted.scraper.get(api_url)
        data = response.json()
        
        results = []
        for item in data.get('items', []):
            results.append({
                "id": item.get('id'),
                "title": item.get('title'),
                "price": item.get('price'),
                "currency": item.get('currency'),
                "brand": item.get('brand_title'),
                "size": item.get('size_title'),
                "url": item.get('url'),
                "photo": item.get('photo', {}).get('url') if item.get('photo') else None
            })
            
        return results

    except Exception as e:
        return [{"error": f"Failed to search Vinted: {str(e)}"}]

@mcp.tool
def get_item_details(item_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific Vinted item by its ID.
    
    Args:
        item_id: The unique ID of the item (found in search results)
    """
    try:
        # Use the item_info method to get detailed information
        response = vinted.item_info(item_id)
        
        if isinstance(response, dict) and 'error' in response:
            return {"error": f"Item not found: {response['error']}"}
        
        item = response.get('item', {}) if isinstance(response, dict) else {}
        
        return {
            "id": item.get('id'),
            "title": item.get('title'),
            "description": item.get('description'),
            "price": item.get('price'),
            "brand": item.get('brand_title'),
            "size": item.get('size_title'),
            "status": item.get('status'),
            "url": item.get('url'),
            "photos": [photo.get('url') for photo in item.get('photos', []) if photo.get('url')]
        }

    except Exception as e:
        return {"error": f"Failed to get item details: {str(e)}"}

if __name__ == "__main__":
    # Run the server
    mcp.run()