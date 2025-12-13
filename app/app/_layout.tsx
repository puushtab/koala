import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {/* Écran d'accueil : on cache le header par défaut */}
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        
        {/* Écran de recherche : on cache aussi le header car on a fait le nôtre avec le bouton retour */}
        <Stack.Screen 
          name="search" 
          options={{ 
            headerShown: false,
            presentation: 'card', // Animation standard de transition
          }} 
        />
      </Stack>
    </>
  );
}