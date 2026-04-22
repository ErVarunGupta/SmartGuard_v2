import os
import subprocess
import psutil

def handle_action(query: str):
    q = query.lower()

    # =========================
    # OPEN APPS
    # =========================
    if "open chrome" in q:
        os.system("start chrome")
        return "Opening Chrome"

    if "open notepad" in q:
        os.system("start notepad")
        return "Opening Notepad"

    # =========================
    # SYSTEM INFO
    # =========================
    if "top processes" in q:
        procs = []
        for p in psutil.process_iter(['name', 'cpu_percent']):
            try:
                procs.append((p.info['name'], p.info['cpu_percent']))
            except:
                pass

        procs = sorted(procs, key=lambda x: x[1], reverse=True)[:5]

        return "Top processes: " + ", ".join([f"{p[0]}" for p in procs])

    # =========================
    # KILL PROCESS
    # =========================
    if "kill chrome" in q:
        for p in psutil.process_iter(['name']):
            if "chrome" in p.info['name'].lower():
                p.terminate()
        return "Chrome closed"

    # =========================
    # CLEAN TEMP
    # =========================
    if "clean temp" in q:
        os.system("del /q/f/s %TEMP%\\*")
        return "Temporary files cleaned"

    return None