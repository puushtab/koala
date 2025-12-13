// src/api/llmService.js

/**
 * Simule l'appel au backend LLM.
 * Ton collègue devra remplacer ce code par le vrai fetch/axios vers l'API IA.
 */
export const searchArticleWithLLM = async (category, query) => {
  console.log(`[BACKEND MOCK] Recherche LLM lancée : Catégorie=${category}, Query="${query}"`);
  
  // Simulation d'un délai réseau
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          // Exemples de résultats que l'IA pourrait renvoyer
          { id: 1, name: `Veste ${category} Vintage`, confidence: '98%', source: 'Vinted' },
          { id: 2, name: `Chemise ${category} Coton`, confidence: '85%', source: 'LeBonCoin' },
        ]
      });
    }, 1500); // 1.5 secondes de délai
  });
};