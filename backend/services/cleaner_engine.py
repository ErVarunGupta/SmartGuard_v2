import os
import time
# =========================
# CONFIG
# =========================
SCAN_PATHS = [
    os.path.expanduser("~\\AppData\\Local\\Temp"),
    os.path.expanduser("~\\Downloads")
]

# 🔥 EXTENSIONS
TEMP_EXT = (".tmp", ".log", ".cache", ".bak")
IMPORTANT_EXT = (".exe", ".dll", ".sys", ".ini")

# 🔥 LIMIT
MAX_FILES = 5000

# =========================
# DELETE FILES (SAFE)
# =========================

def delete_files(paths):
    deleted = []
    failed = []

    for path in paths:
        try:
            # ❌ protect important files
            if path.lower().endswith(IMPORTANT_EXT):
                failed.append(path)
                continue

            if os.path.exists(path):
                os.remove(path)
                deleted.append(path)
            else:
                failed.append(path)

        except Exception:
            failed.append(path)

    return {
        "deleted": deleted,
        "failed": failed
    }

# =========================
# FEATURE EXTRACTION
# =========================
def extract_features(path):
    try:
        stat = os.stat(path)

        size_mb = stat.st_size / (1024 * 1024)
        modified = stat.st_mtime
        now = time.time()

        return {
            "path": path,
            "size": round(size_mb, 2),
            "age_days": int((now - modified) / 86400),
            "extension": os.path.splitext(path)[1].lower(),
        }

    except Exception:
        return None

# =========================
# 🔥 SMART CLASSIFIER
# =========================
def smart_classify(file):
    ext = file["extension"]
    age = file["age_days"]
    size = file["size"]

    # 🔒 IMPORTANT FILES
    if ext in IMPORTANT_EXT:
        return {
            "category": "IMPORTANT",
            "confidence": 100,
            "reason": "System/Application file"
        }

    # 🧹 TEMP FILES
    if ext in TEMP_EXT:
        return {
            "category": "TEMP",
            "confidence": 95,
            "reason": "Temporary file"
        }

    # ⚠️ OLD UNUSED
    if age > 60 and size > 1:
        return {
            "category": "OLD",
            "confidence": 80,
            "reason": "Unused for long time"
        }

    # 🔥 LARGE OLD FILE
    if age > 30 and size > 100:
        return {
            "category": "OLD",
            "confidence": 85,
            "reason": "Large unused file"
        }

    # 🟢 SAFE
    return {
        "category": "SAFE",
        "confidence": 20,
        "reason": "Normal file"
    }

# =========================
# 🔥 SCAN SYSTEM (NORMAL)
# =========================
def scan_system(mode="ALL"):
    files = []
    count = 0

    for folder in SCAN_PATHS:
        if not os.path.exists(folder):
            continue

        for root, dirs, filenames in os.walk(folder):

            # 🔥 skip heavy/system dirs
            dirs[:] = [d for d in dirs if d not in ["node_modules", "Windows", "Program Files"]]

            for name in filenames:
                if count >= MAX_FILES:
                    return files

                path = os.path.join(root, name)

                features = extract_features(path)
                if not features:
                    continue

                result = smart_classify(features)

                # 🔥 MODE FILTER
                if mode == "TEMP" and result["category"] != "TEMP":
                    continue
                if mode == "IMPORTANT" and result["category"] != "IMPORTANT":
                    continue

                files.append({
                    "path": features["path"],
                    "size": features["size"],
                    "age": features["age_days"],
                    "category": result["category"],
                    "confidence": result["confidence"],
                    "reason": result["reason"]
                })

                count += 1

    return files