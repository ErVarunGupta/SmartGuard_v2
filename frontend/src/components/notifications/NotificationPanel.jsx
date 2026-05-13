function NotificationPanel({ data }) {

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
        Loading Notifications...
      </div>
    );

  }

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
          🔔 Notifications
        </h2>

        {/* ALERT COUNT */}
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
          {data.length} Alerts
        </div>

      </div>

      {/* ========================= */}
      {/* NOTIFICATION LIST */}
      {/* ========================= */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          maxHeight: "520px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >

        {data.map((item, index) => (

          <NotificationCard
            key={index}
            item={item}
          />

        ))}

      </div>

    </div>
  );
}

function NotificationCard({ item }) {

  const styles = {

    warning: {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
      icon: "⚠",
    },

    security: {
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
      icon: "🛡",
    },

    ai: {
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.12)",
      icon: "🤖",
    },

    cleaner: {
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      icon: "🧹",
    },

  };

  // DEFAULT STYLE
  const current =
    styles[item.type] || styles.warning;

  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "16px",
        padding: "16px",

        borderLeft: `4px solid ${current.color}`,

        display: "flex",
        gap: "14px",
        alignItems: "flex-start",

        transition: "0.3s",

        cursor: "pointer",

        boxShadow: `0 0 20px ${current.bg}`,
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
      }}
    >

      {/* ICON */}
      <div
        style={{
          fontSize: "24px",
        }}
      >
        {current.icon}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1 }}>

        {/* TITLE + TIME */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >

          <h3
            style={{
              color: "white",
              fontSize: "17px",
              fontWeight: "600",
            }}
          >
            {item.title}
          </h3>

          <span
            style={{
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            {item.time || "Now"}
          </span>

        </div>

        {/* MESSAGE */}
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {item.message}
        </p>

      </div>

    </div>
  );
}

export default NotificationPanel;