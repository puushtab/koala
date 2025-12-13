// src/App.jsx
import React from 'react';
import AddItemFlow from './components/AddItemFlow';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header simple */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-600 tracking-tight">PandaRouxxx</h1>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div> {/* Avatar placeholder */}
      </header>

      {/* Contenu principal (Placeholder pour l'instant) */}
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center py-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ta garde-robe est vide</h2>
          <p className="text-gray-500">Ajoute ton premier outfit ou cherche une pièce unique.</p>
        </div>
      </main>

      {/* Le Menu Flottant */}
      <AddItemFlow />
    </div>
  );
}

export default App;