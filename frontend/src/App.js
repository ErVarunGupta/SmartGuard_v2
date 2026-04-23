import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import SystemPage from "./pages/SystemPage";
import AIPage from "./pages/AIPage";
import IDSPage from "./pages/IDSPage";
import CleanerPage from "./pages/CleanerPage";

function App() {
  const [page, setPage] = useState("system");

  return (
    <div style={{ display : "flex" }}>
      <Sidebar setPage={setPage} page={page} />

      <div style={dashboard}>
        {page === "system" && <SystemPage />}
        {page === "ai" && <AIPage />}
        {page === "ids" && <IDSPage />}
        {page === "cleaner" && <CleanerPage />}
      </div>
    </div>
  );
}


const dashboard  = {
  flex: 1, 
  padding: "0px 20px",
  marginLeft: "15rem"
}

export default App;
