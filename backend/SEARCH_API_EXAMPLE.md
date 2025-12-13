# API Search Endpoint - Guide d'utilisation

## Endpoint: `/search`

### Description
Endpoint pour rechercher des items sur Vinted via le LLM + agentique avec enrichissement automatique des résultats.

### Pipeline
1. **STEP 1**: Reçoit le type d'item (t-shirt, shoes, etc.) + contexte utilisateur
2. **STEP 2**: Le LLM construit une query intelligente et appelle SEARCH(query+context)
3. **STEP 3**: Enrichit les résultats avec:
   - Différence de prix (économies vs neuf)
   - Impact écologique (CO2 économisé, équivalent arbres, eau économisée)
4. **STEP 4**: Retourne le JSON enrichi prêt pour affichage en carousel

### Request Format

```json
POST /search
Content-Type: application/json

{
  "item_type": "t-shirt",
  "context": {
    "taille": "M",
    "age": 25,
    "preferences": "vintage, coloré",
    "budget_max": 30
  }
}
```

### Response Format

```json
{
  "chatbot_response": "J'ai trouvé plusieurs t-shirts vintage et colorés en taille M...",
  "query_used": "Je cherche un t-shirt avec les caractéristiques suivantes: taille: M, age: 25...",
  "search_results": [
    {
      "id": "123456",
      "title": "T-shirt vintage Nike",
      "price": {
        "amount": 15.00,
        "currency": "EUR"
      },
      "size": "M",
      "brand": "Nike",
      "photo": "https://...",
      ...
    }
  ],
  "enriched_results": [
    {
      "id": "123456",
      "title": "T-shirt vintage Nike",
      "price": {
        "amount": 15.00,
        "currency": "EUR"
      },
      "size": "M",
      "brand": "Nike",
      "photo": "https://...",
      "enrichment": {
        "price_difference": {
          "original_price": 15.00,
          "estimated_new_price": 37.50,
          "savings": 22.50,
          "savings_percent": 60.0
        },
        "ecological_impact": {
          "co2_saved_kg": 7.0,
          "trees_equivalent": 0.35,
          "water_saved_liters": 1050
        }
      }
    }
  ]
}
```

## Exemples d'utilisation

### Exemple 1: Recherche de t-shirt
```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "item_type": "t-shirt",
    "context": {
      "taille": "M",
      "style": "vintage",
      "couleur": "noir",
      "budget_max": 25
    }
  }'
```

### Exemple 2: Recherche de chaussures
```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "item_type": "shoes",
    "context": {
      "pointure": "42",
      "type": "sneakers",
      "marque": "Nike ou Adidas",
      "budget_max": 80
    }
  }'
```

### Exemple 3: Recherche générique
```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "item_type": "veste",
    "context": {
      "saison": "hiver",
      "taille": "L",
      "matiere": "laine",
      "couleur": "gris ou noir"
    }
  }'
```

## Enrichissement des données

### Prix
- **original_price**: Prix sur Vinted
- **estimated_new_price**: Prix neuf estimé (x2.5)
- **savings**: Économies réalisées
- **savings_percent**: Pourcentage d'économies

### Impact écologique
- **co2_saved_kg**: CO2 économisé en kg (7kg pour t-shirt, 14kg pour chaussures)
- **trees_equivalent**: Équivalent en arbres plantés (1 arbre = 20kg CO2/an)
- **water_saved_liters**: Eau économisée en litres

## Intégration Frontend

### React/React Native Example
```javascript
const searchItems = async (itemType, context) => {
  try {
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_type: itemType,
        context: context
      })
    });
    
    const data = await response.json();
    
    // Utiliser enriched_results pour le carousel
    return data.enriched_results;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Utilisation
const results = await searchItems('t-shirt', {
  taille: 'M',
  style: 'vintage',
  budget_max: 30
});

// Affichage en carousel avec enrichment
results.forEach(item => {
  console.log(`${item.title} - ${item.price.amount}€`);
  console.log(`Économies: ${item.enrichment.price_difference.savings}€`);
  console.log(`CO2 économisé: ${item.enrichment.ecological_impact.co2_saved_kg}kg`);
});
```

## Notes

- Le LLM construit automatiquement une query optimisée basée sur le contexte
- Les résultats sont enrichis automatiquement avec les données économiques et écologiques
- La réponse du chatbot peut être utilisée pour un affichage conversationnel
- Les `enriched_results` sont prêts pour l'affichage en carousel
