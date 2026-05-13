import { useEffect, useState } from "react";

function SmartCleanerPanel({ data }) {
  // const [stats, setStats] = useState({
  //   junk: 2.4,
  //   cache: 1.1,
  //   temp: 0.8,
  //   cleaned: 0,
  // });

  const [cleaning, setCleaning] = useState(false);

  // FAKE AUTO INCREASE
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setStats((prev) => ({
  //       ...prev,
  //       junk: +(prev.junk + 0.1).toFixed(1),
  //     }));
  //   }, 15000);

  //   return () => clearInterval(interval);
  // }, []);

  const startCleaning = async () => {
    try {
      setCleaning(true);

      const res = await fetch("http://127.0.0.1:8000/api/cleaner/run", {
        method: "POST",
      });

      const result = await res.json();

      console.log(result);
    } catch (err) {
      console.log("Cleaner Error:", err);
    } finally {
      setTimeout(() => {
        setCleaning(false);
      }, 2500);
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
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          🧹 Smart Storage Cleaner
        </h2>

        <div
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "10px 16px",
            color: "white",
            fontSize: "14px",
          }}
        >
          {data?.cleaned || "0"} GB Cleaned
        </div>
      </div>

      {/* STORAGE STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <CleanerCard
          title="Junk Files"
          value={`${data?.junk_files || "0"} GB`}
          color="#ef4444"
        />

        <CleanerCard
          title="Cache Files"
          value={`${data?.cache_files || "0"} GB`}
          color="#3b82f6"
        />

        <CleanerCard
          title="Temp Files"
          value={`${data?.temp_files || "0"} GB`}
          color="#f59e0b"
        />
      </div>

      {/* RECOMMENDATIONS */}
      <div
        style={{
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            color: "white",
            marginBottom: "18px",
            fontSize: "22px",
          }}
        >
          ⚡ Recommended Actions
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <ActionButton label="🧹 Clean Temp Files" />

          <ActionButton label="⚡ Optimize RAM" />

          <ActionButton label="❌ Close Heavy Apps" />

          <ActionButton label="🚀 Boost Performance" />
        </div>
      </div>

      {/* CLEAN BUTTON */}
      <button
        onClick={startCleaning}
        disabled={cleaning}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "none",
          cursor: "pointer",

          background: cleaning
            ? "#334155"
            : "linear-gradient(135deg, #22c55e, #16a34a)",

          color: "white",

          fontSize: "18px",

          fontWeight: "700",

          boxShadow: cleaning ? "none" : "0 0 24px rgba(34,197,94,0.35)",

          transition: "0.3s",
        }}
      >
        {cleaning ? "Cleaning System..." : "🧹 Optimize & Clean System"}
      </button>

      {/* PROGRESS */}
      {cleaning && (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "14px",
              borderRadius: "20px",
              background: "#1e293b",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                animation: "loading 3s linear",
              }}
            />
          </div>

          <style>
            {`
              @keyframes loading {
                from {
                  width: 0%;
                }

                to {
                  width: 100%;
                }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}

function CleanerCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "16px",
        padding: "18px",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: "10px",
          fontSize: "14px",
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

function ActionButton({ label }) {
  return (
    <button
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        color: "white",
        padding: "14px 18px",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1e293b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#0f172a";
      }}
    >
      {label}
    </button>
  );
}

export default SmartCleanerPanel;
