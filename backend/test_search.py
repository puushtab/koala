#!/usr/bin/env python3
"""
Script de test pour l'endpoint /search
"""

import requests
import json
import sys

API_URL = "http://localhost:8000"

def test_search(item_type: str, context: dict):
    """Test l'endpoint /search avec les paramètres donnés"""
    
    print(f"\n{'='*60}")
    print(f"🔍 Test de recherche: {item_type}")
    print(f"{'='*60}")
    print(f"Contexte: {json.dumps(context, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            f"{API_URL}/search",
            json={
                "item_type": item_type,
                "context": context
            },
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print(f"\n✅ Succès!")
            print(f"\n💬 Réponse du chatbot:")
            print(f"{data['chatbot_response']}")
            
            print(f"\n📊 Résultats trouvés: {len(data['search_results'])}")
            print(f"\n🎯 Résultats enrichis: {len(data['enriched_results'])}")
            
            # Afficher quelques résultats enrichis
            for i, item in enumerate(data['enriched_results'][:3], 1):
                print(f"\n--- Item {i} ---")
                print(f"Titre: {item.get('title', 'N/A')}")
                print(f"Prix: {item.get('price', {}).get('amount', 'N/A')}€")
                
                if 'enrichment' in item:
                    enrichment = item['enrichment']
                    
                    # Prix
                    price_diff = enrichment.get('price_difference', {})
                    print(f"\n💰 Économies:")
                    print(f"  - Prix neuf estimé: {price_diff.get('estimated_new_price', 'N/A')}€")
                    print(f"  - Économies: {price_diff.get('savings', 'N/A')}€ ({price_diff.get('savings_percent', 'N/A')}%)")
                    
                    # Écologique
                    eco = enrichment.get('ecological_impact', {})
                    print(f"\n🌱 Impact écologique:")
                    print(f"  - CO2 économisé: {eco.get('co2_saved_kg', 'N/A')}kg")
                    print(f"  - Équivalent arbres: {eco.get('trees_equivalent', 'N/A')}")
                    print(f"  - Eau économisée: {eco.get('water_saved_liters', 'N/A')}L")
            
            return True
            
        else:
            print(f"\n❌ Erreur {response.status_code}")
            print(f"Message: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"\n⏱️  Timeout - La requête a pris trop de temps")
        return False
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        return False

def check_health():
    """Vérifie que l'API est en ligne"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API en ligne")
            print(f"  - MCP connecté: {data['mcp_connected']}")
            print(f"  - Outils chargés: {data['tools_loaded']}")
            print(f"  - Gemini configuré: {data['gemini_configured']}")
            return True
        else:
            print(f"❌ API répond mais erreur {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API non accessible: {e}")
        print(f"\nAssurez-vous que l'API tourne avec:")
        print(f"  cd /home/pushtab/ENSTA/Cesure/Hackathon/red-panda/backend")
        print(f"  uvicorn api:app --reload")
        return False

def main():
    print("🚀 Test de l'endpoint /search")
    print("=" * 60)
    
    # Vérifier que l'API est en ligne
    if not check_health():
        sys.exit(1)
    
    # Test 1: T-shirt
    test_search(
        "t-shirt",
        {
            "taille": "M",
            "style": "vintage",
            "couleur": "noir ou blanc",
            "budget_max": 25
        }
    )
    
    # Test 2: Chaussures
    test_search(
        "shoes",
        {
            "pointure": "42",
            "type": "sneakers",
            "marque": "Nike",
            "budget_max": 80
        }
    )
    
    # Test 3: Veste
    test_search(
        "veste",
        {
            "taille": "L",
            "saison": "hiver",
            "matiere": "laine"
        }
    )
    
    print(f"\n{'='*60}")
    print("✅ Tests terminés")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
