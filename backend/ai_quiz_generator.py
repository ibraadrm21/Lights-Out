"""
Adaptive AI Quiz Generator
Generates intelligent, real-time quiz questions that adapt to player performance.
"""
import os
import json
import random
import requests
from typing import Dict, List, Optional

# Hugging Face API Configuration
HF_API_TOKEN = os.environ.get("HUGGINGFACE_API_TOKEN", "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")
API_URL = "https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

# Rank thresholds (score-based progression)
RANK_THRESHOLDS = {
    "bronze": 0,
    "silver": 100,
    "gold": 250,
    "platinum": 500,
    "diamond": 1000
}

def calculate_rank(score: int) -> str:
    """Calculate player rank based on total score"""
    if score >= RANK_THRESHOLDS["diamond"]:
        return "diamond"
    elif score >= RANK_THRESHOLDS["platinum"]:
        return "platinum"
    elif score >= RANK_THRESHOLDS["gold"]:
        return "gold"
    elif score >= RANK_THRESHOLDS["silver"]:
        return "silver"
    else:
        return "bronze"

def determine_difficulty(player_state: Dict) -> str:
    """
    Adaptive difficulty algorithm based on player state.
    Ensures smooth transitions and balanced challenge.
    """
    score = player_state.get("score", 0)
    accuracy = player_state.get("accuracy_last_5", 50)
    previous_diff = player_state.get("previous_difficulty", "easy")
    rank = player_state.get("rank", "bronze")
    
    # Score-based baseline difficulty
    if score < 50:
        base_difficulty = "easy"
    elif score < 150:
        base_difficulty = "medium"
    elif score < 300:
        base_difficulty = "medium"
    else:
        base_difficulty = "hard"
    
    # Adjust based on accuracy trend
    if accuracy > 80:
        # Player is doing well, increase challenge
        if base_difficulty == "easy":
            target_difficulty = "medium"
        elif base_difficulty == "medium":
            target_difficulty = "hard"
        else:
            target_difficulty = "hard"
    elif accuracy < 40:
        # Player is struggling, decrease challenge
        if base_difficulty == "hard":
            target_difficulty = "medium"
        elif base_difficulty == "medium":
            target_difficulty = "easy"
        else:
            target_difficulty = "easy"
    else:
        # Stable performance, maintain current level
        target_difficulty = base_difficulty
    
    # Smooth transitions - avoid sudden jumps
    difficulty_order = ["easy", "medium", "hard"]
    prev_idx = difficulty_order.index(previous_diff) if previous_diff in difficulty_order else 0
    target_idx = difficulty_order.index(target_difficulty)
    
    # Only allow one-step transitions
    if abs(target_idx - prev_idx) > 1:
        if target_idx > prev_idx:
            target_difficulty = difficulty_order[prev_idx + 1]
        else:
            target_difficulty = difficulty_order[prev_idx - 1]
    
    return target_difficulty

def determine_rank_adjustment(player_state: Dict, difficulty: str) -> str:
    """
    Determine if player's rank should be adjusted.
    Only adjusts if sustained performance warrants it.
    """
    score = player_state.get("score", 0)
    accuracy = player_state.get("accuracy_last_5", 50)
    current_rank = player_state.get("rank", "bronze")
    
    # Increase rank if: hard difficulty + high score + high accuracy
    if difficulty == "hard" and accuracy > 70 and score > RANK_THRESHOLDS.get(current_rank, 0) + 50:
        return "increase"
    
    # Decrease rank if: easy difficulty + low score + low accuracy
    if difficulty == "easy" and accuracy < 40 and score < 30:
        return "decrease"
    
    return "none"

