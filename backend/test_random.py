from models import get_random_questions
try:
    print("Testing get_random_questions...")
    questions = get_random_questions(count=1)
    if questions:
        print(f"Success! Got question: {questions[0]['text']}")
    else:
        print("Success, but no questions returned (empty DB?)")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
