import time
from services.voice_service import speak
from services.system_service import get_system_metrics
from services.jarvis_brain import jarvis_brain

def background_monitor():
    print("🧠 Smart Monitor started")

    last_alert = {
        "cpu": 0,
        "ram": 0,
        "battery_low": 0,
        "battery_high": 0
    }

    while True:
        m = get_system_metrics()
        cpu = m['cpu']
        ram = m['ram']
        battery = m['battery']

        now = time.time()

        # =========================
        # CPU ALERT
        # =========================
        if cpu > 85 and now - last_alert["cpu"] > 20:
            if cpu > 95:
                speak(f"Critical warning! CPU usage is extremely high at {cpu} percent")
            else:
                speak(f"Warning! CPU usage is {cpu} percent")

            # AI suggestion (short)
            res = jarvis_brain(f"My CPU is {cpu} percent. Give 1 short tip.")
            if res:
                speak(res)

            last_alert["cpu"] = now

        # =========================
        # RAM ALERT
        # =========================
        if ram > 85 and now - last_alert["ram"] > 20:
            speak(f"Warning! RAM usage is {ram} percent")

            res = jarvis_brain(f"My RAM is {ram} percent. Give 1 short tip.")
            if res:
                speak(res)

            last_alert["ram"] = now

        # =========================
        # BATTERY LOW
        # =========================
        if battery < 20 and now - last_alert["battery_low"] > 60:
            speak(f"Battery is low at {battery} percent. Please plug in charger")
            last_alert["battery_low"] = now

        # =========================
        # BATTERY HIGH
        # =========================
        if battery > 80 and now - last_alert["battery_high"] > 60:
            speak(f"Battery is {battery} percent. You can unplug the charger")
            last_alert["battery_high"] = now

        time.sleep(3)