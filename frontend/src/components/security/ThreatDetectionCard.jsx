function ThreatDetectionCard({ data }) {

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
        Loading Threat Data...
      </div>
    );

  }

  // =========================
  // THREAT COLOR
  // =========================

  const getThreatColor = () => {

    if (data.level === "Low") return "#22c55e";

    if (data.level === "Medium") return "#f59e0b";

    return "#ef4444";

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
          🛡 Security Threat Center
        </h2>

        {/* THREAT LEVEL */}
        <div
          style={{
            background: "rgba(245,158,11,0.12)",
            border: `1px solid ${getThreatColor()}`,
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

              background: getThreatColor(),

              boxShadow: `0 0 10px ${getThreatColor()}`,
            }}
          />

          <span
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Threat Level: {data.level}
          </span>

        </div>

      </div>

      {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >

        <SecurityStat
          title="Threats Detected"
          value={data.detected}
          color="#ef4444"
        />

        <SecurityStat
          title="Blocked IPs"
          value={data.blocked_ips}
          color="#3b82f6"
        />

        <SecurityStat
          title="Threat Level"
          value={data.level}
          color="#f59e0b"
        />

      </div>

      {/* ========================= */}
      {/* LIVE LOGS */}
      {/* ========================= */}

      <div
        style={{
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "18px",
        }}
      >

        <h3
          style={{
            color: "white",
            marginBottom: "16px",
            fontSize: "20px",
          }}
        >
          🚨 Live Security Logs
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >

          {(data.logs || []).map((log, index) => (

            <div
              key={index}
              style={{
                background: "#0f172a",
                padding: "14px",
                borderRadius: "12px",

                borderLeft: "4px solid #ef4444",

                color: "#e2e8f0",

                fontSize: "14px",

                transition: "0.3s",
              }}
            >
              {log}
            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function SecurityStat({ title, value, color }) {

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "16px",

        padding: "18px",

        borderLeft: `5px solid ${color}`,

        boxShadow: `0 0 18px rgba(0,0,0,0.25)`,
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

      <h2
        style={{
          color: "white",
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {value}
      </h2>

    </div>
  );
}

export default ThreatDetectionCard;