function AIStatusPanel({ data }) {

  // =========================
  // LOADING STATE
  // =========================

  if (!data) {
    return (
      <div
        style={{
          color: "white",
          padding: "30px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        Loading AI Status...
      </div>
    );
  }

  // =========================
  // STATE COLORS
  // =========================

  const getStateColor = () => {

    if (data.state === "Listening") return "#22c55e";

    if (data.state === "Processing") return "#f59e0b";

    if (data.state === "Speaking") return "#3b82f6";

    return "#64748b";
  };

  return (
    <div>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

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
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          🤖 AI STATUS
        </h2>

        {/* LIVE BADGE */}
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
              background: "#22c55e",
              boxShadow: "0 0 10px #22c55e",
            }}
          />

          <span
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            AI ACTIVE
          </span>

        </div>

      </div>

      {/* ========================= */}
      {/* STATUS GRID */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
        }}
      >

        <StatusCard
          title="Active Model"
          value={data.model}
          color="#3b82f6"
        />

        <StatusCard
          title="Mode"
          value={data.mode}
          color="#22c55e"
        />

        <StatusCard
          title="Latency"
          value={data.latency}
          color="#f59e0b"
        />

        <StatusCard
          title="Current State"
          value={data.state}
          color="#a855f7"
        />

      </div>

      {/* ========================= */}
      {/* LIVE STATE BAR */}
      {/* ========================= */}

      <div
        style={{
          marginTop: "24px",
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >

        {/* PULSE DOT */}
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",

            background: getStateColor(),

            boxShadow: `0 0 16px ${getStateColor()}`,
          }}
        />

        <span
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Jarvis is currently {data.state}
        </span>

      </div>

    </div>
  );
}

function StatusCard({ title, value, color }) {

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "18px",
        padding: "20px",

        borderLeft: `5px solid ${color}`,

        boxShadow: "0 0 20px rgba(0,0,0,0.25)",

        transition: "0.3s",
      }}
    >

      <p
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          color: "white",
          fontSize: "26px",
          fontWeight: "700",
        }}
      >
        {value}
      </h3>

    </div>
  );
}

export default AIStatusPanel;