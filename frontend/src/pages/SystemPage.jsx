import React, { useEffect, useState } from "react";
import { getMetrics } from "../services/api";
import MetricCard from "../components/MetricCard";
import { killProcess } from "../services/api";

const SystemPage = () => {
  const [data, setData] = useState(null);

  const handleKill = async (pid, name) => {
    const confirmKill = window.confirm(
      `Are you sure you want to close ${name}?`,
    );

    if (!confirmKill) return;

    const res = await killProcess(pid);

    alert(res.message);
  };

  useEffect(() => {
    if (!data) return;

    if (data.danger) {
      alert("🚨 SYSTEM CRITICAL! SAVE YOUR WORK!");

      const audio = new Audio("/beep.wav");
      audio.play().catch(() => {});
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMetrics();
      console.log(res); // debug
      setData(res);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <h2>Loading...</h2>;

  // ✅ FIX FIELD MAPPING
  const health = data.health_score ?? 0;
  const recommendations = data.recommendation ?? [];
  const processes = data.top_processes ?? [];

  return (
    <div style={{ padding: "20px" }}>
      {/* <h1>🚀 Smart Laptop Analyzer + Cyber Guard</h1> */}

      <h1>💻 System Performance Monitor</h1>

      {/* 🔥 METRICS */}
      <div className="dashboard">
        <MetricCard title="CPU %" value={data.cpu} color="#22c55e" />
        <MetricCard title="RAM %" value={data.ram} color="#3b82f6" />
        <MetricCard title="Disk %" value={data.disk} color="#f59e0b" />
        <MetricCard title="Battery %" value={data.battery} color="#a855f7" />
      </div>

      {/* 🧠 STATE */}
      <h3>Current State: {data.state}</h3>

      {/* 🧠 HEALTH SCORE */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <h2>🧠 System Health Score:</h2>
        <h3>{data.health_score}/100</h3>
        <h3>{data.health_label}</h3>
      </div>

      <div
        style={{
          background: "rgba(255,255,0,0.1)",
          padding: "12px",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        ⚠️ {data.state}
      </div>

      {/* 🛠 RECOMMENDATIONS */}
      <h2>🛠 Recommended Actions</h2>

      {recommendations.length > 0 ? (
        recommendations.map((r, i) => <p key={i}>• {r}</p>)
      ) : (
        <p>No recommendations</p>
      )}

      {/* 🔥 TOP PROCESSES (TABLE VIEW) */}
      <h2>🔥 Top Resource-Consuming Applications</h2>

      {processes.length > 0 ? (
        <table
          style={{
            width: "100%",
            marginTop: "10px",
            borderCollapse: "collapse",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.05)" }}>
              <th style={th}>Process</th>
              <th style={th}>CPU %</th>
              <th style={th}>RAM %</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {processes.map((p, i) => (
              <tr key={i}>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.cpu}</td>
                <td style={td}>{p.ram}</td>
                <td>
                  <button
                    onClick={() => handleKill(p.pid, p.name)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Kill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No heavy applications detected</p>
      )}
    </div>
  );
};

// 🎨 TABLE STYLE
const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

export default SystemPage;
