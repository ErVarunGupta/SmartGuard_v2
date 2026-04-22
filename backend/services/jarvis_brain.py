import threading
from services.ai_service import groq_response, gemini_response, ollama_response
from services.system_service import get_system_metrics
from services.memory_service import add_chat, add_fact, get_fact

from services.action_engine import handle_action


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


def is_system_query(q):
    return any(k in q for k in ["cpu", "ram", "battery", "system", "status"])


def jarvis_brain(query):
    q = query.lower()

    # =========================
    # ACTION ENGINE (NEW)
    # =========================
    action = handle_action(query)
    if action:
        return action

    # MEMORY LEARNING
    if "my name is" in q:
        name = q.replace("my name is", "").strip()
        add_fact("name", name)
        return f"Nice to meet you {name}"

    name = get_fact("name")
    if "name" in q and name:
        return f"Your name is {name}"

    source = None
    res = None

    # =========================
    # SYSTEM QUERY
    # =========================
    if is_system_query(q):
        m = get_system_metrics()

        system_data = f"""
CPU: {m['cpu']}%
RAM: {m['ram']}%
Battery: {m['battery']}%
"""

        prompt = f"""
You are Jarvis.

System Info:
{system_data}

User: {query}

Answer naturally. Keep it short unless asked.
"""

    else:
        prompt = f"""
You are Jarvis.

User: {query}

Answer naturally and briefly.
"""

    # AI ROUTING
    
    res = run_with_timeout(groq_response, (prompt,), 5)
    if res:
        source = "groq"

    if not res:
        res = run_with_timeout(gemini_response, (prompt,), 7)
        if res:
            source = "gemini"

    if not res:
        res = run_with_timeout(ollama_response, (prompt,), 20)
        if res:
            source = "ollama"

    # RULE FALLBACK
    if not res:
        m = get_system_metrics()
        res = f"CPU {m['cpu']}%, RAM {m['ram']}%, Battery {m['battery']}%"
        source = "rule"

    print("🧠 Source:", source)

    final = f"{source}: {res}"
    add_chat(query, final)

    return final



