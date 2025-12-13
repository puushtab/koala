import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import CategorySelection from './components/CategorySelection';
import ItemSearch from './components/ItemSearch';
import ItemDetails from './components/ItemDetails';

function App() {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'category', 'search', 'details'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [wardrobeItems, setWardrobeItems] = useState([]);

  const handleAddItem = () => {
    setCurrentView('category');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('search');
  };

  const handleBack = () => {
    if (currentView === 'details') {
      setCurrentView('search');
      setSelectedItem(null);
    } else if (currentView === 'search') {
      setCurrentView('category');
      setSelectedCategory(null);
    } else if (currentView === 'category') {
      setCurrentView('main');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentView('details');
  };

  const handleAddToWardrobe = (item) => {
    // Éviter les doublons
    if (!wardrobeItems.find(i => i.id === item.id)) {
      setWardrobeItems([...wardrobeItems, item]);
    }
    // Retour à la recherche
    setCurrentView('search');
    setSelectedItem(null);
  };

  const handleRemoveFromWardrobe = (itemId) => {
    setWardrobeItems(wardrobeItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="App">
      {currentView === 'main' && (
        <MainMenu 
          onAddItem={handleAddItem}
          wardrobeItems={wardrobeItems}
          onRemoveItem={handleRemoveFromWardrobe}
        />
      )}
      
      {currentView === 'category' && (
        <CategorySelection 
          onCategorySelect={handleCategorySelect}
          onBack={handleBack}
        />
      )}
      
      {currentView === 'search' && selectedCategory && (
        <ItemSearch 
          category={selectedCategory}
          onBack={handleBack}
          onItemClick={handleItemClick}
        />
      )}

      {currentView === 'details' && selectedItem && (
        <ItemDetails
          item={selectedItem}
          onBack={handleBack}
          onAddToWardrobe={handleAddToWardrobe}
          isInWardrobe={wardrobeItems.some(i => i.id === selectedItem.id)}
        />
      )}
    </div>
  );
}

export default App;
