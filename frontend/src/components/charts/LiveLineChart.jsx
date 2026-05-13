import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";

function LiveLineChart({ systemData }) {
  // =========================
  // CHART HISTORY
  // =========================

  const [chartData, setChartData] = useState([]);

  // =========================
  // REAL-TIME HISTORY UPDATE
  // =========================

  useEffect(() => {
    if (!systemData) return;

    const newPoint = {
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),

      cpu: systemData?.cpu || 0,

      ram: systemData?.ram || 0,

      disk: systemData?.disk || 0,

      battery: systemData?.battery || 0,
    };

    setChartData((prev) => {
      const updated = [...prev, newPoint];

      // KEEP LAST 10 POINTS
      return updated.slice(-10);
    });
  }, [systemData]);

  return (
    <div>
      {/* HEADER */}
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
          📈 Live System Analytics
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
            LIVE
          </span>
        </div>
      </div>

      {/* CHART */}
      <div
        style={{
          width: "100%",
          height: "340px",
          background: "#020617",
          borderRadius: "18px",
          padding: "14px",
          border: "1px solid #1e293b",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="time" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "white",
              }}
            />

            {/* CPU */}
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />

            {/* RAM */}
            <Line
              type="monotone"
              dataKey="ram"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
            />

            {/* DISK */}
            <Line
              type="monotone"
              dataKey="disk"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
            />

            {/* BATTERY */}
            <Line
              type="monotone"
              dataKey="battery"
              stroke="#a855f7"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* LEGENDS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "16px",
        }}
      >
        <LegendItem color="#3b82f6" label="CPU" />

        <LegendItem color="#22c55e" label="RAM" />

        <LegendItem color="#f59e0b" label="Disk" />

        <LegendItem color="#a855f7" label="Battery" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />

      <span
        style={{
          color: "white",
          fontSize: "14px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default LiveLineChart;
