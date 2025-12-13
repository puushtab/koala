import React, { useState } from 'react';
import { ArrowLeft, Search, Sparkles, MapPin, Shield, DollarSign, Loader, ShoppingBag } from 'lucide-react';
import ResultCard from './ResultCard';
import './ItemSearch.css';

// DONNÉES MOCKÉES - À REMPLACER PAR L'API LLM
const mockData = [
  {
    id: 7755500303,
    title: "Tricou Avengers mărimea M",
    price: { amount: "25.22", currency_code: "PLN" },
    brand: "Avengers",
    size: "M",
    url: "https://www.vinted.pl/items/7755500303-tricou-avengers-marimea-m",
    photo: "https://images1.vinted.net/t/02_015aa_MZGuEuST6RVsGw67u7KmqmBq/f800/1765631219.jpeg?s=0b62c481c0d2580974c127c04cc755b2101bd233",
    price_difference: 15.50,
    carbon_impact_kg: 2.3,
    type: "tops"
  },
  {
    id: 7755022824,
    title: "Koszulka / T-shirt Marvel Avengers XL | Oversize Bawełna Złoty Nadruk Unisex",
    price: { amount: "39.0", currency_code: "PLN" },
    brand: "Avengers",
    size: "XL / 42 / 14",
    url: "https://www.vinted.pl/items/7755022824-koszulka-t-shirt-marvel-avengers-xl-oversize-bawelna-zloty-nadruk-unisex",
    photo: "https://images1.vinted.net/t/05_00514_sKoyhZR2tKPbkza4e6rtoDcu/f800/1765627572.jpeg?s=31ff85dc6694976dd45543428953c012b364a736",
    price_difference: 22.00,
    carbon_impact_kg: 3.1,
    type: "tops"
  },
  {
    id: 7754950617,
    title: "Koszulki chłopięce r. 152 zestaw 6sztuk",
    price: { amount: "15.0", currency_code: "PLN" },
    brand: "Avengers",
    size: "12 years / 152 cm",
    url: "https://www.vinted.pl/items/7754950617-koszulki-chlopiece-r-152-zestaw-6sztuk",
    photo: "https://images1.vinted.net/t/05_00f9d_xqGAJA9wnttP3g5wiCUvv4ur/f800/1765627008.jpeg?s=f118c28d72d5d7e7cbc4cb3e27c4b44b2dd67556",
    price_difference: 8.00,
    carbon_impact_kg: 1.5,
    type: "tops"
  },
  {
    id: 7753791658,
    title: "Langærmet t-shirt med Avengers",
    price: { amount: "14.32", currency_code: "PLN" },
    brand: "VRS",
    size: "10 years / 140 cm",
    url: "https://www.vinted.pl/items/7753791658-langaermet-t-shirt-med-avengers",
    photo: "https://images1.vinted.net/t/05_000b4_wviRwW58gcdQtxZGcjVSkfFH/f800/1765617329.jpeg?s=d8ee559e2c7ab7f85707307296abb7a6ce0df944",
    price_difference: 12.50,
    carbon_impact_kg: 2.0,
    type: "tops"
  },
  {
    id: 7752255801,
    title: "Tričko",
    price: { amount: "6.17", currency_code: "PLN" },
    brand: "Avengers",
    size: "11 years / 146 cm",
    url: "https://www.vinted.pl/items/7752255801-tricko",
    photo: "https://images1.vinted.net/t/05_0011a_KfSE3iLuQRafPPTTGD8yrY5Z/f800/1765569821.jpeg?s=aaee0ce84830785f70cb3090d6318c681b672475",
    price_difference: 10.00,
    carbon_impact_kg: 1.8,
    type: "tops"
  },
  {
    id: 7751650077,
    title: "Iron Man Compression shirt",
    price: { amount: "186.21", currency_code: "PLN" },
    brand: "Under Armour",
    size: "L",
    url: "https://www.vinted.pl/items/7751650077-iron-man-compression-shirt",
    photo: "https://images1.vinted.net/t/05_00828_LtjaiBeYkp9vFPrrqdNCCFFt/f800/1765563465.jpeg?s=faf361d7f68b82a597c9667d1944d34e5cdbd85f",
    price_difference: 35.00,
    carbon_impact_kg: 4.5,
    type: "tops"
  },
  {
    id: 7751323834,
    title: "T-shirt Avengers",
    price: { amount: "7.0", currency_code: "PLN" },
    brand: "Marvel",
    size: "11 years / 146 cm",
    url: "https://www.vinted.pl/items/7751323834-t-shirt-avengers",
    photo: "https://images1.vinted.net/t/03_01851_8NFiCoS5mvmUjJpWtZ7ysD1i/f800/1765560258.jpeg?s=fd968335160ed35f55682bca9ec2adcca3e311a6",
    price_difference: 11.00,
    carbon_impact_kg: 1.9,
    type: "tops"
  },
  {
    id: 7751018521,
    title: "T-shirt",
    price: { amount: "5.89", currency_code: "PLN" },
    brand: "MARVEL AVENGERS",
    size: "14 years / 164 cm",
    url: "https://www.vinted.pl/items/7751018521-t-shirt",
    photo: "https://images1.vinted.net/t/02_017df_Yd8TxgjvQ9VjoCM7LKh9coiD/f800/1765557341.jpeg?s=23b4800ff6498976f3d230cdcb7c6f0c443a2cc3",
    price_difference: 9.50,
    carbon_impact_kg: 1.7,
    type: "tops"
  },
  {
    id: 7750902343,
    title: "T-shirt chłopięcy Avengers r.110 bardziej 104",
    price: { amount: "5.0", currency_code: "PLN" },
    brand: "Sinsay",
    size: "4 years / 104 cm",
    url: "https://www.vinted.pl/items/7750902343-t-shirt-chlopiecy-avengers-r110-bardziej-104",
    photo: "https://images1.vinted.net/t/05_023dc_pM6xzT9YkmaLkrwQuHUsC4wy/f800/1765556222.jpeg?s=98ef4573e0daea30929dffa052539b8a77a650df",
    price_difference: 8.50,
    carbon_impact_kg: 1.6,
    type: "tops"
  },
  {
    id: 7750891441,
    title: "T-shirt chłopięcy Avengers r .110",
    price: { amount: "5.0", currency_code: "PLN" },
    brand: "Sinsay",
    size: "5 years / 110 cm",
    url: "https://www.vinted.pl/items/7750891441-t-shirt-chlopiecy-avengers-r-110",
    photo: "https://images1.vinted.net/t/01_02666_EtJ1pSNgLTNpzj2FtmW63RNb/f800/1765556116.jpeg?s=cc40d8cd59d801f8e6f182d4f75b19de527ecde6",
    price_difference: 8.50,
    carbon_impact_kg: 1.6,
    type: "tops"
  }
];

