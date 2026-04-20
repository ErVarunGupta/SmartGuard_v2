

import os
import requests
from dotenv import load_dotenv
from openai import OpenAI
import google.generativeai as genai

load_dotenv()

# GROQ
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

# GEMINI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-3-flash-preview")

BASE_PROMPT = """
You are Jarvis, a smart AI assistant.

Rules:
- Answer short and natural
- Be human-like
- Do not over-explain unless asked
"""

# =========================
# GROQ
# =========================
def groq_response(query):
    try:
        res = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": BASE_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.6
        )
        return res.choices[0].message.content.strip()
    except Exception as e:
        print("❌ Groq Error:", e)
        return None


# =========================
# GEMINI
# =========================
def gemini_response(query):
    try:
        res = gemini_model.generate_content(f"{BASE_PROMPT}\nUser: {query}")
        return res.text.strip() if res and hasattr(res, "text") else None
    except Exception as e:
        print("❌ Gemini Error:", e)
        return None


# =========================
# OLLAMA
# =========================
def ollama_response(query):
    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": f"{BASE_PROMPT}\nUser: {query}",
                "stream": False
            },
            timeout=10
        )
        return res.json().get("response", "").strip()
    except Exception as e:
        print("❌ Ollama Error:", e)
        return None