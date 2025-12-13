#!/usr/bin/env python3
"""
Test script for the FastAPI backend.
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint."""
    print("📋 Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_tools():
    """Test tools endpoint."""
    print("🔧 Testing /tools endpoint...")
    response = requests.get(f"{BASE_URL}/tools")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

def test_chat(message: str):
    """Test chat endpoint."""
    print(f"💬 Testing /chat endpoint with message: '{message}'")
    response = requests.post(
        f"{BASE_URL}/chat",
        json={"message": message}
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data['response']}")
    else:
        print(f"Error: {response.text}")
    print()

def main():
    print("=== FastAPI Backend Test ===\n")
    
    # Wait a moment for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    try:
        # Test health
        test_health()
        
        # Test tools
        test_tools()
        
        # Test chat
        test_chat("Hello!")
        
        # Test chat with Vinted search
        test_chat("Find vintage nike shoes, limit 2")
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API server")
        print("   Make sure the server is running: ./start.sh")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
