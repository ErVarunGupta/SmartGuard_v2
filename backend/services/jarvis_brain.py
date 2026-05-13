import threading
import time

from services.ai_service import (
    groq_response,
    gemini_response,
    ollama_response
)

from services.system_service import get_system_metrics
from services.memory_service import add_chat, add_fact, get_fact
from services.action_engine import handle_action
from services.runtime_state import runtime_state


# =========================
# TIMEOUT WRAPPER
# =========================

def run_with_timeout(func, args=(), timeout=5):
    result = [None]

    def target():
        try:
            result[0] = func(*args)
        except:
            result[0] = None

    t = threading.Thread(target=target)
    t.start()
    t.join(timeout)

    return result[0]


# =========================
# SYSTEM QUERY CHECK
# =========================

def is_system_query(q):
    return any(
        k in q
        for k in [
            "cpu",
            "ram",
            "battery",
            "system",
            "status",
            "disk",
            "usage",
        ]
    )


# =========================
# MAIN JARVIS BRAIN
# =========================

def jarvis_brain(query):

    q = query.lower()

    # =========================
    # AI STARTED
    # =========================

    runtime_state["ai_state"] = "Processing"

    start_time = time.time()

    # =========================
    # ACTION ENGINE
    # =========================

    action = handle_action(query)

    if action:

        runtime_state["ai_state"] = "Speaking"

        runtime_state.setdefault("conversation_history", [])

        runtime_state["conversation_history"].insert(0, {
            "user": query,
            "ai": action,
            "time": time.strftime("%I:%M %p")
        })

        runtime_state["conversation_history"] = \
            runtime_state["conversation_history"][:30]

        threading.Timer(
            3,
            lambda: runtime_state.update({"ai_state": "Idle"})
        ).start()

        return action

    # =========================
    # MEMORY LEARNING
    # =========================

    if "my name is" in q:

        name = q.replace("my name is", "").strip()

        add_fact("name", name)

        response = f"Nice to meet you {name}"

        runtime_state.setdefault("conversation_history", [])

        runtime_state["conversation_history"].insert(0, {
            "user": query,
            "ai": response,
            "time": time.strftime("%I:%M %p")
        })

        return response

    name = get_fact("name")

    if "name" in q and name:

        response = f"Your name is {name}"

        runtime_state.setdefault("conversation_history", [])

        runtime_state["conversation_history"].insert(0, {
            "user": query,
            "ai": response,
            "time": time.strftime("%I:%M %p")
        })

        return response

    # =========================
    # BUILD PROMPT
    # =========================

    source = None
    res = None

    if is_system_query(q):

        m = get_system_metrics()

        system_data = f"""
CPU: {m.get('cpu', 0)}%
RAM: {m.get('ram', 0)}%
Battery: {m.get('battery', 0)}%
Disk: {m.get('disk', 0)}%
"""

        prompt = f"""
You are Jarvis.

System Info:
{system_data}

User: {query}

Answer naturally.
Keep response short and helpful.
"""

    else:

        prompt = f"""
You are Jarvis.

User: {query}

Answer naturally and briefly.
"""

    # =========================
    # AI ROUTING
    # =========================

    # ---------- GROQ ----------

    res = run_with_timeout(
        groq_response,
        (prompt,),
        5
    )

    if res:
        source = "groq"

        runtime_state["ai_model"] = "Groq"
        runtime_state["ai_mode"] = "Online"

    # ---------- GEMINI ----------

    if not res:

        res = run_with_timeout(
            gemini_response,
            (prompt,),
            7
        )

        if res:
            source = "gemini"

            runtime_state["ai_model"] = "Gemini"
            runtime_state["ai_mode"] = "Online"

    # ---------- OLLAMA ----------

    if not res:

        res = run_with_timeout(
            ollama_response,
            (prompt,),
            20
        )

        if res:
            source = "ollama"

            runtime_state["ai_model"] = "Ollama"
            runtime_state["ai_mode"] = "Offline"

    # =========================
    # RULE FALLBACK
    # =========================

    if not res:

        m = get_system_metrics()

        res = (
            f"CPU {m.get('cpu', 0)}%, "
            f"RAM {m.get('ram', 0)}%, "
            f"Battery {m.get('battery', 0)}%"
        )

        source = "rule"

        runtime_state["ai_model"] = "Rule Engine"

    # =========================
    # LATENCY
    # =========================

    latency = round(time.time() - start_time, 2)

    runtime_state["latency"] = f"{latency}s"

    # =========================
    # AI STATE
    # =========================

    runtime_state["ai_state"] = "Speaking"

    # =========================
    # FINAL RESPONSE
    # =========================

    print("🧠 Source:", source)

    final = res

    # =========================
    # MEMORY SAVE
    # =========================

    add_chat(query, final)

    # =========================
    # CONVERSATION HISTORY
    # =========================

    runtime_state.setdefault("conversation_history", [])

    runtime_state["conversation_history"].insert(0, {
        "user": query,
        "ai": final,
        "time": time.strftime("%I:%M %p")
    })

    runtime_state["conversation_history"] = \
        runtime_state["conversation_history"][:30]

    # =========================
    # AUTO IDLE
    # =========================

    threading.Timer(
        3,
        lambda: runtime_state.update({"ai_state": "Idle"})
    ).start()

    # =========================
    # RETURN RESPONSE
    # =========================

    return final