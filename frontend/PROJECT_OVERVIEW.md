# 🦊 PandaRoux - Vue d'Ensemble du Projet

## 📱 Navigation de l'Application

```
┌─────────────────────────────────────┐
│     MENU PRINCIPAL (MainMenu)       │
│  🦊 PandaRoux                        │
│  ├─ Stats (Économies / CO₂)         │
│  ├─ Ma Garde-Robe                   │
│  └─ Bouton [+] Flottant             │
│                                      │
│         [Clic sur +]                 │
│              ↓                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SÉLECTION CATÉGORIE (CategorySel)  │
│  ← Retour                            │
│  Choisir une catégorie               │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │👕 │ │👖 │ │👟 │ │⌚ │       │
│  │Haut│ │ Bas│ │Chaus│ │Accs│       │
│  └────┘ └────┘ └────┘ └────┘       │
│                                      │
│     [Clic sur une catégorie]         │
│              ↓                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    RECHERCHE (ItemSearch)            │
│  ← Retour    [Catégorie]             │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ 🔍 Rechercher...              │  │
│  └───────────────────────────────┘  │
│  [✨ Rechercher avec l'IA]           │
│                                      │
│  Suggestions: [Pull] [Jean] [Veste] │
│  Filtres: [📍 Proche] [🛡️ Fiable]   │
│                                      │
│  💡 Zone d'intégration LLM           │
│     (handleSearch function)          │
│                                      │
│  [Résultats affichés ici]            │
└─────────────────────────────────────┘
```

## 🗂️ Structure des Fichiers

```
pandaroux/
│
├── 📄 package.json                    # Dépendances React
├── 📄 README.md                       # Documentation principale
├── 📄 LLM_INTEGRATION_GUIDE.md       # Guide pour votre collègue
├── 📄 .gitignore
│
├── 📁 public/
│   └── index.html                     # HTML de base
│
└── 📁 src/
    ├── App.js                         # ⭐ Routing principal
    ├── App.css                        # 🎨 Variables CSS globales
    ├── index.js                       # Point d'entrée React
    ├── index.css                      # Styles de base
    │
    └── 📁 components/
        ├── MainMenu.js                # 🏠 Menu principal
        ├── MainMenu.css
        ├── CategorySelection.js       # 📂 Choix catégorie
        ├── CategorySelection.css
        ├── ItemSearch.js              # 🔍 Recherche avec IA
        └── ItemSearch.css
```

## 🎨 Palette de Couleurs

```css
┌────────────────────────────────────────────┐
│ PRIMARY (Panda Roux)                       │
│ ████ #D97142 ████  Orange principal       │
│ ████ #E89163 ████  Orange clair           │
│ ████ #B85A31 ████  Orange foncé           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ SECONDARY (Nature/Durable)                 │
│ ████ #2C5F4F ████  Vert forêt             │
│ ████ #3A7A66 ████  Vert clair             │
│ ████ #1E4436 ████  Vert foncé             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ACCENT (Premium)                           │
│ ████ #E8C77A ████  Or doux                │
│ ████ #F0D99C ████  Or clair               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ BACKGROUNDS                                 │
│ ████ #F7F4EF ████  Beige principal        │
│ ████ #FFFFFF ████  Blanc cartes           │
└────────────────────────────────────────────┘
```

## 🔌 Point d'Intégration LLM

### Fichier: `src/components/ItemSearch.js`

```javascript
// Ligne ~15-35
const handleSearch = async (query) => {
  if (!query.trim()) return;
  
  setIsSearching(true);
  
  // ============================================
  // 👈 VOTRE COLLÈGUE DOIT MODIFIER ICI
  // ============================================
  
  try {
    const response = await fetch('ENDPOINT_API', {
      method: 'POST',
      body: JSON.stringify({ query, category: category.id })
    });
    const data = await response.json();
    setResults(data.results);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsSearching(false);
  }
};
```

## 📊 Format de Données

### 📥 Entrée (Frontend → Backend)
```json
{
  "query": "pull en laine beige",
  "category": "tops"
}
```

### 📤 Sortie (Backend → Frontend)
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
      "location": { "city": "Paris" },
      "distance_km": 5.2,
      "eco_metrics": {
        "score": 85,
        "co2_saved_kg": 2.3
      },
      "savings": {
        "amount": 50.00,
        "percentage": 67
      }
    }
  ],
  "metadata": {
    "total": 45,
    "search_time_ms": 1234
  }
}
```

## 🚀 Quick Start

```bash
# 1. Installer les dépendances
cd pandaroux
npm install

# 2. Créer le fichier .env (optionnel)
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# 3. Lancer l'application
npm start

# → Ouvre http://localhost:3000
```

## ✅ Checklist de Développement

### Phase 1 - Configuration (Déjà fait ✓)
- [x] Structure du projet
- [x] Design system (couleurs, typo)
- [x] Navigation entre écrans
- [x] Interface de recherche
- [x] Zone d'intégration LLM préparée

### Phase 2 - Intégration Backend (À faire)
- [ ] Configurer l'endpoint API
- [ ] Implémenter handleSearch()
- [ ] Créer ResultCard component
- [ ] Tester avec données mockées
- [ ] Tester avec API réelle

### Phase 3 - Features Avancées (Futures)
- [ ] Système conversationnel
- [ ] Gestion garde-robe
- [ ] Upload photos outfit
- [ ] Métriques détaillées
- [ ] Filtres avancés

## 🎯 Catégories Disponibles

```javascript
const categories = [
  { id: 'tops', name: 'Hauts', icon: '👕' },
  { id: 'bottoms', name: 'Bas', icon: '👖' },
  { id: 'shoes', name: 'Chaussures', icon: '👟' },
  { id: 'accessories', name: 'Accessoires', icon: '⌚' },
  { id: 'outerwear', name: 'Vestes', icon: '🧥' },
  { id: 'eyewear', name: 'Lunettes', icon: '👓' },
  { id: 'jewelry', name: 'Bijoux', icon: '👑' },
  { id: 'bags', name: 'Sacs', icon: '👜' },
];
```

## 🎬 Animations Incluses

- **fadeIn**: Apparition en fondu
- **slideUp**: Glissement vers le haut
- **scaleIn**: Zoom progressif
- **float**: Flottement continu (logo)
- **pulse**: Pulsation (états vides)
- **spin**: Rotation (chargement)

Toutes utilisent `animation-delay` pour des effets séquentiels élégants.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint principal: 768px
- Adaptation automatique des grilles
- Touch-friendly (boutons 48px min)

## 🔧 Technologies Utilisées

- **React** 18.2.0
- **Lucide React** 0.263.1 (icônes)
- **CSS Variables** (theming)
- **Fetch API** (HTTP requests)

## 📚 Documentation

1. **README.md** - Vue d'ensemble et installation
2. **LLM_INTEGRATION_GUIDE.md** - Guide détaillé pour l'intégration backend
3. **Ce fichier** - Référence visuelle rapide

## 💡 Prochaines Étapes

1. **Immédiat**: Intégrer le backend LLM
2. **Court terme**: Afficher les résultats de recherche
3. **Moyen terme**: Ajouter filtres et tri
4. **Long terme**: Features avancées (outfits, IA conversationnelle)

---

**Version**: 0.1.0 - MVP
**Équipe**: Groupe 2
**Date**: Décembre 2024
**Status**: ✅ Frontend prêt | ⏳ Backend en attente
