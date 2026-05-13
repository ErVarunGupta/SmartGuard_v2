from fastapi import APIRouter

from services.memory_service import (
    get_chat_sessions,
    get_chat_by_id,
    set_current_chat
)

router = APIRouter()


# =========================================
# ALL CHAT SESSIONS
# =========================================

@router.get("/chats")

def chats():

    return {
        "sessions": get_chat_sessions()
    }


# =========================================
# SINGLE CHAT
# =========================================

@router.get("/chat/{chat_id}")

def single_chat(chat_id: str):

    chat = get_chat_by_id(chat_id)

    if not chat:

        return {
            "error": "Chat not found"
        }

    return chat


# =========================================
# SWITCH CURRENT CHAT
# =========================================

@router.post("/chat/{chat_id}/activate")

def activate_chat(chat_id: str):

    set_current_chat(chat_id)

    return {
        "success": True,
        "active_chat": chat_id
    }