import React from 'react';
import { ExternalLink, TrendingDown, Leaf } from 'lucide-react';
import './ResultCard.css';

const ResultCard = ({ item, onClick }) => {
  // Convertir le prix PLN en EUR (approximatif, à adapter selon votre besoin)
  const priceInEur = (parseFloat(item.price.amount) / 4.3).toFixed(2);
  
  return (
    <div 
      className="result-card"
      onClick={onClick}
    >
      <div className="result-image-container">
        <img 
          src={item.photo} 
          alt={item.title}
          className="result-image"
          loading="lazy"
        />
        {item.price_difference && (
          <div className="savings-badge">
            <TrendingDown size={14} />
            <span>-{item.price_difference}€</span>
          </div>
        )}
      </div>
      
      <div className="result-content">
        <h3 className="result-title">{item.title}</h3>
        
        <div className="result-meta">
          <div className="result-brand-size">
            {item.brand && <span className="result-brand">{item.brand}</span>}
            {item.size && <span className="result-size">Taille {item.size}</span>}
          </div>
        </div>
        
        <div className="result-footer">
          <div className="result-price">
            <span className="price-amount">{priceInEur} €</span>
            <span className="price-original">({item.price.amount} {item.price.currency_code})</span>
          </div>
          
          {item.carbon_impact_kg && (
            <div className="result-eco">
              <Leaf size={14} />
              <span>{item.carbon_impact_kg} kg CO₂</span>
            </div>
          )}
        </div>
        
        <div className="view-link">
          <span>Voir les détails</span>
          <ExternalLink size={14} />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;