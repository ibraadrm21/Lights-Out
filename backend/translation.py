# translation.py - AI-powered translation using Hugging Face
import os
import requests
from dotenv import load_dotenv

load_dotenv()
HF_API_TOKEN = os.environ.get("HUGGINGFACE_API_TOKEN", "")

# Language code mapping for Hugging Face models
LANG_MAP = {
    "en": "eng_Latn",
    "es": "spa_Latn",
    "fr": "fra_Latn",
    "de": "deu_Latn",
    "it": "ita_Latn",
    "pt": "por_Latn",
    "nl": "nld_Latn",
    "ja": "jpn_Jpan",
}

def translate_text(text, target_lang="es", source_lang="en"):
    """
    Translate text using Hugging Face's NLLB (No Language Left Behind) model.
    This model supports 200+ languages.
    """
    if not HF_API_TOKEN:
        return {"error": "API token not configured"}
    
    if target_lang == source_lang:
        return {"translation": text}
    
    # Map to NLLB language codes
    src_code = LANG_MAP.get(source_lang, "eng_Latn")
    tgt_code = LANG_MAP.get(target_lang, "spa_Latn")
    
    API_URL = "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M"
    
    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": text,
        "parameters": {
            "src_lang": src_code,
            "tgt_lang": tgt_code
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            # Handle different response formats
            if isinstance(result, list) and len(result) > 0:
                translation = result[0].get("translation_text", text)
            elif isinstance(result, dict):
                translation = result.get("translation_text", text)
            else:
                translation = text
            
            return {"translation": translation}
        else:
            return {"error": f"API error: {response.status_code}", "original": text}
    
    except Exception as e:
        return {"error": str(e), "original": text}

def translate_batch(texts, target_lang="es", source_lang="en"):
    """
    Translate multiple texts at once.
    Returns a list of translations in the same order.
    """
    results = []
    for text in texts:
        result = translate_text(text, target_lang, source_lang)
        results.append(result.get("translation", text))
    
    return results
