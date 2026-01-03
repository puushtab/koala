# Guide d'Intégration LLM pour PandaRoux

## 📍 Zone d'Intégration

Le fichier principal à modifier : `src/components/ItemSearch.js`

## 🎯 Fonction à Compléter

```javascript
const handleSearch = async (query) => {
  if (!query.trim()) return;
  
  setIsSearching(true);
  
  try {
    // ========== VOTRE CODE ICI ==========
    
    // 1. Appeler votre backend LLM
    const response = await fetch('VOTRE_ENDPOINT_API', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Ajoutez vos headers d'authentification si nécessaire
        // 'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify({
        query: query,
        category: category.id,
      })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche');
    }
    
    const data = await response.json();
    
    // 2. Le backend doit retourner un array directement
    setResults(data); // data est déjà un array
    
    // ====================================
    
  } catch (error) {
    console.error('Erreur de recherche:', error);
    // Gérer l'erreur (afficher un message à l'utilisateur)
  } finally {
    setIsSearching(false);
  }
};
```

## 📥 Données Envoyées au Backend

```javascript
{
  "query": string,      // Ex: "pull en laine beige"
  "category": string    // Ex: "tops", "bottoms", "shoes", etc.
}
```

### Catégories Disponibles

```javascript
const categories = [
  'tops',         // Hauts
  'bottoms',      // Bas
  'shoes',        // Chaussures
  'accessories',  // Accessoires
  'outerwear',    // Vestes
  'eyewear',      // Lunettes
  'jewelry',      // Bijoux
  'bags'          // Sacs
];
```

## 📤 Format de Réponse Attendu