const ItemSearch = ({ category, onBack, onItemClick, onGoHome, wardrobeCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  // Fonction de recherche avec données mockées
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    // SIMULATION - Remplacer par l'appel API LLM
    setTimeout(() => {
      // Filtrer les données mockées selon la catégorie
      const filteredResults = mockData.filter(item => 
        item.type === category.id
      );
      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);

    /* 
    ============================================================
    POUR INTÉGRER L'API LLM, REMPLACER LE CODE CI-DESSUS PAR :
    ============================================================
    
    try {
      const response = await fetch('VOTRE_ENDPOINT_API', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          category: category.id,
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const data = await response.json();
      setResults(data); // data doit être un array d'items
      
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsSearching(false);
    }
    */
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="item-search">
      {/* Header */}
      <header className="search-header fade-in">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-content">
          <div className="category-badge" style={{ background: category.color }}>
            {category.name}
          </div>
          <h1 className="page-title">Que cherchez-vous ?</h1>
        </div>
        <button className="wardrobe-icon-button" onClick={onGoHome}>
          <ShoppingBag size={24} />
          {wardrobeCount > 0 && (
            <span className="wardrobe-count-badge">{wardrobeCount}</span>
          )}
        </button>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="search-form slide-up">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={`Ex: "Pull en laine beige" ou "Jean slim taille 38"`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          {isSearching && (
            <Loader className="loading-icon" size={20} />
          )}
        </div>
        
        <button 
          type="submit" 
          className="search-button"
          disabled={!searchQuery.trim() || isSearching}
        >
          <Sparkles size={20} />
          Rechercher
        </button>
      </form>

      {/* Suggestions */}
      <div className="suggestions-section slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="suggestions-title">Suggestions populaires</h3>
        <div className="suggestions-grid">
          <button className="suggestion-chip" onClick={() => setSearchQuery('Pull en laine')}>
            Pull en laine
          </button>
          <button className="suggestion-chip" onClick={() => setSearchQuery('Jean vintage')}>
            Jean vintage
          </button>
          <button className="suggestion-chip" onClick={() => setSearchQuery('Veste en cuir')}>
            Veste en cuir
          </button>
          <button className="suggestion-chip" onClick={() => setSearchQuery('T-shirt basique')}>
            T-shirt basique
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section slide-up" style={{ animationDelay: '200ms' }}>
        <h3 className="filters-title">Tri</h3>
        <div className="filters-grid">
          <button className="filter-chip">
            <MapPin size={16} />
            <span>Distance / Zone</span>
          </button>
          <button className="filter-chip">
            <Shield size={16} />
            <span>Inclure tous les vendeurs</span>
          </button>
          <button className="filter-chip">
            <DollarSign size={16} />
            <span>Prix croissant</span>
          </button>
        </div>
      </div>

      {/* Results Area */}
      {isSearching && (
        <div className="results-loading fade-in">
          <div className="loading-spinner"></div>
          <p className="loading-text">L'IA analyse votre recherche...</p>
          <p className="loading-subtext">Recherche sur Vinted, Leboncoin, et plus encore</p>
        </div>
      )}

      {!isSearching && results.length === 0 && searchQuery && (
        <div className="no-results fade-in">
          <div className="no-results-icon">🔍</div>
          <p className="no-results-text">Aucun résultat trouvé</p>
          <p className="no-results-subtext">Essayez une autre recherche ou modifiez vos filtres</p>
        </div>
      )}

      {/* Results Grid */}
      {!isSearching && results.length > 0 && (
        <div className="results-section fade-in">
          <div className="results-header">
            <h3 className="results-title">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </h3>
          </div>
          
          <div className="results-grid">
            {results.map((item) => (
              <ResultCard 
                key={item.id} 
                item={item}
                onClick={() => onItemClick(item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSearch;
