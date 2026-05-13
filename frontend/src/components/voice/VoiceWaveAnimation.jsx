function VoiceWaveAnimation({ state }) {

  // =========================
  // LOADING STATE
  // =========================

  if (!state) {

    return (
      <div
        style={{
          background: "#0f172a",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          color: "white",
          border: "1px solid #1e293b",
        }}
      >
        Loading Voice State...
      </div>
    );

  }

  // =========================
  // GET COLOR
  // =========================

  const getColor = () => {

    if (state === "Listening") return "#22c55e";

    if (state === "Processing") return "#f59e0b";

    if (state === "Speaking") return "#3b82f6";

    return "#64748b";

  };

  // =========================
  // GET ICON
  // =========================

  const getIcon = () => {

    if (state === "Listening") return "🎤";

    if (state === "Processing") return "🧠";

    if (state === "Speaking") return "🔊";

    return "💤";

  };

  // =========================
  // GET TEXT
  // =========================

  const getText = () => {

    if (state === "Listening") return "Listening...";

    if (state === "Processing") return "Processing...";

    if (state === "Speaking") return "Speaking...";

    return "Sleeping...";

  };

  return (
    <div
      style={{
        background: "#0f172a",

        borderRadius: "24px",

        padding: "40px",

        border: "1px solid #1e293b",

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        minHeight: "300px",

        position: "relative",

        overflow: "hidden",
      }}
    >

      {/* ========================= */}
      {/* BACKGROUND GLOW */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",

          width: "220px",

          height: "220px",

          borderRadius: "50%",

          background: getColor(),

          opacity: 0.12,

          filter: "blur(60px)",
        }}
      />

      {/* ========================= */}
      {/* VOICE BARS */}
      {/* ========================= */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",

          zIndex: 2,
        }}
      >

        {[1, 2, 3, 4, 5].map((bar) => (

          <div
            key={bar}

            style={{
              width: "10px",

              height:
                state === "Sleeping"
                  ? "30px"
                  : `${40 + bar * 14}px`,

              background: getColor(),

              borderRadius: "20px",

              animation:
                state !== "Sleeping"
                  ? "wave 1s ease-in-out infinite"
                  : "none",

              animationDelay: `${bar * 0.12}s`,

              boxShadow: `0 0 16px ${getColor()}`,
            }}
          />

        ))}

      </div>

      {/* ========================= */}
      {/* STATUS TEXT */}
      {/* ========================= */}

      <h2
        style={{
          color: "white",

          marginTop: "34px",

          fontSize: "36px",

          fontWeight: "700",

          zIndex: 2,
        }}
      >
        {getIcon()} {getText()}
      </h2>

      {/* ========================= */}
      {/* SUBTEXT */}
      {/* ========================= */}

      <p
        style={{
          color: "#94a3b8",

          marginTop: "12px",

          fontSize: "17px",

          zIndex: 2,
        }}
      >
        OmniGuard AI Voice Assistant
      </p>

      {/* ========================= */}
      {/* STATE BADGE */}
      {/* ========================= */}

      <div
        style={{
          marginTop: "20px",

          background: "#020617",

          border: `1px solid ${getColor()}`,

          color: "white",

          borderRadius: "14px",

          padding: "10px 18px",

          display: "flex",

          alignItems: "center",

          gap: "10px",

          zIndex: 2,
        }}
      >

        <div
          style={{
            width: "10px",

            height: "10px",

            borderRadius: "50%",

            background: getColor(),

            boxShadow: `0 0 12px ${getColor()}`,
          }}
        />

        <span
          style={{
            fontWeight: "600",
          }}
        >
          AI State: {state}
        </span>

      </div>

      {/* ========================= */}
      {/* CSS ANIMATION */}
      {/* ========================= */}

      <style>
        {`

          @keyframes wave {

            0% {
              transform: scaleY(0.5);
              opacity: 0.5;
            }

            50% {
              transform: scaleY(1.4);
              opacity: 1;
            }

            100% {
              transform: scaleY(0.5);
              opacity: 0.5;
            }

          }

        `}
      </style>

    </div>
  );
}

export default VoiceWaveAnimation;