const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const axios = require("axios");
const fs = require("fs");

let mainWindow;
let backendProcess;

// ================= BACKEND START =================
function startBackend() {
  let backendPath;

  if (app.isPackaged) {
    backendPath = path.join(process.resourcesPath, "backend", "main.exe");
  } else {
    backendPath = path.join(__dirname, "backend", "dist", "main.exe");
  }

  console.log("Backend Path:", backendPath);

  if (!fs.existsSync(backendPath)) {
    console.error("❌ Backend EXE not found");
    return false;
  }

  backendProcess = spawn(backendPath, [], {
    windowsHide: true,
  });

  backendProcess.on("error", (err) => {
    console.error("Backend start error:", err);
  });

  backendProcess.on("exit", (code) => {
    console.log("Backend exited:", code);
  });

  return true;
}

// ================= WAIT FOR BACKEND =================
async function waitForBackend() {
  const MAX_RETRIES = 30; // 🔥 increase time (30 sec)

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // const res = await axios.get("http://127.0.0.1:8000/metrics");
      const res = await axios.get("http://127.0.0.1:8000/health");

      if (res.status === 200) {
        console.log("✅ Backend ready");
        return true;
      }
    } catch (err) {
      console.log(`⏳ Waiting backend... ${i + 1}`);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  return false;
}

// ================= CREATE WINDOW =================
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
}

// ================= APP START =================
app.whenReady().then(async () => {
  console.log("🚀 Starting backend...");

  const started = startBackend();

  if (!started) {
    dialog.showErrorBox("Error", "Backend not found");
    app.quit();
    return;
  }

  console.log("⏳ Waiting for backend...");
  const ready = await waitForBackend();

  if (!ready) {
    dialog.showErrorBox("Startup Error", "Backend failed to start");
    app.quit();
    return;
  }

  console.log("✅ Launching UI...");
  createWindow();
});

// ================= CLOSE HANDLING =================
app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
