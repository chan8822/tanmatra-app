import os
import json
import httpx
from typing import Optional, List, Dict, Any

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.0-flash-lite"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

class GeminiClient:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.base_url = GEMINI_BASE_URL
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def generate_content(self, prompt: str, temperature: float = 0.7) -> Dict[str, Any]:
        """Generate content using Gemini API."""
        if not self.api_key:
            # Fallback to demo mode with structured mock responses
            return self._demo_response(prompt)
        
        url = f"{self.base_url}/{GEMINI_MODEL}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature, "maxOutputTokens": 1024}
        }
        try:
            resp = await self.client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return {"success": True, "text": text, "demo_mode": False}
        except Exception as e:
            return self._demo_response(prompt)
    
    def _demo_response(self, prompt: str) -> Dict[str, Any]:
        """Generate realistic demo responses based on prompt type."""
        prompt_lower = prompt.lower()
        
        if "recommend" in prompt_lower or "suggest" in prompt_lower or "menu" in prompt_lower:
            return {
                "success": True,
                "text": json.dumps({
                    "recommendations": [
                        {"dish": "Grilled Paneer Salad", "reason": "High protein, low carb — perfect for post-workout recovery", "category": "Salads", "price": 200},
                        {"dish": "Tawa Chicken", "reason": "Lean protein with authentic Indian spices, ideal for Athlete track", "category": "Healthy Meals", "price": 299},
                        {"dish": "Broccoli Almond Soup", "reason": "Calcium-rich, supports bone health for Senior track", "category": "Soups", "price": 160}
                    ],
                    "nutrition_tip": "Aim for 30g protein within 30 minutes post-workout for optimal muscle recovery.",
                    "hydration": "Pair with Watermelon Cooler for natural electrolyte replenishment."
                }),
                "demo_mode": True
            }
        
        if "nutrition" in prompt_lower or "calorie" in prompt_lower or "macro" in prompt_lower:
            return {
                "success": True,
                "text": json.dumps({
                    "analysis": {
                        "total_calories": 1850,
                        "protein_pct": 28,
                        "carbs_pct": 42,
                        "fat_pct": 30,
                        "fiber": 32,
                        "sodium_mg": 1650
                    },
                    "feedback": "Well-balanced day! Sodium is within limits. Consider adding a smoothie for micronutrient diversity.",
                    "suggestion": "Swap one carb-heavy meal with a Quinoa Khichdi for better gut health."
                }),
                "demo_mode": True
            }
        
        if "recipe" in prompt_lower or "bom" in prompt_lower or "ingredient" in prompt_lower:
            return {
                "success": True,
                "text": json.dumps({
                    "recipe_name": "Tanmatra Signature Grilled Paneer Salad",
                    "ingredients": [
                        {"item": "Paneer (cottage cheese)", "qty": "200g", "cost": 64},
                        {"item": "Mixed Greens", "qty": "150g", "cost": 15},
                        {"item": "Cherry Tomatoes", "qty": "80g", "cost": 12},
                        {"item": "Balsamic Dressing", "qty": "30ml", "cost": 8},
                        {"item": "Olive Oil", "qty": "15ml", "cost": 13}
                    ],
                    "total_cogs": 112,
                    "selling_price": 200,
                    "gm_percent": 44,
                    "prep_time_min": 12,
                    "rd_notes": "Paneer provides casein protein for slow release. Greens add Vitamin K for bone density."
                }),
                "demo_mode": True
            }
        
        return {
            "success": True,
            "text": json.dumps({"response": "I'm Tanmatra's AI nutrition assistant. I can recommend dishes, analyze your daily nutrition, or explain our recipes. What would you like to know?", "demo_mode": True}),
            "demo_mode": True
        }
    
    async def recommend_for_user(self, user_profile: Dict, available_dishes: List[Dict]) -> Dict[str, Any]:
        """AI-powered dish recommendations based on user profile."""
        prompt = f"""You are Tanmatra's AI nutrition assistant. Based on the user profile and available dishes, recommend 3-4 dishes with specific health reasoning.

User Profile: {json.dumps(user_profile)}
Available Dishes: {json.dumps([{"name": d["name"], "calories": d.get("calories"), "protein": d.get("protein"), "price": d["price"], "tags": d.get("tags", [])} for d in available_dishes[:20]])}

Return ONLY a JSON object with:
- recommendations: list of {{dish, reason, category, price}}
- nutrition_tip: string
- hydration: string"""
        return await self.generate_content(prompt, temperature=0.5)
    
    async def analyze_daily_nutrition(self, meals: List[Dict]) -> Dict[str, Any]:
        """Analyze daily nutrition intake."""
        prompt = f"""Analyze this daily meal log and return a JSON with total macros, feedback, and a suggestion.

Meals: {json.dumps(meals)}

Return ONLY a JSON object with:
- analysis: {{total_calories, protein_pct, carbs_pct, fat_pct, fiber, sodium_mg}}
- feedback: string
- suggestion: string"""
        return await self.generate_content(prompt, temperature=0.3)

# Singleton
_gemini_client = None

def get_gemini() -> GeminiClient:
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client
