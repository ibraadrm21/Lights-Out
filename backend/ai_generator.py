import os
import requests
import json
import random

HF_API_TOKEN = os.environ.get("HUGGINGFACE_API_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def generate_f1_questions(count=3):
    """
    Generate F1 questions using Hugging Face Inference API.
    Returns a list of question dictionaries.
    """
    if not HF_API_TOKEN:
        print("Warning: No Hugging Face Token found.")
        return []

    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

    prompt = f"""<s>[INST] You are an expert Formula 1 historian and technical analyst.
Generate {count} unique, challenging multiple-choice questions about Formula 1 (history, drivers, circuits, or cars).
Format the output as a strictly valid JSON list of objects. Do not include any explanation, just the JSON.
Each object must have these keys:
- "text": The question string
- "option_a": Option A
- "option_b": Option B
- "option_c": Option C
- "option_d": Option D
- "correct": The correct option letter (A, B, C, or D)

Example format:
[
  {{
    "text": "Who won the 2007 Formula 1 World Drivers' Championship?",
    "option_a": "Lewis Hamilton",
    "option_b": "Fernando Alonso",
    "option_c": "Kimi Räikkönen",
    "option_d": "Felipe Massa",
    "correct": "C"
  }}
]
[/INST]"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 1024,
            "temperature": 0.7,
            "return_full_text": False
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        result = response.json()
        
        generated_text = result[0]['generated_text']
        
        # Extract JSON from the response (sometimes models add extra text)
        start_idx = generated_text.find('[')
        end_idx = generated_text.rfind(']') + 1
        
        if start_idx != -1 and end_idx != -1:
            json_str = generated_text[start_idx:end_idx]
            questions = json.loads(json_str)
            
            # Validate structure
            valid_questions = []
            for q in questions:
                if all(k in q for k in ["text", "option_a", "option_b", "option_c", "option_d", "correct"]):
                    # Add an ID (mock ID for AI questions)
                    q['id'] = f"ai_{random.randint(1000, 9999)}"
                    valid_questions.append(q)
            
            return valid_questions
            
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return []

    return []
