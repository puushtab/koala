// src/components/AddItemFlow.jsx
import React, { useState } from 'react';
import { Plus, X, Search, Shirt, Scissors, Footprints } from 'lucide-react';
import { searchArticleWithLLM } from '../api/llmService';

const CATEGORIES = [
  { id: 'tops', label: 'Hauts', icon: <Shirt size={24} /> },
  { id: 'bottoms', label: 'Bas', icon: <Scissors size={24} /> }, // Icône illustrative
  { id: 'shoes', label: 'Chaussures', icon: <Footprints size={24} /> },
  { id: 'accessories', label: 'Accessoires', icon: <Search size={24} /> },
];

export default function AddItemFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('category'); // 'category' ou 'search'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Ouvre/Ferme le menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setStep('category');
    setSearchQuery('');
    setSelectedCategory(null);
  };

  // Gestion du choix de catégorie
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep('search');
  };

  // Gestion de la recherche (Lien avec le backend)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Appel à la fonction qui contient la logique LLM
      const results = await searchArticleWithLLM(selectedCategory.label, searchQuery);
      console.log("Résultats reçus :", results);
      alert("Recherche envoyée au backend ! Voir la console.");
      // TODO: Ici, on redirigera vers la page de résultats
    } catch (error) {
      console.error("Erreur", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* --- MODALE D'INTERACTION --- */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-xl border border-gray-200 w-80 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-10">
          
          {/* En-tête de la modale */}
          <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold">
              {step === 'category' ? 'Nouvel Article' : selectedCategory?.label}
            </h3>
            {step === 'search' && (
              <button onClick={() => setStep('category')} className="text-xs underline opacity-80">
                Retour
              </button>
            )}
          </div>

          {/* ÉTAPE 1 : CHOIX CATÉGORIE */}
          {step === 'category' && (
            <div className="p-4 grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors border border-gray-100"
                >
                  <div className="text-orange-500 mb-2">{cat.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* ÉTAPE 2 : RECHERCHE (LLM) */}
          {step === 'search' && (
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-3">
                Décris ce que tu cherches, l'IA PandaRoux s'occupe du reste.
              </p>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Veste en jean vintage..."
                    className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                    autoFocus
                  />
                  <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading ? 'Analyse en cours...' : 'Lancer la recherche'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- BOUTON PRINCIPAL (+) --- */}
      <button
        onClick={toggleMenu}
        className={`shadow-lg p-4 rounded-full transition-all duration-300 ${
          isOpen ? 'bg-gray-200 rotate-45' : 'bg-orange-600 hover:bg-orange-700'
        }`}
      >
        {isOpen ? <Plus size={32} className="text-gray-600" /> : <Plus size={32} className="text-white" />}
      </button>
    </div>
  );
}