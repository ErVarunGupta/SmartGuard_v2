from services.system_service import get_system_metrics
from services.runtime_state import runtime_state
from services.memory_service import get_chat_sessions
from services.cleaner_service import get_cleaner_data


def get_dashboard_data():

    system = get_system_metrics()

    return {

        "ai_status": {

            "model": runtime_state["ai_model"],

            "mode": runtime_state["ai_mode"],

            "latency": runtime_state["latency"],

            "state": runtime_state["ai_state"],
        },

        "voice": {

            "mute": runtime_state["mute"],

            "mic": runtime_state["mic"],

            "speak": runtime_state["speak"],

            "wake_word": runtime_state["wake_word"],

            "online_mode": runtime_state["online_mode"],
        },

        "notifications": [

            {
                "type": "ai",

                "title": "AI Active",

                "message": f"{runtime_state['ai_model']} running",
            },

            {
                "type": "security",

                "title": "Threat Level",

                "message": runtime_state["threat_level"],
            }

        ],

        "threats": {
            "level": runtime_state["threat_level"],
            "detected": runtime_state["threats_detected"],
            "blocked_ips": runtime_state["blocked_ips"],
            "logs": runtime_state["logs"]
        },

        "system": system,
        "conversation_history": get_chat_sessions(),
        "cleaner": get_cleaner_data()
    }