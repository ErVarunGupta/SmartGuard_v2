import joblib
import pandas as pd
from scapy.all import sniff, IP, TCP
import threading
import subprocess
import psutil
import time
from services.voice_service import speak 

# =========================
# LOAD MODEL
# =========================
from utils.path_utils import get_resource_path

model_path = get_resource_path("models/ids_model.pkl")
scaler_path = get_resource_path("models/ids_scaler.pkl")

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

FEATURE_NAMES = list(scaler.feature_names_in_)

# =========================
# GLOBAL STATE
# =========================
last_attack_alert = {}
logs = []
blocked_ips = set()

packet_counter = 0
packet_count_sec = 0
packet_rate = 0
last_time = time.time()

ip_set = set()

# 🔥 NEW TRACKING
ip_request_count = {}
ip_syn_count = {}      
ip_last_reset = {}

WINDOW = 5  

# =========================
# ML PREDICTION
# =========================
def predict_ids(cpu, ram, packet_size, packet_rate, unique_ips):

    df = pd.DataFrame(
        [[cpu, ram, packet_size, packet_rate, unique_ips]],
        columns=FEATURE_NAMES
    )

    X = scaler.transform(df)

    pred = model.predict(X)[0]
    prob = max(model.predict_proba(X)[0])

    label = "attack" if pred == 1 else "normal"

    return label, round(prob * 100, 2)

# =========================
# BLOCK IP
# =========================
def block_ip(ip):
    if ip in blocked_ips:
        return

    try:
        subprocess.run(
            [
                "netsh", "advfirewall", "firewall", "add", "rule",
                f"name=Block_{ip}",
                "dir=in",
                "action=block",
                f"remoteip={ip}"
            ],
            shell=True
        )
        blocked_ips.add(ip)
        print(f"🚫 BLOCKED: {ip}")
    except Exception as e:
        print("Block error:", e)



def get_severity(confidence, attack_type):
    if attack_type == "SYN Flood":
        return "HIGH"
    if confidence >= 95:
        return "HIGH"
    elif confidence >= 85:
        return "MEDIUM"
    else:
        return "LOW"
# =========================
# PACKET HANDLER
# =========================
def process_packet(packet):
    global packet_counter, packet_count_sec, packet_rate, last_time

    try:
        if IP not in packet:
            return

        ip = packet[IP].src
        packet_size = len(packet)

        # =========================
        # COUNT PACKETS
        # =========================
        packet_counter += 1
        packet_count_sec += 1

        ip_set.add(ip)

        # per-IP tracking
        ip_request_count[ip] = ip_request_count.get(ip, 0) + 1

        # =========================
        # 🔥 SYN DETECTION
        # =========================
        if TCP in packet:
            flags = packet[TCP].flags

            # SYN flag = 0x02
            if flags == 0x02:
                ip_syn_count[ip] = ip_syn_count.get(ip, 0) + 1

        # =========================
        # RATE CALCULATION
        # =========================
        current_time = time.time()

        if current_time - last_time >= 1:
            packet_rate = packet_count_sec
            packet_count_sec = 0
            last_time = current_time

        # =========================
        # SYSTEM METRICS
        # =========================
        cpu = psutil.cpu_percent()
        ram = psutil.virtual_memory().percent

        unique_ips = len(ip_set)

        # =========================
        # ML PREDICTION
        # =========================
        label, confidence = predict_ids(
            cpu, ram, packet_size, packet_rate, unique_ips
        )

        # =========================
        # 🔥 RULE ENGINE (ADVANCED)
        # =========================
        suspicious = False
        attack_type = "Unknown"

        # 1️⃣ SYN Flood Detection
        syn_count = ip_syn_count.get(ip, 0)

        if syn_count > 50:
            suspicious = True
            attack_type = "SYN Flood"

        # 2️⃣ DoS (rate-based)
        if ip_request_count[ip] > 100:
            suspicious = True
            attack_type = "DoS"

        # 3️⃣ Large packet
        if packet_size > 1500:
            suspicious = True
            attack_type = "Large Packet"

        # 4️⃣ System overload
        if cpu > 95 and ram > 90:
            suspicious = True
            attack_type = "System Overload"

        # =========================
        # FINAL DECISION
        # =========================
        final_attack = (
            label == "attack" and
            confidence >= 90 and
            suspicious
        )

        # =========================
        # ACTION
        # =========================
        current_time = time.time()
        if final_attack:
            block_ip(ip)

            # prevent spam (per IP)
            if ip not in last_attack_alert or current_time - last_attack_alert[ip] > 20:
                alert_msg = f"Warning! {attack_type} attack detected from IP {ip}. It has been blocked."

                print("🚨 ALERT:", alert_msg)
                speak(alert_msg)

                last_attack_alert[ip] = current_time

        # =========================
        # LOGGING
        # =========================
        severity = get_severity(confidence, attack_type)

        logs.append({
            "ip": str(ip),
            "label": str(label),
            "confidence": float(confidence),
            "packet_rate": int(packet_rate),
            "packet_size": int(packet_size),
            "attack_type": str(attack_type),
            "severity": severity,   # 🔥 NEW
            "blocked": bool(final_attack),
            "time": str(time.strftime("%H:%M:%S"))
        })

        if len(logs) > 100:
            logs.pop(0)

        # =========================
        # RESET WINDOW
        # =========================
        if ip not in ip_last_reset:
            ip_last_reset[ip] = time.time()

        if time.time() - ip_last_reset[ip] > WINDOW:
            ip_request_count[ip] = 0
            ip_syn_count[ip] = 0
            ip_last_reset[ip] = time.time()

    except Exception as e:
        print("Packet error:", e)

# =========================
# START IDS
# =========================
def run_ids():
    thread = threading.Thread(
        target=lambda: sniff(prn=process_packet, store=False),
        daemon=True
    )
    thread.start()

# =========================
# API HELPERS
# =========================
def get_logs():
    return logs

def get_stats():
    return {
        "total": packet_counter,
        "blocked": len(blocked_ips),
        "unique_ips": len(ip_set)
    }