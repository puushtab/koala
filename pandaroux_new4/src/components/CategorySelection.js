import React from 'react';
import { ArrowLeft, Shirt, ToyBrick, Footprints, Crown } from 'lucide-react';
import './CategorySelection.css';

const categories = [
  { id: 'tops', name: 'Hauts', icon: Shirt, color: '#D97142', type: 'tops' },
  { id: 'bottoms', name: 'Bas', icon: ToyBrick, color: '#2C5F4F', type: 'bottoms' },
  { id: 'shoes', name: 'Chaussures', icon: Footprints, color: '#E8C77A', type: 'shoes' },
  { id: 'headwear', name: 'Couvre-chef', icon: Crown, color: '#B85A31', type: 'headwear' },
];

const CategorySelection = ({ onCategorySelect, onBack }) => {
  return (
    <div className="category-selection">
      {/* Header */}
      <header className="category-header fade-in">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-content">
          <h1 className="page-title">Choisir une catégorie</h1>
          <p className="page-subtitle">Quel type d'habit cherchez-vous ?</p>
        </div>
      </header>

      {/* Category Grid */}
      <div className="category-grid">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="category-card scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onCategorySelect(category)}
            >
              <div 
                className="category-icon-wrapper"
                style={{ background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` }}
              >
                <Icon size={28} strokeWidth={2} />
              </div>
              <span className="category-name">{category.name}</span>
              <div className="category-arrow">→</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelection;
