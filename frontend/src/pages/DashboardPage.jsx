import { useEffect, useState } from "react";

import Sidebar from "../components/common/Sidebar";
import VoiceAssistant from "../components/voice/VoiceAssistant";
import AIStatusPanel from "../components/ai/AIStatusPanel";
import LiveLineChart from "../components/charts/LiveLineChart";
import NotificationPanel from "../components/notifications/NotificationPanel";
import ThreatDetectionCard from "../components/security/ThreatDetectionCard";
import VoiceWaveAnimation from "../components/voice/VoiceWaveAnimation";
import SettingsModal from "../components/settings/SettingsModal";
import SmartCleanerPanel from "../components/dashboard/SmartCleanerPanel";
import ConversationPanel from "../components/ai/ConversationPanel";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard");

      const data = await res.json();

      console.log(data);

      setDashboardData(data);
    } catch (err) {
      console.log("Dashboard API Error:", err);
    }
  };

  // const [dashboardData, setDashboardData] = useState({
  //   ai_status: {},
  //   voice: {},
  //   notifications: [],
  //   threats: {},
  //   system: {},
  //   cleaner: {},
  //   conversation_history: [],
  // });

  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     try {
  //       const res = await fetch("http://127.0.0.1:8000/dashboard");

  //       const data = await res.json();

  //       setDashboardData(data);

  //       console.log(data);
  //     } catch (err) {
  //       console.log("Dashboard Error:", err);
  //     }
  //   };

  //   fetchDashboard();

  //   const interval = setInterval(fetchDashboard, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* SIDEBAR */}
      {/* <Sidebar /> */}

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
        }}
      >
        {/* TOP NAVBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: "bold",
              }}
            >
              OmniGuard AI Dashboard
            </h1>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "8px",
              }}
            >
              Intelligent System Monitoring & AI Control Center
            </p>
          </div>

          {/* STATUS */}
          <div
            style={{
              background: "#0f172a",
              padding: "14px 20px",
              borderRadius: "14px",
              border: "1px solid #1e293b",
            }}
          >
            🟢 System Active
          </div>
        </div>

        {/* SECOND ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* LEFT SECTION */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <VoiceWaveAnimation state={dashboardData?.ai_status?.state} />
            </div>
            <AIStatusPanel data={dashboardData?.ai_status} />
            <VoiceAssistant
              data={dashboardData?.voice}
              onUpdate={(newVoice) => {
                setDashboardData((prev) => ({
                  ...prev,
                  voice: newVoice,
                }));
              }}
            />
          </div>

          {/* RIGHT SECTION */}
          <div style={cardStyleLarge}>
            <NotificationPanel data={dashboardData?.notifications} />
          </div>
        </div>

        {/* THIRD ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div style={cardStyleLarge}>
            <LiveLineChart systemData={dashboardData?.system} />
          </div>

          <div style={cardStyleLarge}>
            <ThreatDetectionCard data={dashboardData?.threats} />
          </div>

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <div style={cardStyleLarge}>
              <SmartCleanerPanel data={dashboardData?.cleaner} />
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
            }}
          >
            <div style={cardStyleLarge}>
              <ConversationPanel data={dashboardData?.conversation_history} />
            </div>
          </div>
        </div>
      </div>

      <SettingsModal />
    </div>
  );
}

const cardStyle = {
  background: "#0f172a",
  borderRadius: "20px",
  padding: "25px",
  border: "1px solid #1e293b",
  minHeight: "130px",
  boxShadow: "0 0 20px rgba(59,130,246,0.08)",
};

const cardStyleLarge = {
  background: "#0f172a",
  borderRadius: "20px",
  padding: "25px",
  border: "1px solid #1e293b",
  minHeight: "300px",
  boxShadow: "0 0 20px rgba(59,130,246,0.08)",
};

export default DashboardPage;
