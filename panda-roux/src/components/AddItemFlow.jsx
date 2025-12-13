// src/components/AddItemFlow.jsx
import React, { useState } from 'react';
import { Plus, X, Search, Shirt, Scissors, Footprints } from 'lucide-react';
import { searchArticleWithLLM } from '../api/llmService';

// On utilise des icônes un peu plus fines (strokeWidth={1.5})
const CATEGORIES = [
  { id: 'tops', label: 'Hauts', icon: <Shirt size={26} strokeWidth={1.5} /> },
  { id: 'bottoms', label: 'Bas', icon: <Scissors size={26} strokeWidth={1.5} /> },
  { id: 'shoes', label: 'Chaussures', icon: <Footprints size={26} strokeWidth={1.5} /> },
  { id: 'accessories', label: 'Accessoires', icon: <Search size={26} strokeWidth={1.5} /> },
];

export default function AddItemFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('category'); // 'category' ou 'search'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset state on close/open
    if (!isOpen) {
        setStep('category');
        setSearchQuery('');
        setSelectedCategory(null);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep('search');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      await searchArticleWithLLM(selectedCategory.label, searchQuery);
      alert("Recherche lancée ! (Check console)");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end">
      
      {/* --- MODALE D'INTERACTION --- */}
      {/* Ajout de l'effet "glass-effect", coins très arrondis, et animation fluide */}
      <div className={`mb-4 w-80 rounded-[2rem] overflow-hidden transition-all duration-300 ease-out origin-bottom-right shadow-soft bg-white/80 backdrop-blur-md border border-white/40 ${
         isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none absolute'
      }`}>
          
          {/* En-tête de la modale avec un dégradé subtil */}
          <div className="bg-gradient-to-r from-panda to-panda-light p-5 text-white flex justify-between items-center relative overflow-hidden">
            {/* Motif de fond subtil (optionnel, pour le style nature) */}
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Shirt size={80} />
            </div>

            <h3 className="font-bold text-lg relative z-10">
              {step === 'category' ? 'Ajouter une pièce' : selectedCategory?.label}
            </h3>
            {step === 'search' && (
              <button onClick={() => setStep('category')} className="text-sm text-white/80 hover:text-white transition relative z-10">
                Retour
              </button>
            )}
          </div>

          {/* ÉTAPE 1 : CHOIX CATÉGORIE */}
          {step === 'category' && (
            <div className="p-5 grid grid-cols-2 gap-4 bg-white/50">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  // Style des boutons de catégorie : doux, sans bordure agressive
                  className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl hover:bg-nature-light/20 hover:scale-[1.02] transition-all duration-200 shadow-sm group"
                >
                  {/* L'icône change de couleur au survol */}
                  <div className="text-nature group-hover:text-panda transition-colors duration-200 mb-2">{cat.icon}</div>
                  <span className="text-sm font-medium text-charcoal">{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* ÉTAPE 2 : RECHERCHE (LLM) */}
          {step === 'search' && (
            <div className="p-6 bg-white/50">
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Décris ta recherche. L'IA PandaRoux va chiner pour toi.
              </p>
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Veste en jean vintage délavée..."
                    // Input plus moderne : pas de bordure par défaut, fond gris pâle, focus coloré
                    className="w-full p-4 pl-5 pr-12 bg-sand rounded-xl focus:ring-2 focus:ring-panda/50 focus:bg-white transition-all outline-none text-charcoal placeholder:text-gray-400"
                    autoFocus
                  />
                  <Search className="absolute right-4 top-4 text-gray-400 group-focus-within:text-panda transition-colors" size={20} />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !searchQuery.trim()}
                  // Bouton principal avec dégradé
                  className="mt-4 w-full bg-gradient-to-r from-panda to-panda-light text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:from-panda-dark hover:to-panda transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {loading ? 'L\'IA explore...' : 'Lancer la recherche'}
                </button>
              </form>
            </div>
          )}
        </div>

      {/* --- BOUTON PRINCIPAL (+) --- */}
      <button
        onClick={toggleMenu}
        // Bouton plus gros, dégradé, grosse ombre douce
        className={`shadow-soft p-4 h-16 w-16 rounded-full transition-all duration-300 flex items-center justify-center z-50 ${
          isOpen ? 'bg-charcoal rotate-45 scale-90' : 'bg-gradient-to-br from-panda to-panda-light hover:scale-105 hover:shadow-xl'
        }`}
      >
        <Plus size={32} className="text-white" strokeWidth={2} />
      </button>
    </div>
  );
}