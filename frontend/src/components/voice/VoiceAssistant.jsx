import { useState, useEffect } from "react";
import axios from "axios";

function VoiceAssistant({ data, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const [voiceData, setVoiceData] = useState({
    mute: false,
    mic: false,
    speak: false,
    wake_word: false,
    online_mode: false,
    ai_state: "Idle",
  });

  useEffect(() => {
    fetchVoiceStatus();

    const interval = setInterval(() => {
      fetchVoiceStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchVoiceStatus = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/voice-status");

      setVoiceData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // TOGGLE FUNCTION
  // =========================

  const toggleSetting = async (setting) => {
    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/voice/toggle", {
        setting,
      });

      const result = res.data;

      console.log(result);

      if (result.success) {
        setVoiceData(result.voice);
        fetchVoiceStatus();

        if (onUpdate) {
          onUpdate(result.voice);
        }
      }
    } catch (err) {
      console.log("Toggle Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          🔊 Voice Control Panel
        </h2>

        <div
          style={{
            background: "#111827",

            border: "1px solid #1e293b",

            borderRadius: "14px",

            padding: "10px 16px",

            display: "flex",

            alignItems: "center",

            gap: "10px",
          }}
        >
          <div
            style={{
              width: "10px",

              height: "10px",

              borderRadius: "50%",

              background: loading
                ? "#f59e0b"
                : voiceData.mute
                  ? "#ef4444"
                  : voiceData.mic
                    ? "#22c55e"
                    : "#64748b",

              boxShadow: loading
                ? "0 0 10px #f59e0b"
                : voiceData.mute
                  ? "0 0 10px #ef4444"
                  : voiceData.mic
                    ? "0 0 10px #22c55e"
                    : "0 0 10px #64748b",
            }}
          />

          <span
            style={{
              color: "white",

              fontSize: "14px",

              fontWeight: "600",
            }}
          >
            {loading
              ? "Updating..."
              : voiceData.mute
                ? "Muted"
                : voiceData.mic
                  ? "Listening..."
                  : "Mic Off"}
          </span>
        </div>
      </div>

      {/* CONTROL GRID */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",

          gap: "16px",
        }}
      >
        <ControlCard
          title="Mute AI"
          icon="🔇"
          active={voiceData.mute}
          onClick={() => toggleSetting("mute")}
        />

        <ControlCard
          title="Mic Input"
          icon="🎤"
          active={voiceData.mic}
          onClick={() => toggleSetting("mic")}
        />

        <ControlCard
          title="AI Speak"
          icon="🔊"
          active={voiceData.speak}
          onClick={() => toggleSetting("speak")}
        />

        <ControlCard
          title="Wake Word"
          icon="👂"
          active={voiceData.wake_word}
          onClick={() => toggleSetting("wake_word")}
        />

        <ControlCard
          title={voiceData.online_mode ? "Online Mode" : "Offline Mode"}
          icon={voiceData.online_mode ? "🌐" : "🔌"}
          active={voiceData.online_mode}
          onClick={() => toggleSetting("online_mode")}
        />
      </div>
    </div>
  );
}

function ControlCard({ title, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active
          ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
          : "#0f172a",

        border: active ? "1px solid #3b82f6" : "1px solid #1e293b",

        borderRadius: "16px",

        padding: "18px",

        minHeight: "140px",

        cursor: "pointer",

        transition: "all 0.35s ease",

        boxShadow: active
          ? "0 0 25px rgba(59,130,246,0.35)"
          : "0 0 12px rgba(0,0,0,0.25)",

        position: "relative",

        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px) scale(1)";
      }}
    >
      {/* ICON */}
      <div
        style={{
          fontSize: "34px",
        }}
      >
        {icon}
      </div>

      {/* TITLE */}
      <h3
        style={{
          color: "white",

          marginTop: "14px",

          fontSize: "20px",

          fontWeight: "600",
        }}
      >
        {title}
      </h3>

      {/* STATUS */}
      <div
        style={{
          marginTop: "14px",

          display: "flex",

          alignItems: "center",

          gap: "8px",
        }}
      >
        <div
          style={{
            width: "10px",

            height: "10px",

            borderRadius: "50%",

            background: active ? "#22c55e" : "#ef4444",

            boxShadow: active ? "0 0 10px #22c55e" : "0 0 10px #ef4444",
          }}
        />

        <span
          style={{
            color: active ? "#dbeafe" : "#94a3b8",

            fontWeight: "600",

            fontSize: "15px",
          }}
        >
          {active ? "ACTIVE" : "DISABLED"}
        </span>
      </div>
    </div>
  );
}

export default VoiceAssistant;
