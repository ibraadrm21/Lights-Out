import os
import sys

# Add current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_quiz_generator import generate_adaptive_question

player_state = {
    "score": 100,
    "rank": "silver",
    "previous_difficulty": "medium",
    "accuracy_last_5": 60,
    "category": "F1",
    "pace": "normal"
}

print("Testing generate_adaptive_question...")
try:
    result = generate_adaptive_question(player_state)
    print("\nResult:")
    print(result)
    
    if result and result.get("question") == "Who has won the most Formula 1 World Championships?":
        print("\n⚠️ WARNING: Returned ULTIMATE FALLBACK question (Lewis Hamilton/Schumacher)")
    elif result:
        print("\n✅ Success! Returned a question (either AI or DB fallback)")
    else:
        print("\n❌ Failed to return any question")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
