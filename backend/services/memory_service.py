import json, os

FILE = "memory.json"

def load_memory():
    if not os.path.exists(FILE):
        return {"facts": [], "chat": []}
    try:
        data = json.load(open(FILE))
        if not isinstance(data, dict):
            return {"facts": [], "chat": []}
        return data
    except:
        return {"facts": [], "chat": []}

def save_memory(d):
    json.dump(d, open(FILE, "w"), indent=2)

def add_chat(user, jarvis):
    d = load_memory()
    d["chat"].append({"user": user, "jarvis": jarvis})
    d["chat"] = d["chat"][-10:]
    save_memory(d)

def add_fact(key, value):
    d = load_memory()
    for f in d["facts"]:
        if f["key"] == key:
            f["value"] = value
            save_memory(d)
            return
    d["facts"].append({"key": key, "value": value})
    save_memory(d)

def get_fact(key):
    d = load_memory()
    for f in d["facts"]:
        if f["key"] == key:
            return f["value"]
    return None