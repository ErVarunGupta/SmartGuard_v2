const BASE_URL = "http://127.0.0.1:8000";

// 🔥 COMMON SAFE FETCH FUNCTION
const safeFetch = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 sec timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("Server error");

    return await res.json();
  } catch (err) {
    console.error("API Error:", err.message);

    return {
      error: true,
      message: "Backend not running",
    };
  }
};

// =========================
// TEST API
// =========================
export const testAPI = () => {
  return safeFetch(BASE_URL);
};

// =========================
// SYSTEM METRICS
// =========================
export const getMetrics = () => {
  return safeFetch(`${BASE_URL}/metrics`);
};

// =========================
// KILL PROCESS
// =========================
export const killProcess = (pid) => {
  return safeFetch(`${BASE_URL}/kill-process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pid }),
  });
};

// =========================
// AI CHAT
// =========================
export const sendMessage = (message) => {
  return safeFetch(`${BASE_URL}/ai-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
};

// =========================
// IDS APIs
// =========================
export const getIDSLogs = () => {
  return safeFetch(`${BASE_URL}/ids-logs`);
};

export const getIDSStats = () => {
  return safeFetch(`${BASE_URL}/ids-stats`);
};

export const blockIP = (ip) => {
  return safeFetch(`${BASE_URL}/block-ip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip }),
  });
};