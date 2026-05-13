import React from "react";

import {
  FaDesktop,
  FaShieldAlt,
  FaBroom,
  FaRobot,
  FaChartPie,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./sidebar.css";


const Sidebar = () => {

  const navigate = useNavigate();

  const location = useLocation();


  return (
    <div className="sidebar">

      {/* LOGO */}

      <img
        src="/logo.png"
        alt="logo"
        className="logo"
      />


      {/* DASHBOARD */}

      <button
        className={`sidebar-btn ${
          location.pathname === "/dashboard"
            ? "active"
            : ""
        }`}

        onClick={() =>
          navigate("/dashboard")
        }
      >
        <FaChartPie className="sidebar-icon" />

        <span className="sidebar-text">
          Dashboard
        </span>
      </button>


      {/* SYSTEM MONITOR */}

      <button
        className={`sidebar-btn ${
          location.pathname === "/system"
            ? "active"
            : ""
        }`}

        onClick={() =>
          navigate("/system")
        }
      >
        <FaDesktop className="sidebar-icon" />

        <span className="sidebar-text">
          System Monitor
        </span>
      </button>


      {/* IDS / IPS */}

      <button
        className={`sidebar-btn ${
          location.pathname === "/ids"
            ? "active"
            : ""
        }`}

        onClick={() =>
          navigate("/ids")
        }
      >
        <FaShieldAlt className="sidebar-icon" />

        <span className="sidebar-text">
          Intrusion Detection
        </span>
      </button>


      {/* CLEANER */}

      <button
        className={`sidebar-btn ${
          location.pathname === "/cleaner"
            ? "active"
            : ""
        }`}

        onClick={() =>
          navigate("/cleaner")
        }
      >
        <FaBroom className="sidebar-icon" />

        <span className="sidebar-text">
          File Cleaner
        </span>
      </button>


      {/* AI ASSISTANT */}

      <button
        className={`sidebar-btn ${
          location.pathname.includes("/ai")
            ? "active"
            : ""
        }`}

        onClick={() =>
          navigate("/ai")
        }
      >
        <FaRobot className="sidebar-icon" />

        <span className="sidebar-text">
          AI Assistant
        </span>
      </button>
    </div>
  );
};


export default Sidebar;