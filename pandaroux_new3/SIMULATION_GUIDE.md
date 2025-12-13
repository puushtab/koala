# Guide de Simulation - PandaRoux

## 🎬 Fonctionnalités Implémentées

### ✅ Ce qui fonctionne maintenant :

1. **Données Mockées** : Simulation avec 10 articles réels de Vinted
2. **Affichage des Résultats** : Grille de cartes avec photos, prix, économies et CO₂
3. **Vue Détaillée** : Clic sur un article pour voir tous les détails
4. **Garde-Robe Intelligente** : 
   - Ajout d'articles à la garde-robe
   - Organisation par type de vêtement (position sur le corps)
   - Suppression d'articles
5. **4 Catégories Simplifiées** : Hauts, Bas, Chaussures, Couvre-chef

## 📂 Structure des Données

Chaque article contient maintenant un champ `type` :

```javascript
{
  "id": 7755500303,
  "title": "Tricou Avengers mărimea M",
  "price": {
    "amount": "25.22",
    "currency_code": "PLN"
  },
  "brand": "Avengers",
  "size": "M",
  "url": "https://...",
  "photo": "https://...",
  "price_difference": 15.50,      // Économie vs neuf
  "carbon_impact_kg": 2.3,        // Impact CO₂ évité
  "type": "tops"                   // ⭐ NOUVEAU : Catégorie
}
```

### Types Possibles :
- `"tops"` : Hauts (t-shirts, pulls, chemises)
- `"bottoms"` : Bas (pantalons, jeans, shorts)
- `"shoes"` : Chaussures
- `"headwear"` : Couvre-chef (chapeaux, casquettes)

## 🔄 Passer des Données Mockées à l'API LLM

### Étape 1 : Localiser le Code Mock

Fichier : `src/components/ItemSearch.js`

```javascript
// DONNÉES MOCKÉES - À REMPLACER PAR L'API LLM
const mockData = [
  {
    id: 7755500303,
    title: "Tricou Avengers mărimea M",
    // ... reste des données
  },
  // ... autres articles
];
```

### Étape 2 : Remplacer la Fonction de Recherche

**Code Actuel (Simulation) :**
```javascript
const handleSearch = async (query) => {
  if (!query.trim()) return;
  setIsSearching(true);
  
  // SIMULATION
  setTimeout(() => {
    const filteredResults = mockData.filter(item => 
      item.type === category.id
    );
    setResults(filteredResults);
    setIsSearching(false);
  }, 1000);
};
```

**Code à Utiliser (API LLM) :**
```javascript
const handleSearch = async (query) => {
  if (!query.trim()) return;
  setIsSearching(true);
  
  try {
    const response = await fetch('VOTRE_ENDPOINT_API', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN' // Si nécessaire
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
    setResults(data); // data doit être un array
    
  } catch (error) {
    console.error('Erreur de recherche:', error);
    // Optionnel : afficher un message d'erreur à l'utilisateur
  } finally {
    setIsSearching(false);
  }
};
```

### Étape 3 : Configuration de l'API

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://localhost:8000
# ou votre URL de production
```

## 🎨 Organisation de la Garde-Robe

Les articles dans la garde-robe sont automatiquement organisés par position sur le corps :

```
┌─────────────────────────────┐
│   🎩 Couvre-chef            │
│   [items headwear]          │
├─────────────────────────────┤
│   👕 Hauts                  │
│   [items tops]              │
├─────────────────────────────┤
│   👖 Bas                    │
│   [items bottoms]           │
├─────────────────────────────┤
│   👟 Chaussures             │
│   [items shoes]             │
└─────────────────────────────┘
```

Chaque section :
- Affiche les items du bon type
- Montre une icône si vide
- Permet de supprimer les items au survol

## 🧪 Tester la Simulation

### 1. Lancer l'Application

```bash
cd pandaroux
npm install
npm start
```

### 2. Scénario de Test

1. **Page d'accueil** : Garde-robe vide
2. **Clic sur [+]** : Voir les 4 catégories
3. **Choisir "Hauts"** : Accéder à la recherche
4. **Taper "avengers"** : Lancer la recherche
5. **Attendre 1 seconde** : 10 résultats s'affichent
6. **Clic sur une carte** : Voir les détails
7. **Ajouter à la garde-robe** : L'article est ajouté
8. **Retour à l'accueil** : Voir l'article dans la section "Hauts"
9. **Survol + clic [X]** : Retirer l'article

## 📊 Flux de Données

```
User Input (query)
      ↓
