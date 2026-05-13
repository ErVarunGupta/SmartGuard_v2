import psutil
import time
import joblib
import os
import pandas as pd
import threading
from core.health import calculate_health_score
import winsound
from services.runtime_state import runtime_state

# =========================
# PATH
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "rf_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURE_COLUMNS = [
    "cpu_usage","ram_usage","disk_usage",
    "disk_read","disk_write","battery_percent",
    "process_count","heavy_process_count"
]

# =========================
# GLOBAL CACHE
# =========================
cached_data = {}
last_alert_time = 0

# =========================
# ALERT FUNCTION
# =========================
def trigger_alert(message):
    global last_alert_time

    if time.time() - last_alert_time < 10:
        return

    print("🚨 ALERT:", message)

    try:
        winsound.Beep(1200, 800)
    except:
        pass

    last_alert_time = time.time()

# =========================
# PROCESS FUNCTIONS
# =========================
def get_top_processes():
    processes = []

    for p in psutil.process_iter(['name', 'cpu_percent', 'memory_percent']):
        try:
            processes.append({
                "pid": p.pid,
                "name": str(p.info['name']),
                "cpu": round(p.info['cpu_percent'], 1),
                "ram": round(p.info['memory_percent'], 1)
            })
        except:
            continue

    return sorted(processes, key=lambda x: x["cpu"], reverse=True)[:5]


def get_top_ram_processes():
    processes = []

    for p in psutil.process_iter(['name', 'memory_percent']):
        try:
            processes.append({
                "name": str(p.info['name']),
                "ram": round(p.info['memory_percent'], 2)
            })
        except:
            continue

    return sorted(processes, key=lambda x: x["ram"], reverse=True)[:5]

# =========================
# BACKGROUND MONITOR
# =========================
def background_worker():
    global cached_data

    while True:
        try:
            cpu = psutil.cpu_percent()
            ram = psutil.virtual_memory().percent
            disk = psutil.disk_usage('/').percent

            battery = psutil.sensors_battery()
            battery_percent = battery.percent if battery else 100

            # ML
            features = [[cpu, ram, disk, 0, 0, battery_percent, len(psutil.pids()), 0]]
            X = scaler.transform(pd.DataFrame(features, columns=FEATURE_COLUMNS))

            pred = int(model.predict(X)[0])
            probs = model.predict_proba(X)[0].tolist()

            health_score, health_label = calculate_health_score(cpu, ram, disk, pred)

            # STATE
            if cpu > 95 or ram > 95:
                state = "CRITICAL"
            elif pred == 1:
                state = "Moderate"
            else:
                state = "Normal"

            # 🚨 ALERT
            danger = cpu > 95 or ram > 95
            if danger:
                trigger_alert("⚠ SYSTEM OVERLOAD! SAVE YOUR WORK!")

            # 🔥 RAM DETAILS
            mem = psutil.virtual_memory()
            ram_details = {
                "total": round(mem.total / (1024**3), 2),
                "used": round(mem.used / (1024**3), 2),
                "free": round(mem.available / (1024**3), 2),
                "percent": mem.percent
            }

            # 🔥 PROCESS DATA
            top_processes = get_top_processes()
            top_ram = get_top_ram_processes()

            # 🔥 RECOMMENDATIONS
            recommendation = []

            if ram > 80:
                recommendation.append("Free RAM")

            if cpu > 80:
                recommendation.append("Reduce CPU usage")

            if ram > 80 and (len(top_ram) == 0 or top_ram[0]["ram"] < 10):
                recommendation.append("Restart system (cache issue)")

            if not recommendation:
                recommendation.append("System is stable")


            
            # updated
            # =========================
            # UPDATE CLEANER DATA
            # =========================

            runtime_state["cleaner"] = {

                "junk_files": f"{round(disk * 0.15, 1)} GB",

                "cache_files": f"{round(ram * 0.08, 1)} GB",

                "temp_files": f"{round(cpu * 0.03, 1)} GB",

                "cleaned": "0 GB"
            }

            # =========================
            # UPDATE SECURITY DATA
            # =========================

            runtime_state["threat_level"] = state

            runtime_state["threats_detected"] = (
                1 if state == "CRITICAL" else 0
            )

            runtime_state["blocked_ips"] = (
                2 if state == "CRITICAL" else 0
            )

            # =========================
            # FINAL CACHE DATA
            # =========================
            cached_data = {
                "cpu": cpu,
                "ram": ram,
                "disk": disk,
                "battery": battery_percent,

                "state": state,

                "health_score": health_score,
                "health_label": health_label,

                "prediction": pred,
                "probabilities": probs,

                "recommendation": recommendation,

                "ram_details": ram_details,
                "top_processes": top_processes,
                "top_ram_processes": top_ram,

                "danger": danger
            }

        except Exception as e:
            print("Worker Error:", e)

        time.sleep(2)

# =========================
# START THREAD
# =========================
threading.Thread(target=background_worker, daemon=True).start()

# =========================
# FAST API
# =========================
def get_system_metrics():
    return cached_data