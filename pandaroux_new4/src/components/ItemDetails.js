import React from 'react';
import { ArrowLeft, ExternalLink, TrendingDown, Leaf, Package, CheckCircle } from 'lucide-react';
import './ItemDetails.css';

const ItemDetails = ({ item, onBack, onAddToWardrobe, isInWardrobe }) => {
  const priceInEur = (parseFloat(item.price.amount) / 4.3).toFixed(2);

  return (
    <div className="item-details">
      {/* Header */}
      <header className="details-header fade-in">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Détails de l'article</h1>
      </header>

      {/* Main Image */}
      <div className="details-image-container slide-up">
        <img 
          src={item.photo} 
          alt={item.title}
          className="details-image"
        />
        {item.price_difference && (
          <div className="details-savings-badge">
            <TrendingDown size={16} />
            <span>Économie de {item.price_difference}€</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="details-content slide-up" style={{ animationDelay: '100ms' }}>
        {/* Title & Brand */}
        <div className="details-title-section">
          <h2 className="details-title">{item.title}</h2>
          {item.brand && (
            <p className="details-brand">Marque: <strong>{item.brand}</strong></p>
          )}
        </div>

        {/* Price Section */}
        <div className="details-price-section">
          <div className="details-price-main">
            <span className="price-label">Prix</span>
            <span className="price-value">{priceInEur} €</span>
          </div>
          <span className="price-original">
            {item.price.amount} {item.price.currency_code}
          </span>
        </div>

        {/* Info Grid */}
        <div className="details-info-grid">
          {item.size && (
            <div className="info-card">
              <Package className="info-icon" size={20} />
              <div className="info-content">
                <span className="info-label">Taille</span>
                <span className="info-value">{item.size}</span>
              </div>
            </div>
          )}

          {item.carbon_impact_kg && (
            <div className="info-card eco">
              <Leaf className="info-icon" size={20} />
              <div className="info-content">
                <span className="info-label">Impact CO₂ évité</span>
                <span className="info-value">{item.carbon_impact_kg} kg</span>
              </div>
            </div>
          )}

          {item.price_difference && (
            <div className="info-card savings">
              <TrendingDown className="info-icon" size={20} />
              <div className="info-content">
                <span className="info-label">Économie vs neuf</span>
                <span className="info-value">{item.price_difference} €</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="details-actions">
          <button 
            className={`btn-add-wardrobe ${isInWardrobe ? 'added' : ''}`}
            onClick={() => onAddToWardrobe(item)}
            disabled={isInWardrobe}
          >
            {isInWardrobe ? (
              <>
                <CheckCircle size={20} />
                <span>Dans la garde-robe</span>
              </>
            ) : (
              <>
                <Package size={20} />
                <span>Ajouter à ma garde-robe</span>
              </>
            )}
          </button>

          <a 
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-vinted"
          >
            <ExternalLink size={20} />
            <span>Voir sur Vinted</span>
          </a>
        </div>

        {/* Type Badge */}
        <div className="details-type-badge">
          Catégorie: <strong>{getCategoryName(item.type)}</strong>
        </div>
      </div>
    </div>
  );
};

// Helper function pour les noms de catégories
const getCategoryName = (type) => {
  const names = {
    'tops': 'Hauts',
    'bottoms': 'Bas',
    'shoes': 'Chaussures',
    'headwear': 'Couvre-chef'
  };
  return names[type] || type;
};

export default ItemDetails;