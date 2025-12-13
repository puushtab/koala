# PandaRoux 🦊

Assistant IA personnalisé pour l'achat d'habits de seconde main durable.

## 🎯 Objectif

Simplifier l'expérience Vinted et autres plateformes de seconde main en :
- Réduisant le temps de recherche
- Augmentant la pertinence des résultats
- Améliorant la fiabilité des achats
- Sensibilisant à l'impact écologique

## 🚀 Installation

```bash
cd pandaroux
npm install
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
pandaroux/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MainMenu.js          # Menu principal avec garde-robe
│   │   ├── MainMenu.css
│   │   ├── CategorySelection.js # Sélection de catégorie
│   │   ├── CategorySelection.css
│   │   ├── ItemSearch.js        # Recherche avec IA
│   │   └── ItemSearch.css
│   ├── App.js                   # Composant principal avec routing
│   ├── App.css                  # Styles globaux et variables CSS
│   ├── index.js                 # Point d'entrée React
│   └── index.css
├── package.json
└── README.md
```

## 🎨 Design

### Palette de Couleurs
- **Principal**: Orange (#D97142) - Panda roux
- **Secondaire**: Vert forêt (#2C5F4F) - Durable/Écologique
- **Accent**: Or doux (#E8C77A) - Premium/Qualité
- **Fond**: Beige clair (#F7F4EF) - Naturel/Organique

### Typographie
- **Titres**: Crimson Pro (serif élégant)
- **Corps**: DM Sans (sans-serif moderne)

## 🔌 Intégration LLM Backend

### Zone d'intégration

Le fichier `src/components/ItemSearch.js` contient la fonction `handleSearch()` prête pour l'intégration :

```javascript
const handleSearch = async (query) => {
  setIsSearching(true);
  
  // TODO: Intégration LLM ici
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      category: category.id,
    })
  });
  
  const data = await response.json();
  setResults(data.results);
  setIsSearching(false);
};
```

### Format de Données Attendu

**Requête vers le backend LLM :**
```json
{
  "query": "pull en laine beige",
  "category": "tops"
}
```

**Réponse attendue du backend :**
```json
{
  "results": [
    {
      "id": "item_123",
      "title": "Pull en laine beige",
      "price": 25.00,
      "platform": "vinted",
      "image_url": "https://...",
      "seller": {
        "name": "Marie",
        "rating": 4.8,
        "trusted": true
      },
      "location": "Paris",
      "distance_km": 5.2,
      "condition": "Très bon état",
      "eco_score": 85,
      "savings": {
        "money": 50.00,
        "co2_kg": 2.3
      }
    }
  ],
  "total": 45,
  "search_time_ms": 1234
}
```

## ✨ Features à Implémenter

### Phase 1 - MVP (Actuel)
- [x] Navigation principale (Menu → Catégorie → Recherche)
- [x] Interface de recherche avec barre IA
- [x] Design responsive et animations
- [ ] Intégration backend LLM
- [ ] Affichage des résultats

### Phase 2 - Core Features
- [ ] Système conversationnel avec IA
- [ ] Ajout photo outfit actuel
- [ ] Gestion garde-robe personnelle
- [ ] Filtres avancés (géo, vendeur, prix)
- [ ] Métriques d'économie (argent + CO2)

### Phase 3 - Advanced
- [ ] Suggestion d'outfits cohérents
- [ ] Traduction multilingue
- [ ] Intégration ClearFashion / Labels éco
- [ ] Deal automatique -5%
- [ ] Historique et favoris

## 🎯 Partenaires Cibles

**Premier temps :**
- Vinted (prioritaire)

**Long terme :**
- Leboncoin
- Depop
- Vestiaire Collective
- Label Emmaüs
- Friperies locales

## 💰 Modèle Économique

- **Freemium** : Version gratuite avec publicité
- **Premium** : Abonnement mensuel
  - Recherches illimitées
  - Filtres avancés
  - Alertes personnalisées
  - Sans publicité

## 🌍 Impact

### Bénéfices Environnementaux
- Hausse de la consommation de seconde main
- Éducation sur le coût d'opportunité environnemental
- Réduction des déchets textiles

### Bénéfices Sociaux
- Démocratisation de la mode durable
- Transparence sur l'impact des achats
- Meilleure expérience utilisateur

## 📊 Coûts Estimés (par 1000 users/mois)

- Appels LLM agentiques : ~100€
- Serveur web (app + site) : ~500€ max
- API partenaires : ~20€
- Marketing : variable

## 🛠️ Technologies

- **Frontend**: React 18
- **Styling**: CSS personnalisé avec variables
- **Icons**: Lucide React
- **Backend LLM**: À intégrer (placeholder prêt)

## 👥 Équipe

**Groupe 2**
- Frontend/Backend : Votre équipe
- LLM Integration : Collègue (zone d'intégration prête)

## 📝 Notes pour les Développeurs

1. Les styles utilisent des variables CSS (voir `App.css`)
2. Animations intégrées avec `animation-delay` pour effets séquentiels
3. Responsive mobile-first
4. Code commenté pour faciliter l'intégration LLM
5. Structure modulaire et extensible

---

**Version**: 0.1.0  
**Nom de code**: PandaRoux 🦊  
**Statut**: MVP en développement
