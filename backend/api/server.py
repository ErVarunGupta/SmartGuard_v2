from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from services.system_service import get_system_metrics
from services.ai_service import get_ai_response

app = FastAPI()

# ✅ CORS (IMPORTANT for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🔥 CORRECT SERVER RUNNING")

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "SmartGuard Backend Running"}

# =========================
# SYSTEM METRICS
# =========================
@app.get("/metrics")
def metrics():
    return get_system_metrics()

# =========================
# AI CHAT (FINAL)
# =========================
@app.post("/ai-chat")
async def ai_chat(request: Request):
    print("🔥 AI ROUTE HIT")

    body = await request.json()
    query = body.get("message", "")

    response = get_ai_response(query)

    print("🔥 RESPONSE:", response)

    return {"response": response}