import React from 'react';
import { Plus, Leaf, X } from 'lucide-react';
import './MainMenu.css';

const MainMenu = ({ onAddItem, wardrobeItems, onRemoveItem, onItemClick }) => {
  // Grouper les items par type
  const itemsByType = {
    headwear: wardrobeItems.filter(item => item.type === 'headwear'),
    tops: wardrobeItems.filter(item => item.type === 'tops'),
    bottoms: wardrobeItems.filter(item => item.type === 'bottoms'),
    shoes: wardrobeItems.filter(item => item.type === 'shoes'),
  };

  const renderWardrobeItem = (item) => (
    <div 
      key={item.id} 
      className="wardrobe-item"
      onClick={() => onItemClick(item)}
    >
      <img src={item.photo} alt={item.title} className="wardrobe-item-image" />
      <button 
        className="wardrobe-item-remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveItem(item.id);
        }}
        aria-label="Retirer"
      >
        <X size={14} />
      </button>
    </div>
  );

  return (
    <div className="main-menu">
      {/* Header */}
      <header className="main-header fade-in">
        <div className="logo-container">
          <div className="logo-icon">
            🦊
          </div>
          <h1 className="logo-text">PandaRoux</h1>
        </div>
        <p className="tagline">
          <Leaf size={16} />
          Vos habits de seconde-main en 2 clics pour de belles économies
        </p>
      </header>

      {/* Wardrobe Section */}
      <div className="wardrobe-section slide-up" style={{ animationDelay: '100ms' }}>
        <div className="section-header">
          <h2 className="section-title">Mon Garde-Robe</h2>
          <span className="item-count">{wardrobeItems.length} article{wardrobeItems.length > 1 ? 's' : ''}</span>
        </div>
        
        {wardrobeItems.length === 0 ? (
          <div className="wardrobe-grid">
            <div className="empty-state">
              <div className="empty-icon">👕</div>
              <p className="empty-text">Votre garde-robe est vide</p>
              <p className="empty-subtext">Ajoutez vos habits préférés en quelques clics</p>
            </div>
          </div>
        ) : (
          <div className="wardrobe-body-layout">
            {/* Couvre-chef */}
            <div className="body-section headwear-section">
              <div className="body-section-label">Couvre-chef</div>
              <div className="body-section-items">
                {itemsByType.headwear.length > 0 ? (
                  itemsByType.headwear.map(renderWardrobeItem)
                ) : (
                  <div className="body-section-empty">🎩</div>
                )}
              </div>
            </div>

            {/* Hauts */}
            <div className="body-section tops-section">
              <div className="body-section-label">Hauts</div>
              <div className="body-section-items">
                {itemsByType.tops.length > 0 ? (
                  itemsByType.tops.map(renderWardrobeItem)
                ) : (
                  <div className="body-section-empty">👕</div>
                )}
              </div>
            </div>

            {/* Bas */}
            <div className="body-section bottoms-section">
              <div className="body-section-label">Bas</div>
              <div className="body-section-items">
                {itemsByType.bottoms.length > 0 ? (
                  itemsByType.bottoms.map(renderWardrobeItem)
                ) : (
                  <div className="body-section-empty">👖</div>
                )}
              </div>
            </div>

            {/* Chaussures */}
            <div className="body-section shoes-section">
              <div className="body-section-label">Chaussures</div>
              <div className="body-section-items">
                {itemsByType.shoes.length > 0 ? (
                  itemsByType.shoes.map(renderWardrobeItem)
                ) : (
                  <div className="body-section-empty">👟</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Button - Floating */}
      <button 
        className="add-button scale-in" 
        onClick={onAddItem}
        style={{ animationDelay: '200ms' }}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default MainMenu;
