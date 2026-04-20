import React, { useEffect, useState } from "react";
import { getIDSLogs, getIDSStats } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IDSPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const [prevBlocked, setPrevBlocked] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // 🔊 SOUND
  const playAlert = () => {
    const audio = new Audio("/beep.wav");
    audio.play().catch(() => {});
  };

  // 📡 FETCH DATA (SAFE)
  const fetchData = async () => {
    try {
      const logsData = await getIDSLogs();
      const statsData = await getIDSStats();

      // ❌ BACKEND NOT RUNNING
      if (logsData?.error || statsData?.error) {
        setError("Backend not connected");
        return;
      }

      // ✅ SAFE CHECK
      if (!Array.isArray(logsData)) {
        console.warn("Invalid logs format");
        return;
      }

      setError(null);
      setLogs(logsData);
      setStats(statsData);

      setChartData((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          packets: statsData.total,
          alerts: statsData.blocked,
        },
      ]);

      const lastLog = logsData[logsData.length - 1];

      if (
        lastLog &&
        lastLog.label === "attack" &&
        lastLog.confidence >= 85 &&
        statsData.blocked > prevBlocked
      ) {
        playAlert();
        setShowPopup(true);

        setTimeout(() => setShowPopup(false), 3000);
        setPrevBlocked(statsData.blocked);
      }
    } catch (err) {
      console.error("IDS Error:", err.message);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [prevBlocked]);

  // ⛔ ERROR UI
  if (error) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        <h2>⚠ {error}</h2>
        <p>Please start backend service</p>
      </div>
    );
  }

  // ⏳ LOADING
  if (!stats) {
    return <h2 style={{ color: "white" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Cyber Guard IDS Dashboard</h1>

      {showPopup && <div style={popupStyle}>High Risk Attack Blocked!</div>}

      <div style={grid}>
        <Card title="Packets" value={stats.total} color="#22c55e" />
        <Card title="Alerts" value={stats.blocked} color="#ef4444" />
        <Card title="Blocked IPs" value={stats.blocked} color="#f59e0b" />
        <Card title="Unique IPs" value={stats.unique_ips} color="#3b82f6" />
      </div>

      <h2>Live Traffic</h2>
      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="packets" stroke="#22c55e" />
            <Line type="monotone" dataKey="alerts" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Live Events</h2>

      <div style={glass}>
        <table style={table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>IP</th>
              <th>Label</th>
              <th>Confidence</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            ) : (
              logs
                .slice()
                .reverse()
                .map((log, i) => (
                  <tr key={i}>
                    <td>{log.time}</td>
                    <td>{log.ip}</td>
                    <td
                      style={{
                        color:
                          log.label === "attack"
                            ? "#ef4444"
                            : "#22c55e",
                      }}
                    >
                      {log.label}
                    </td>
                    <td>{log.confidence}%</td>
                    <td>{log.action}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ================= STYLE =================

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "15px",
};

const popupStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  background: "#ef4444",
  padding: "15px",
  borderRadius: "10px",
};

const glass = {
  background: "rgba(15,23,42,0.6)",
  padding: "15px",
};

const table = {
  width: "100%",
  textAlign: "center",
};

const Card = ({ title, value, color }) => (
  <div
    style={{
      padding: "20px",
      background: "#020617",
      borderLeft: `4px solid ${color}`,
    }}
  >
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

export default IDSPage;