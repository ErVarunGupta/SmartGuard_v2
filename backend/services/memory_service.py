import json
import os
import uuid
from datetime import datetime

FILE = "memory.json"


# =========================================
# LOAD MEMORY
# =========================================

def load_memory():

    if not os.path.exists(FILE):

        return {
            "facts": [],
            "chat_sessions": []
        }

    try:
        data = json.load(open(FILE))

        if not isinstance(data, dict):

            return {
                "facts": [],
                "chat_sessions": []
            }

        # SAFETY
        if "facts" not in data:
            data["facts"] = []

        if "chat_sessions" not in data:
            data["chat_sessions"] = []

        return data

    except:

        return {
            "facts": [],
            "chat_sessions": []
        }


# =========================================
# SAVE MEMORY
# =========================================

def save_memory(data):

    json.dump(
        data,
        open(FILE, "w"),
        indent=2
    )


# =========================================
# CURRENT TIME
# =========================================

def current_time():

    return datetime.now().strftime("%I:%M %p")


# =========================================
# CHAT SESSION
# =========================================

current_chat_id = None


# =========================================
# CREATE CHAT
# =========================================

def create_chat(title="New Chat"):

    global current_chat_id

    data = load_memory()

    chat_id = str(uuid.uuid4())

    session = {
        "id": chat_id,
        "title": title,
        "messages": [],
        "created_at": current_time()
    }

    data["chat_sessions"].append(session)

    save_memory(data)

    current_chat_id = chat_id

    return chat_id


# =========================================
# ADD CHAT MESSAGE
# =========================================

def add_chat(user, ai):

    global current_chat_id

    data = load_memory()

    # CREATE NEW CHAT IF NONE EXISTS
    if not current_chat_id:

        title = " ".join(user.split()[:3]).title()

        current_chat_id = create_chat(title)

        data = load_memory()

    # FIND CURRENT SESSION
    for session in data["chat_sessions"]:

        if session["id"] == current_chat_id:

            session["messages"].append({
                "role": "user",
                "text": user,
                "time": current_time()
            })

            session["messages"].append({
                "role": "ai",
                "text": ai,
                "time": current_time()
            })

            break

    save_memory(data)


# =========================================
# GET CHAT LIST
# =========================================

def get_chat_sessions():

    data = load_memory()

    sessions = []

    for s in reversed(data["chat_sessions"]):

        sessions.append({

            "id": s["id"],

            "title": s["title"],

            "created_at": s["created_at"],

            "count": len(s["messages"])
        })

    return sessions


# =========================================
# GET SINGLE CHAT
# =========================================

def get_chat_by_id(chat_id):

    data = load_memory()

    for session in data["chat_sessions"]:

        if session["id"] == chat_id:

            return session

    return None


# =========================================
# SWITCH CHAT
# =========================================

def set_current_chat(chat_id):

    global current_chat_id

    current_chat_id = chat_id


# =========================================
# MEMORY FACTS
# =========================================

def add_fact(key, value):

    data = load_memory()

    for fact in data["facts"]:

        if fact["key"] == key:

            fact["value"] = value

            save_memory(data)

            return

    data["facts"].append({
        "key": key,
        "value": value
    })

    save_memory(data)


# =========================================
# GET FACT
# =========================================

def get_fact(key):

    data = load_memory()

    for fact in data["facts"]:

        if fact["key"] == key:

            return fact["value"]

    return None