Le backend doit retourner un **array JSON** directement (pas d'objet wrapper) :

```json
[
  {
    "id": 7755500303,
    "title": "Tricou Avengers mărimea M",
    "price": {
      "amount": "25.22",
      "currency_code": "PLN"
    },
    "brand": "Avengers",
    "size": "M",
    "url": "https://www.vinted.pl/items/7755500303-tricou-avengers-marimea-m",
    "photo": "https://images1.vinted.net/t/02_015aa_MZGuEuST6RVsGw67u7KmqmBq/f800/1765631219.jpeg?s=...",
    
    "price_difference": 15.50,
    "carbon_impact_kg": 2.3
  },
  {
    "id": 7755022824,
    "title": "Koszulka / T-shirt Marvel Avengers XL",
    "price": {
      "amount": "39.0",
      "currency_code": "PLN"
    },
    "brand": "Avengers",
    "size": "XL / 42 / 14",
    "url": "https://www.vinted.pl/items/7755022824-koszulka-t-shirt-marvel-avengers-xl",
    "photo": "https://images1.vinted.net/t/05_00514_sKoyhZR2tKPbkza4e6rtoDcu/f800/1765627572.jpeg?s=...",
    "price_difference": 22.00,
    "carbon_impact_kg": 3.1
  }
]
```

### Champs Obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `id` | number | Identifiant unique de l'article |
| `title` | string | Titre de l'article |
| `price.amount` | string | Prix de l'article |
| `price.currency_code` | string | Code devise (PLN, EUR, etc.) |
| `url` | string | Lien vers l'article sur la plateforme |
| `photo` | string | URL de l'image principale |

### Champs Optionnels (mais Recommandés)

| Champ | Type | Description |
|-------|------|-------------|
| `brand` | string | Marque de l'article |
| `size` | string | Taille de l'article |
| `price_difference` | number | **Économie en € par rapport au neuf** |
| `carbon_impact_kg` | number | **Impact carbone évité en kg de CO₂** |

## 🎨 Affichage des Résultats

Les résultats sont automatiquement affichés via le composant `ResultCard` qui gère :

- **Image** : Affichée avec effet hover
- **Badge d'économie** : Si `price_difference` est présent
- **Prix** : Converti en EUR (conversion PLN→EUR par défaut)
- **Marque & Taille** : Affichées si disponibles
- **Impact écologique** : Badge vert avec CO₂ si `carbon_impact_kg` présent
- **Lien externe** : Vers la page de l'article

## 🔧 Configuration API

### Créer `src/services/api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const searchItems = async (query, category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Retourne directement l'array
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Créer `.env` à la racine du projet

```env
REACT_APP_API_URL=http://localhost:8000
```

### Utiliser dans `ItemSearch.js`

```javascript
import { searchItems } from '../services/api';

const handleSearch = async (query) => {
  if (!query.trim()) return;
  
  setIsSearching(true);
  
  try {
    const results = await searchItems(query, category.id);
    setResults(results);
  } catch (error) {
    console.error('Search error:', error);
    // Afficher un message d'erreur à l'utilisateur
  } finally {
    setIsSearching(false);
  }
};
```

## 🧪 Tests avec Données Mock

### Exemple de données pour tester sans backend

```javascript
const mockResults = [
  {
    id: 7755500303,
    title: "Tricou Avengers mărimea M",
    price: {
      amount: "25.22",
      currency_code: "PLN"
    },
    brand: "Avengers",
    size: "M",
    url: "https://www.vinted.pl/items/7755500303-tricou-avengers-marimea-m",
    photo: "https://images1.vinted.net/t/02_015aa_MZGuEuST6RVsGw67u7KmqmBq/f800/1765631219.jpeg?s=0b62c481c0d2580974c127c04cc755b2101bd233",
    price_difference: 15.50,
    carbon_impact_kg: 2.3
  },
  {
    id: 7755022824,
    title: "Koszulka / T-shirt Marvel Avengers XL | Oversize Bawełna",
    price: {
      amount: "39.0",
      currency_code: "PLN"
    },
    brand: "Avengers",
    size: "XL / 42 / 14",
    url: "https://www.vinted.pl/items/7755022824-koszulka-t-shirt-marvel-avengers-xl",
    photo: "https://images1.vinted.net/t/05_00514_sKoyhZR2tKPbkza4e6rtoDcu/f800/1765627572.jpeg?s=31ff85dc6694976dd45543428953c012b364a736",
    price_difference: 22.00,
    carbon_impact_kg: 3.1
  }
];

// Pour tester, dans handleSearch :
setTimeout(() => {
  setResults(mockResults);
  setIsSearching(false);
}, 1500);
```

## 💡 Traitement Backend Attendu

Le backend LLM doit :

1. **Recevoir** : query + category
2. **Rechercher** : Sur Vinted, Leboncoin, etc.
3. **Filtrer** : Selon la pertinence avec le query
4. **Enrichir** : Ajouter `price_difference` et `carbon_impact_kg`
5. **Retourner** : Array JSON avec les articles filtrés

### Calcul des Champs Additionnels

```python
# Exemple de calcul côté backend

# Prix différence (économie vs neuf)
price_difference = prix_neuf_estimé - prix_vinted

# Impact carbone évité
# Basé sur des données moyennes de l'industrie textile
carbon_impact_kg = poids_article_kg * 20  # ~20kg CO₂ par kg de textile neuf
```

## 🚀 Checklist d'Intégration

- [ ] Configurer l'endpoint API dans `.env`
- [ ] Créer le service API dans `src/services/api.js`
- [ ] Modifier `handleSearch()` dans `ItemSearch.js`
- [ ] Tester avec données mockées
- [ ] S'assurer que le backend retourne un array (pas un objet avec "results")
- [ ] Vérifier que `id` est un number, pas une string
- [ ] Ajouter `price_difference` et `carbon_impact_kg` dans la réponse
- [ ] Tester avec API réelle
- [ ] Gérer les cas d'erreur
- [ ] Optimiser le chargement des images (lazy loading déjà implémenté)

## 🐛 Debugging

```javascript
const handleSearch = async (query) => {
  console.log('🔍 Recherche:', { query, category: category.id });
  
  setIsSearching(true);
  
  try {
    const results = await searchItems(query, category.id);
    console.log('✅ Résultats:', results);
    console.log('📊 Nombre:', results.length);
    
    // Vérifier la structure
    if (results.length > 0) {
      console.log('🔎 Premier item:', results[0]);
    }
    
    setResults(results);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    setIsSearching(false);
  }
};
```

## 📚 Ressources

- Documentation React: https://react.dev
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- Vinted API (si disponible): Documentation à consulter

## ⚠️ Points d'Attention

1. **Type de `id`** : Doit être un `number`, pas une string
2. **Structure price** : Objet avec `amount` (string) et `currency_code`
3. **Array direct** : Pas d'objet wrapper avec "results"
4. **Images** : URLs complètes et accessibles publiquement
5. **Conversion devise** : Le frontend fait une conversion approximative PLN→EUR

---

**Questions?** Consultez le README principal ou contactez l'équipe frontend.
