import React from "react";
import "./sidebar.css";
import { FaDesktop, FaShieldAlt, FaBroom, FaRobot } from "react-icons/fa";

const Sidebar = ({ setPage, page }) => {
  return (
    <div className="sidebar">
      <img src="logo.png" alt="logo.png" className="logo"/>
      {/* <h2 className="sidebar-title">⚙️ Controls</h2> */}

      <button
        className={`sidebar-btn ${page === "system" ? "active" : ""}`}
        onClick={() => setPage("system")}
      >
        <FaDesktop className="sidebar-icon" />
        <span className="sidebar-text">System Monitor</span>
      </button>

      <button
        className={`sidebar-btn ${page === "ids" ? "active" : ""}`}
        onClick={() => setPage("ids")}
      >
        <FaShieldAlt className="sidebar-icon" />
        <span className="sidebar-text">Intrusion Detection</span>
      </button>

      <button
        className={`sidebar-btn ${page === "cleaner" ? "active" : ""}`}
        onClick={() => setPage("cleaner")}
      >
        <FaBroom className="sidebar-icon" />
        <span className="sidebar-text">File Cleaner</span>
      </button>

      <button
        className={`sidebar-btn ${page === "ai" ? "active" : ""}`}
        onClick={() => setPage("ai")}
      >
        <FaRobot className="sidebar-icon" />
        <span className="sidebar-text">AI Assistant</span>
      </button>
    </div>
  );
};

export default Sidebar;