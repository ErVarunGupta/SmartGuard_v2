import React, { useState } from "react";
import axios from "axios";
import { color } from "framer-motion";

const CleanerPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(500);
  const [selected, setSelected] = useState([]);
  const [progress, setProgress] = useState(0);

  // 🚀 SCAN
  const scanFiles = async () => {
    setFiles([]);
    setLoading(true);
    setProgress(0);

    const response = await fetch(
      `http://127.0.0.1:8000/cleaner-stream?mode=${scanMode}`,
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let totalCount = 0;
    const MAX_FILES = 5000;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n");
      buffer = lines.pop();

      let temp = [];

      for (let line of lines) {
        if (!line.trim()) continue;

        const file = JSON.parse(line);
        temp.push(file);

        totalCount = file.count;
      }

      setFiles((prev) => [...prev, ...temp]);
      setProgress(Math.min((totalCount / MAX_FILES) * 100, 100));
    }

    setLoading(false);
  };

  // SELECT
  const toggleSelect = (path) => {
    setSelected((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const selectAll = () => {
    const current = files.slice(0, visibleCount).map((f) => f.path);

    if (selected.length === current.length) setSelected([]);
    else setSelected(current);
  };

  // DELETE
  const deleteSelected = async () => {
    if (selected.length === 0) return alert("No file selected");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/cleaner-delete",
        selected,
      );

      alert(`Deleted: ${res.data.deleted.length}`);

      setFiles((prev) => prev.filter((f) => !selected.includes(f.path)));

      setSelected([]);
    } catch {
      alert("Delete failed");
    }
  };

  // OPEN
  const openFileLocation = async (path) => {
    await axios.get("http://127.0.0.1:8000/open-file", {
      params: { path },
    });
  };

  // COUNTS
  const totalCount = files.length;
  const tempCount = files.filter((f) => f.category === "TEMP").length;
  const importantCount = files.filter((f) => f.category === "IMPORTANT").length;

  return (
    <div style={{ padding: "0px 30px", color: "white" }}>
      <h1>🧹 Smart AI File Cleaner</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        {/* 🔥 CARDS */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <Card title="All Files" value={totalCount} />
          <Card title="Temp Files" value={tempCount} />
          <Card title="Important Files" value={importantCount} />
        </div>
        <div style={{ display: "block", gap: "1rem" }}>
          {/* 🔥 MODE BUTTONS */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {["ALL", "TEMP", "IMPORTANT"].map((mode) => (
              <button
                key={mode}
                className={`tab ${scanMode === mode ? "active" : ""}`}
                onClick={() => setScanMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* 🔥 ACTIONS */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button className="btn primary" onClick={scanFiles}>
              🔍 Scan
            </button>

            <button className="btn" onClick={selectAll}>
              ☑ Select All
            </button>

            <button className="btn danger" onClick={deleteSelected}>
              🗑 Delete ({selected.length})
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 PROGRESS */}
      {loading && (
        <>
          <div
            style={{
              height: "6px",
              background: "#1e293b",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#2563eb",
              }}
            />
          </div>

          <p>Scanning {Math.floor(progress)}%</p>
        </>
      )}

      {/* 🔥 TABLE */}
      <table className="pro-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={selectAll} />
            </th>
            <th>Path</th>
            <th>Size</th>
            <th>Age</th>
            <th>Category</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {files.slice(0, visibleCount).map((file, i) => (
            <tr key={i}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(file.path)}
                  onChange={() => toggleSelect(file.path)}
                />
              </td>

              <td>{file.path}</td>
              <td>{file.size} MB</td>
              <td>{file.age}d</td>
              <td>{file.category}</td>
              <td>{file.confidence}%</td>

              <td>
                <button
                  className="icon-btn"
                  onClick={() => openFileLocation(file.path)}
                >
                  📂
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleCount < files.length && (
        <button onClick={() => setVisibleCount((prev) => prev + 500)}>
          Load More
        </button>
      )}
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="card">
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);

export default CleanerPage;
