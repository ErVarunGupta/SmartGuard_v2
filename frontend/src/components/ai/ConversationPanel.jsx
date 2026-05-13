import { useEffect, useState } from "react";
import axios from "axios";

function ConversationPanel() {

  const [sessions, setSessions] = useState([]);

  const [activeChat, setActiveChat] = useState(null);


  // =========================================
  // LOAD CHAT SESSIONS
  // =========================================

  const loadChats = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/chats"
      );

      setSessions(res.data.sessions || []);

    } catch (err) {

      console.log("Chat load error", err);
    }
  };


  // =========================================
  // LOAD ON START
  // =========================================

  useEffect(() => {

    loadChats();

    const interval = setInterval(() => {

      loadChats();

    }, 3000);

    return () => clearInterval(interval);

  }, []);


  // =========================================
  // OPEN CHAT
  // =========================================

  const openChat = async (chatId) => {

    try {

      await axios.post(
        `http://127.0.0.1:8000/chat/${chatId}/activate`
      );

      setActiveChat(chatId);

      // REDIRECT TO AI ASSISTANT PAGE
      window.location.href = `/ai-assistant/${chatId}`;

    } catch (err) {

      console.log(err);
    }
  };


  return (
    <div>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          🧠 AI Conversation History
        </h2>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "8px 14px",
            color: "white",
            fontSize: "14px",
          }}
        >
          {sessions.length} Chats
        </div>
      </div>


      {/* ========================================= */}
      {/* CHAT LIST */}
      {/* ========================================= */}

      <div
        style={{
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "14px",
          height: "420px",
          overflowY: "auto",

          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >

        {sessions.length === 0 && (

          <div
            style={{
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "100px",
              fontSize: "18px",
            }}
          >
            No conversations yet
          </div>
        )}


        {sessions.map((chat) => (

          <div
            key={chat.id}

            onClick={() => openChat(chat.id)}

            style={{

              background:
                activeChat === chat.id
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : "#0f172a",

              border:
                activeChat === chat.id
                  ? "1px solid #3b82f6"
                  : "1px solid #1e293b",

              borderRadius: "16px",

              padding: "16px",

              cursor: "pointer",

              transition: "0.3s",

              boxShadow:
                activeChat === chat.id
                  ? "0 0 20px rgba(59,130,246,0.3)"
                  : "none",
            }}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-3px)";
            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >

            {/* TITLE */}

            <div
              style={{
                color: "white",
                fontSize: "17px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              🧠 {chat.title}
            </div>


            {/* INFO */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                {chat.count} messages
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                {chat.created_at}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationPanel;