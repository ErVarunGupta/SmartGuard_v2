// import React, { useState } from "react";
// import Sidebar from "./components/common/Sidebar";
// import SystemPage from "./pages/SystemPage";
// import AIPage from "./pages/AIPage";
// import IDSPage from "./pages/IDSPage";
// import CleanerPage from "./pages/CleanerPage";
// import DashboardPage from "./pages/DashboardPage";

// function App() {
//   const [page, setPage] = useState("dashboard");

//   return (
//     <div style={{ display : "flex" }}>
//       <Sidebar setPage={setPage} page={page} />

//       <div style={dashboard}>
//         {page === "dashboard" && <DashboardPage />}
//         {page === "system" && <SystemPage />}
//         {page === "ai" && <AIPage />}
//         {page === "ids" && <IDSPage />}
//         {page === "cleaner" && <CleanerPage />}
//       </div>
//     </div>
//   );
// }


// const dashboard  = {
//   flex: 1, 
//   padding: "0px 20px",
//   marginLeft: "15rem"
// }

// export default App;




import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import SystemPage from "./pages/SystemPage";
import AIPage from "./pages/AIPage";
import IDSPage from "./pages/IDSPage";
import CleanerPage from "./pages/CleanerPage";


function App() {

  return (

    <BrowserRouter>

      <div
        style={{
          display: "flex",
          background: "#020617",
          minHeight: "100vh",
        }}
      >

        {/* SIDEBAR */}

        <Sidebar />


        {/* MAIN CONTENT */}

        <div style={dashboardStyle}>

          <Routes>

            {/* DEFAULT */}

            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />


            {/* DASHBOARD */}

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />


            {/* SYSTEM MONITOR */}

            <Route
              path="/system"
              element={<SystemPage />}
            />


            {/* AI ASSISTANT */}

            <Route
              path="/ai"
              element={<AIPage />}
            />


            {/* AI CHAT SESSION */}

            <Route
              path="/ai-assistant/:chatId"
              element={<AIPage />}
            />


            {/* IDS / IPS */}

            <Route
              path="/ids"
              element={<IDSPage />}
            />


            {/* CLEANER */}

            <Route
              path="/cleaner"
              element={<CleanerPage />}
            />

          </Routes>

        </div>
      </div>

    </BrowserRouter>
  );
}


const dashboardStyle = {

  flex: 1,

  padding: "0px 20px",

  marginLeft: "15rem",

  overflowX: "hidden",
};


export default App;