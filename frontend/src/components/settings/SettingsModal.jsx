import { useState } from "react";

function SettingsModal() {
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useState({
    model: "Gemini",
    voiceSpeed: 170,
    theme: "Dark",
    wakeSensitivity: 70,
  });

  return (
    <>
      {/* SETTINGS BUTTON */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "white",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 0 25px rgba(59,130,246,0.45)",
          zIndex: 999,
        }}
      >
        ⚙️
      </button>

      {/* MODAL */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {/* MODAL BOX */}
          <div
            style={{
              width: "500px",
              background: "#0f172a",
              borderRadius: "24px",
              padding: "30px",
              border: "1px solid #1e293b",
              boxShadow: "0 0 40px rgba(0,0,0,0.35)",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "30px",
                  fontWeight: "700",
                }}
              >
                ⚙️ Settings
              </h2>

              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* AI MODEL */}
            <SettingItem label="AI Model">
              <select
                value={settings.model}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    model: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option>Gemini</option>
                <option>Groq</option>
                <option>Ollama</option>
              </select>
            </SettingItem>

            {/* VOICE SPEED */}
            <SettingItem
              label={`Voice Speed (${settings.voiceSpeed})`}
            >
              <input
                type="range"
                min="100"
                max="250"
                value={settings.voiceSpeed}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    voiceSpeed: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                }}
              />
            </SettingItem>

            {/* THEME */}
            <SettingItem label="Theme">
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option>Dark</option>
                <option>Light</option>
              </select>
            </SettingItem>

            {/* WAKE WORD */}
            <SettingItem
              label={`Wake Word Sensitivity (${settings.wakeSensitivity}%)`}
            >
              <input
                type="range"
                min="10"
                max="100"
                value={settings.wakeSensitivity}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    wakeSensitivity: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                }}
              />
            </SettingItem>

            {/* SAVE BUTTON */}
            <button
              style={{
                width: "100%",
                marginTop: "30px",
                background:
                  "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none",
                color: "white",
                padding: "16px",
                borderRadius: "16px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow:
                  "0 0 20px rgba(59,130,246,0.35)",
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SettingItem({ label, children }) {
  return (
    <div
      style={{
        marginBottom: "24px",
      }}
    >
      <label
        style={{
          color: "white",
          display: "block",
          marginBottom: "10px",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white",
  fontSize: "15px",
};

export default SettingsModal;