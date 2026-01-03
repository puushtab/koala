# Backend Integration Guide

## ✅ Integration Complete!

The frontend is now connected to the backend `/update` endpoint.

## How It Works

### 1. Frontend → Backend Request

When a user searches, the frontend sends:

```javascript
POST http://localhost:8000/update
{
  "category": "t-shirt",    // Mapped from UI categories
  "query": "vintage Nike",   // User's search query
  "context": {
    "style": "vintage secondhand",
    "budget": 100,
    "condition": "good"
  }
}
```

### 2. Backend Response Structure

The backend returns:

```json
{
  "clothes_type": "t-shirt",
  "llm_response": "Here are some vintage Nike t-shirts...",
  "enriched_items": [
    {
      "id": 7755638461,
      "title": "Koszulka Marvel",
      "price": {
        "amount": "12.0",
        "currency_code": "PLN"
      },
      "brand": "Sinsay",
      "size": "L",
      "url": "https://www.vinted.pl/items/...",
      "photo": "https://images1.vinted.net/...",
      "carbon_emission_saved_kg": 7.0,
      "water_saved_liters": 2700,
      "trees_equivalent": 0.35,
      "price_difference": {
        "vinted_price": 12.0,
        "estimated_new_price": 30.0,
        "savings_amount": 18.0,
        "savings_percent": 60.0
      }
    }
  ],
  "raw_mcp_response": { ... },
  "tool_calls": [ ... ]
}
```

### 3. Frontend Data Mapping

The `ItemSearch.js` component maps backend data to frontend format:

```javascript
{
  id: item.id,
  title: item.title,
  price: { amount: "12.0", currency_code: "PLN" },
  brand: item.brand,
  size: item.size,
  url: item.url,
  photo: item.photo,
  price_difference: item.price_difference.savings_amount,  // In EUR
  carbon_impact_kg: item.carbon_emission_saved_kg,
  type: category.id  // 'tops', 'bottoms', 'shoes', etc.
}
```

## Category Mapping

Frontend categories → Backend search terms:

- `tops` → `t-shirt`
- `bottoms` → `pants`
- `shoes` → `shoes`
- `headwear` → `hat`

## Starting the Application

### 1. Start Backend (Terminal 1)
```bash
cd backend
export GEMINI_API_KEY=your_key_here
python api.py
```

Backend runs on: `http://localhost:8000`

### 2. Start Frontend (Terminal 2)
```bash
cd pandaroux_new4
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## Testing

1. Open `http://localhost:3000`
2. Click "Ajouter un vêtement"
3. Select a category (e.g., "Hauts")
4. Search for something (e.g., "vintage Nike t-shirt")
5. The app will call the backend and display real Vinted results!

## API Endpoint

**Endpoint:** `POST http://localhost:8000/update`

**Request Body:**
```typescript
{
  category: string;    // Clothing category
  query: string;       // User search query
  context: {           // Additional search context
    style?: string;
    budget?: number;
    condition?: string;
    [key: string]: any;
  }
}
```

**Response:**
- `clothes_type`: Category searched
- `llm_response`: Conversational AI response
- `enriched_items`: Array of items with price/carbon data
- `vinted_results`: Raw Vinted items
- `raw_mcp_response`: Raw MCP tool response
- `tool_calls`: Debug info about tool calls

## Error Handling

The frontend shows an alert if the backend is not available. Make sure:
1. Backend is running on port 8000
2. CORS is enabled (already configured in `api.py`)
3. MCP server is connected

## Customization

To modify search context, edit `ItemSearch.js`:

```javascript
context: {
  style: 'vintage secondhand',  // Customize search style
  budget: 100,                  // Max price in EUR
  condition: 'good'             // Item condition
}
```
