import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/api";

const AIPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [tempText, setTempText] = useState(""); // 🔥 new

  const chatRef = useRef();

  // 🔽 Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, thinking]);

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    // 🎤 START
    if (!listening) {
      const recog = new SpeechRecognition();

      recog.lang = "en-IN";
      recog.continuous = true;
      recog.interimResults = true;

      let finalText = "";

      recog.onstart = () => {
        console.log("🎤 Listening...");
        setListening(true);
        setVoiceText("");
        setTempText("");
      };

      recog.onresult = (event) => {
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        setVoiceText(finalText);
        setTempText(interim);
      };

      recog.onerror = (e) => {
        console.log("Speech error:", e.error);
        setListening(false);
      };

      recog.start();
      setRecognition(recog);
    }

    // 🛑 STOP + SEND
    else {
      if (recognition) {
        recognition.stop();
      }

      setListening(false);

      const finalMessage = (voiceText + " " + tempText).trim();

      console.log("FINAL TEXT:", finalMessage);

      if (finalMessage) {
        handleSend(true, finalMessage);
      } else {
        alert("⚠️ No speech detected. Try again.");
      }

      setVoiceText("");
      setTempText("");
    }
  };

  // 🔊 Voice Output
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 💬 Send Message
  const handleSend = async (voice = false, customInput = null) => {
    const messageText = customInput || input;

    if (!messageText.trim()) return;

    const userMsg = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);

    setThinking(true);

    try {
      const res = await sendMessage(messageText);

      // const aiText = res?.response || "No response from AI";
      const aiText =
        res?.status === "success"
          ? res.response
          : "AI not available right now";

      const aiMsg = { role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMsg]);

      // 🔊 Speak only for voice
      if (voice) {
        speak(aiText);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "AI error. Try again." },
      ]);
    }

    setThinking(false);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* <h1>🚀 Smart Laptop Analyzer + Cyber Guard</h1> */}
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          fontSize: "30px",
          fontWeight: "bold",
          borderBottom: "1px solid #1f2937",
        }}
      >
        🤖 Smart AI Assistant
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#020617",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                maxWidth: "60%",
                padding: "14px 18px",
                borderRadius: "18px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "#0f172a",
                border: msg.role === "ai" ? "1px solid #1e293b" : "none",
                color: "white",
                fontSize: "18px",
                lineHeight: "2",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {msg.text.split("\n").map((line, index) => {
                if (line.toLowerCase().includes("problem"))
                  return <b key={index}>🚨 {line}</b>;
                if (line.toLowerCase().includes("analysis"))
                  return <b key={index}>📊 {line}</b>;
                if (line.toLowerCase().includes("solution"))
                  return <b key={index}>🛠️ {line}</b>;

                return <div key={index}>{line}</div>;
              })}
            </div>
          </div>
        ))}

        {/* 🤖 Thinking */}
        {thinking && (
          <div style={{ color: "#9ca3af", marginTop: "10px" }}>
            🤖 AI is thinking...
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div
        style={{
          display: "flex",
          padding: "12px",
          background: "#020617",
          borderTop: "1px solid #1f2937",
        }}
      >
        <input
          value={listening ? voiceText + tempText : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Smart AI..."
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #1f2937",
            background: "#0f172a",
            color: "white",
            fontSize: "1rem",
          }}
        />

        {/* SEND */}
        <button
          onClick={() => handleSend(false)}
          style={{
            marginLeft: "10px",
            padding: "12px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          ➤
        </button>

        {/* MIC */}
        <button
          onClick={handleMicClick}
          style={{
            marginLeft: "10px",
            padding: "12px 16px",
            background: listening ? "#ef4444" : "#3b82f6",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          {listening ? "⏹️ Stop" : "🎤"}
        </button>
      </div>
    </div>
  );
};

export default AIPage;