def generate_adaptive_question(player_state: Dict, seen_questions: List[str] = None) -> Optional[Dict]:
    """
    Generate an adaptive quiz question using AI based on player state.
    
    Args:
        player_state: Dict containing:
            - score: int
            - rank: str (bronze/silver/gold/platinum/diamond)
            - previous_difficulty: str (easy/medium/hard)
            - accuracy_last_5: float (0-100)
            - category: str (F1, general, etc.)
            - pace: str (fast/slow/normal)
        seen_questions: List of strings (question texts) to avoid repeating.
    
    Returns:
        Dict with question, options, correct_answer_index, difficulty, rank_adjustment, explanation
    """
    # Determine adaptive difficulty
    difficulty = determine_difficulty(player_state)
    rank_adjustment = determine_rank_adjustment(player_state, difficulty)
    category = player_state.get("category") or "general knowledge"
    
    # Fallback to static question if no API token
    if not HF_API_TOKEN:
        return generate_fallback_question(difficulty, category, rank_adjustment)
    
    # Build AI prompt based on difficulty and category
    difficulty_instructions = {
        "easy": "Create an easy question suitable for beginners. Use well-known facts.",
        "medium": "Create a medium difficulty question requiring moderate knowledge.",
        "hard": "Create a challenging question for experts with deep knowledge."
    }
    
    category_context = ""
    if category.lower() == "f1":
        category_context = "Formula 1 racing (drivers, teams, circuits, history, technical regulations)"
    else:
        category_context = "general knowledge across various topics"
    
    # Construct negative constraints for seen questions
    seen_constraint = ""
    if seen_questions and len(seen_questions) > 0:
        # Take only the last 20 to avoid token limit issues
        recent_seen = seen_questions[-20:]
        seen_list = '", "'.join(recent_seen)
        seen_constraint = f'\nDO NOT generate any of the following questions: "{seen_list}"'

    prompt = f"""<s>[INST] You are an expert quiz question generator.
Generate ONE multiple-choice question about {category_context}.
Difficulty level: {difficulty}
{difficulty_instructions[difficulty]}
{seen_constraint}

Format your response as ONLY a valid JSON object (no extra text):
{{
  "question": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct_answer_index": 0,
  "explanation": "Brief explanation of why the answer is correct"
}}

Requirements:
- All 4 options must be plausible
- Only one correct answer
- Globally understandable (no obscure regional facts)
- Explanation should be 1-2 sentences
- The question MUST be different from any in the "DO NOT generate" list.
[/INST]"""

    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
            "return_full_text": False
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ API Response received: {result}")
        
        generated_text = result[0]['generated_text']
        
        # Extract JSON from response
        start_idx = generated_text.find('{')
        end_idx = generated_text.rfind('}') + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = generated_text[start_idx:end_idx]
            question_data = json.loads(json_str)
            
            # Validate structure
            required_keys = ["question", "options", "correct_answer_index", "explanation"]
            if all(k in question_data for k in required_keys):
                # Add metadata
                question_data["difficulty"] = difficulty
                question_data["rank_adjustment"] = rank_adjustment
                
                # Validate options array
                if isinstance(question_data["options"], list) and len(question_data["options"]) == 4:
                    print(f"✅ AI question generated successfully!")
                    return question_data
        
        print(f"⚠️ AI response didn't match expected format, using fallback")
        # If AI generation fails, use fallback
        return generate_fallback_question(difficulty, category, rank_adjustment)
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text[:500]}")
        return generate_fallback_question(difficulty, category, rank_adjustment)
    except Exception as e:
        print(f"❌ AI Generation Error: {type(e).__name__}: {e}")
        return generate_fallback_question(difficulty, category, rank_adjustment)

def generate_fallback_question(difficulty: str, category: str, rank_adjustment: str) -> Dict:
    """
    Generate a fallback question from static pool when AI is unavailable.
    """
    # Import here to avoid circular dependency
    from models import get_random_questions
    
    try:
        # Try to get a question from database
        questions = get_random_questions(count=1)
        if questions:
            q = questions[0]
            return {
                "question": q["text"],
                "options": [q["A"], q["B"], q["C"], q["D"]],
                "correct_answer_index": ord(q["debug_correct"]) - ord('A'),  # Convert A/B/C/D to 0/1/2/3
                "difficulty": difficulty,
                "rank_adjustment": rank_adjustment,
                "explanation": f"This is a {difficulty} level question about {category}."
            }
    except Exception as e:
        print(f"Fallback error: {e}")
    
    # Ultimate fallback - hardcoded question
    fallback_questions = {
        "F1": {
            "easy": {
                "question": "Who has won the most Formula 1 World Championships?",
                "options": ["Lewis Hamilton", "Michael Schumacher", "Ayrton Senna", "Sebastian Vettel"],
                "correct_answer_index": 0,
                "explanation": "Lewis Hamilton and Michael Schumacher share the record with 7 championships each."
            },
            "medium": {
                "question": "Which circuit is known as 'The Temple of Speed'?",
                "options": ["Silverstone", "Spa-Francorchamps", "Monza", "Suzuka"],
                "correct_answer_index": 2,
                "explanation": "Monza is nicknamed 'The Temple of Speed' due to its high-speed nature."
            },
            "hard": {
                "question": "In which year was the first Formula 1 World Championship held?",
                "options": ["1948", "1950", "1952", "1955"],
                "correct_answer_index": 1,
                "explanation": "The first F1 World Championship was held in 1950, won by Giuseppe Farina."
            }
        },
        "general": {
            "easy": {
                "question": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correct_answer_index": 2,
                "explanation": "Paris is the capital and largest city of France."
            },
            "medium": {
                "question": "Which planet is known as the Red Planet?",
                "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                "correct_answer_index": 1,
                "explanation": "Mars is called the Red Planet due to iron oxide on its surface."
            },
            "hard": {
                "question": "Who wrote 'One Hundred Years of Solitude'?",
                "options": ["Jorge Luis Borges", "Gabriel García Márquez", "Pablo Neruda", "Octavio Paz"],
                "correct_answer_index": 1,
                "explanation": "Gabriel García Márquez wrote this masterpiece of magical realism in 1967."
            }
        }
    }
    
    category_key = "F1" if "f1" in category.lower() else "general"
    fallback = fallback_questions[category_key][difficulty]
    fallback["difficulty"] = difficulty
    fallback["rank_adjustment"] = rank_adjustment
    
    return fallback
