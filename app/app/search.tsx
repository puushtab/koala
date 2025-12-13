import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: 'top', label: 'Hauts', icon: 'shirt-outline' },
  { id: 'bottom', label: 'Bas', icon: 'list-outline' },
  { id: 'shoes', label: 'Chaussures', icon: 'footsteps-outline' },
  { id: 'acc', label: 'Accessoires', icon: 'glasses-outline' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Variable d'animation (commence à 0 = invisible)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Effet pour déclencher l'animation quand une catégorie est choisie
  useEffect(() => {
    if (selectedCategory) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Devient visible (opacité 1)
        duration: 500, // En 500ms
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0); // Reset si on désélectionne (optionnel)
    }
  }, [selectedCategory]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    
    // Simulation API
    console.log(`Recherche lancée pour: ${selectedCategory} - Termes: ${searchQuery}`);
    setTimeout(() => {
      setIsLoading(false);
      alert('Intégration LLM à faire ici !');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle recherche</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ÉTAPE 1 : Choix de catégorie */}
        <Text style={styles.sectionTitle}>1. Que cherches-tu ?</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCategory === cat.id && styles.categoryCardSelected
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={30} 
                color={selectedCategory === cat.id ? 'white' : '#555'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextSelected
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ÉTAPE 2 : Barre de recherche (Animée) */}
        {selectedCategory && (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0] // Petit effet de glissement vers le haut
            })}] 
          }}>
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>2. Précise ta demande</Text>
              <Text style={styles.helperText}>
                L'IA va utiliser cette description pour filtrer la pertinence et la fiabilité.
              </Text>
              
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Veste en jean vintage, taille M, bleu délavé..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Ionicons name="search" size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#2C3E50' },
  
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F0F2F5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: '#27ae60',
    borderColor: '#219150',
  },
  categoryText: { marginTop: 10, fontWeight: '500', color: '#555' },
  categoryTextSelected: { color: 'white' },

  inputSection: { 
    // J'ai retiré la propriété 'animation' invalide ici
  },
  helperText: { fontSize: 14, color: '#7F8C8D', marginBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    minHeight: 50,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#27ae60',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});