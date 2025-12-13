import React from 'react';
import AddItemFlow from './components/AddItemFlow';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    // ON UTILISE DES COULEURS STANDARD ICI (orange-50 au lieu de sand)
    <div className="min-h-screen flex flex-col font-sans bg-orange-50 text-gray-800">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 fixed w-full z-10 top-0 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <span className="bg-orange-100 p-1 rounded-md text-orange-600">
                <Sparkles size={18} fill="currentColor" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Panda<span className="text-orange-600">Roux</span>
            </h1>
        </div>
        
        {/* Avatar */}
        <div className="w-9 h-9 bg-green-200 rounded-full border-2 border-white shadow-sm"></div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 p-6 mt-16 flex flex-col justify-center items-center">
        <div className="text-center max-w-md p-8">
          <div className="bg-orange-100 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 to-green-400/20 opacity-50 rounded-full animate-pulse"></div>
             <span className="text-4xl">🍃</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Ta garde-robe respire</h2>
          <p className="text-gray-500 leading-relaxed">
            Elle est encore vide. Ajoute ta première pièce.
          </p>
        </div>
      </main>

      {/* Le Menu Flottant */}
      <AddItemFlow />
    </div>
  );
}

export default App;