handleSearch()
      ↓
[MOCK DATA] ← À REMPLACER PAR → [API LLM]
      ↓                              ↓
Filter by category              Process with AI
      ↓                              ↓
      ↓                         Add type field
      ↓                              ↓
      └──────────── Array ──────────┘
                     ↓
              setResults(data)
                     ↓
            ResultCard components
                     ↓
              onClick → ItemDetails
                     ↓
          onAddToWardrobe → MainMenu
```

## 🔑 Points Clés pour l'Intégration LLM

### Ce que le Backend LLM DOIT faire :

1. **Recevoir** : `query` et `category`
2. **Rechercher** : Sur Vinted/Leboncoin selon la requête
3. **Analyser** : Pertinence des résultats avec l'IA
4. **Enrichir** : Ajouter `price_difference` et `carbon_impact_kg`
5. **Catégoriser** : Ajouter le champ `type` (tops/bottoms/shoes/headwear)
6. **Retourner** : Array JSON directement

### Format de Réponse Requis :

```json
[
  {
    "id": number,
    "title": string,
    "price": { "amount": string, "currency_code": string },
    "brand": string,
    "size": string,
    "url": string,
    "photo": string,
    "type": "tops" | "bottoms" | "shoes" | "headwear",
    "price_difference": number,    // Optionnel
    "carbon_impact_kg": number     // Optionnel
  }
]
```

## 🎯 Exemple de Mapping Type

Le backend LLM peut déterminer le `type` selon :

```python
def determine_type(item_title, item_category):
    # Mots-clés pour classification
    keywords = {
        'tops': ['shirt', 't-shirt', 'pull', 'chemise', 'blouse'],
        'bottoms': ['jean', 'pantalon', 'short', 'jupe'],
        'shoes': ['chaussure', 'basket', 'botte', 'sandale'],
        'headwear': ['chapeau', 'casquette', 'bonnet', 'béret']
    }
    
    # Analyse du titre
    title_lower = item_title.lower()
    for type_name, words in keywords.items():
        if any(word in title_lower for word in words):
            return type_name
    
    # Fallback sur la catégorie fournie
    return item_category
```

## 📝 Checklist Migration

- [ ] Supprimer ou commenter `mockData` dans ItemSearch.js
- [ ] Configurer l'URL de l'API dans `.env`
- [ ] Implémenter l'appel API dans `handleSearch()`
- [ ] S'assurer que le backend ajoute le champ `type`
- [ ] Tester avec quelques requêtes
- [ ] Gérer les cas d'erreur
- [ ] Ajouter un loading state si nécessaire
- [ ] Implémenter la pagination si beaucoup de résultats

## 🐛 Debug

Pour voir les données qui transitent :

```javascript
const handleSearch = async (query) => {
  console.log('🔍 Recherche:', { query, category: category.id });
  // ... votre code
  console.log('✅ Résultats reçus:', data);
  console.log('📊 Nombre:', data.length);
  if (data.length > 0) {
    console.log('🔎 Premier item:', data[0]);
    console.log('📂 Type du premier item:', data[0].type);
  }
  setResults(data);
};
```

## 💡 Améliorations Futures

- [ ] Pagination des résultats
- [ ] Filtres avancés (prix, taille, distance)
- [ ] Recherche conversationnelle avec l'IA
- [ ] Suggestions d'outfits complets
- [ ] Historique de recherche
- [ ] Favoris / Wishlist
- [ ] Notifications pour nouvelles offres

---

**Prêt à passer à l'API LLM ?** Suivez les étapes ci-dessus et remplacez progressivement le code mock ! 🚀
