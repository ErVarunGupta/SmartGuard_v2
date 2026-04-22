from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
import psutil
import os
import json
import subprocess
import threading

# SERVICES
from services.system_service import get_system_metrics
from services.jarvis_brain import jarvis_brain
from services.ids_service import run_ids, get_logs, get_stats, block_ip
from services.cleaner_engine import (
    scan_system,
    delete_files,
    extract_features,
    smart_classify,
    SCAN_PATHS
)
from services.voice_service import start_jarvis
from services.monitor_service import background_monitor

app = FastAPI()

print("🔥 SmartGuard Backend Running")

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🚀 STARTUP EVENT (FIXED)
# =========================
@app.on_event("startup")
def startup_event():
    print("🚀 Backend started")

    # 🔥 Start Jarvis
    threading.Thread(target=start_jarvis, daemon=True).start()

    # 🔥 Start IDS (MAKE IT THREAD)
    threading.Thread(target=run_ids, daemon=True).start()

    # 🔥 Start CPU Monitor (NEW)
    threading.Thread(target=background_monitor, daemon=True).start()


# =========================
# ROOT
# =========================
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "SmartGuard Backend Running 🚀"}

# =========================
# SYSTEM METRICS
# =========================
@app.get("/metrics")
def metrics():
    return get_system_metrics()

# =========================
# KILL PROCESS
# =========================
@app.post("/kill-process")
def kill_process(pid: int):
    try:
        process = psutil.Process(pid)
        process.terminate()
        return {"status": "success", "message": f"Process {pid} terminated"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# =========================
# AI CHAT
# =========================
# @app.post("/ai-chat")
# async def ai_chat(request: Request):
#     body = await request.json()
#     query = body.get("message", "")
#     response = jarvis_brain(query)
#     print(response)
#     return {"response": response}

@app.post("/ai-chat")
async def ai_chat(request: Request):
    body = await request.json()
    query = body.get("message", "")

    response = jarvis_brain(query)
    # print("response: ", response)

    # 🔥 IMPORTANT: always return JSON
    if not response:
        return {
            "response": "Sorry, AI is not available right now",
            "source": "none",
            "status": "error"
        }

    # 🔥 FIX: clean response (remove prefix)
    if ":" in response:
        source, text = response.split(":", 1)
    else:
        source, text = "unknown", response

    # print("res text: ", text)
    # print("res source: ", source)
    return {
        "response": text.strip(),
        "source": source.strip(),
        "status": "success"
    }

# =========================
# IDS APIs
# =========================
@app.get("/ids-logs")
def ids_logs():
    return get_logs()

@app.get("/ids-stats")
def ids_stats():
    return get_stats()

@app.post("/block-ip")
async def block_ip_api(request: Request):
    body = await request.json()
    ip = body.get("ip")
    return block_ip(ip)

# =========================
# FILE CLEANER
# =========================
@app.get("/cleaner-scan")
def cleaner_scan():
    try:
        return scan_system()
    except Exception as e:
        return {"error": str(e)}

@app.post("/cleaner-delete")
def cleaner_delete(paths: list = Body(...)):
    return delete_files(paths)

# =========================
# STREAMING SCAN
# =========================
def stream_scan(mode="ALL"):
    count = 0
    MAX_FILES = 5000

    for folder in SCAN_PATHS:
        if not os.path.exists(folder):
            continue

        for root, dirs, files in os.walk(folder):
            for name in files:
                if count >= MAX_FILES:
                    return

                path = os.path.join(root, name)

                features = extract_features(path)
                if not features:
                    continue

                result = smart_classify(features)

                if mode == "TEMP" and result["category"] != "TEMP":
                    continue
                if mode == "IMPORTANT" and result["category"] != "IMPORTANT":
                    continue

                count += 1

                yield json.dumps({
                    "path": features["path"],
                    "size": features["size"],
                    "age": features["age_days"],
                    "category": result["category"],
                    "confidence": result["confidence"],
                    "reason": result["reason"],
                    "count": count
                }) + "\n"

@app.get("/cleaner-stream")
def cleaner_stream(mode: str = "ALL"):
    return StreamingResponse(stream_scan(mode), media_type="text/plain")

# =========================
# FILE OPERATIONS
# =========================
@app.get("/preview-file")
def preview_file(path: str):
    if not os.path.exists(path):
        return {"error": "File not found"}
    return FileResponse(path)

@app.get("/open-file")
def open_file(path: str):
    try:
        subprocess.run(f'explorer /select,"{path}"')
        return {"status": "opened"}
    except Exception as e:
        return {"error": str(e)}

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()

    import uvicorn

    print("🚀 Starting SmartGuard Backend...")

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False
    )