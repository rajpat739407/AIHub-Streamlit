# backend/app/services/textgen_service.py
import os
from typing import List
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

# Config: choose a default model
# GPT-2 small is a good default: "gpt2"
# If you have more resources use: "gpt2-medium" or "distilgpt2"
MODEL_NAME = os.environ.get("TEXTGEN_MODEL", "gpt2")

_device = 0 if torch.cuda.is_available() else -1

# Lazy load globals
_pipeline = None

def get_pipeline():
    global _pipeline
    if _pipeline is not None:
        return _pipeline

    # Use tokenizer+model + pipeline for text-generation
    # For CPU-only, we'll set device = -1
    try:
        # prefer AutoModel + tokenizer for control, but pipeline wraps it
        _pipeline = pipeline(
            "text-generation",
            model=MODEL_NAME,
            tokenizer=MODEL_NAME,
            device=_device,  # -1 for CPU, 0..n for GPUs
            framework="pt",
        )
    except Exception as e:
        # fallback to a smaller model if initial fails
        if MODEL_NAME != "distilgpt2":
            _pipeline = pipeline("text-generation", model="distilgpt2", tokenizer="distilgpt2", device=_device)
        else:
            raise
    return _pipeline


def generate_text(prompt: str,
                  max_length: int = 100,
                  temperature: float = 1.0,
                  top_k: int = 50,
                  top_p: float = 0.95,
                  num_return_sequences: int = 1) -> list[str]:
    """
    Generate text(s) from prompt using HF pipeline.
    Returns list of generated strings.
    """
    pipe = get_pipeline()
    try:
        outputs = pipe(
            prompt,
            max_length=max_length,
            temperature=float(temperature),
            top_k=int(top_k),
            top_p=float(top_p),
            num_return_sequences=int(num_return_sequences),
            do_sample=True,
            truncation=True,  # ✅ Explicit truncation fix
            pad_token_id=pipe.tokenizer.eos_token_id or 50256,  # ✅ Fix GPT-2 padding issue
            eos_token_id=pipe.tokenizer.eos_token_id or 50256,
        )
    except Exception as e:
        print(f"❌ Error generating text: {e}")
        raise

    # Normalize
    results = []
    for out in outputs:
        text = out.get("generated_text", "") if isinstance(out, dict) else str(out)
        results.append(text)
    return results
