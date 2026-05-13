import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";
import { sendMessage } from "../services/api";

const AIPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [tempText, setTempText] = useState("");

  const { chatId } = useParams();

  useEffect(() => {
    loadChat();
  }, [chatId]);

  const loadChat = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/chat/${chatId}`);

      if (res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatText = (text) => {
    return text.replace(/\. /g, ".\n\n").replace(/:\s/g, ":\n").trim();
  };

  const chatRef = useRef();

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  // for better ui
  const typeMessage = async (fullText) => {
    const formatted = formatText(fullText);

    let current = "";

    // add empty AI message first
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        sender: "OmniGuard AI",
        text: "",
        typing: true,
        time: getCurrentTime(),
      },
    ]);

    for (let i = 0; i < formatted.length; i++) {
      current += formatted[i];

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          sender: "OmniGuard AI",
          text: current,
          time: getCurrentTime(),
        };
        return updated;
      });

      await new Promise((res) => setTimeout(res, 8)); // speed control
    }

    // remove cursor at end
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "ai",
        text: formatted,
      };
      return updated;
    });
  };

  // 💬 Send Message
  const handleSend = async (voice = false, customInput = null) => {
    const messageText = customInput || input;

    if (!messageText.trim()) return;

    const userMsg = {
      role: "user",
      sender: "User",
      text: messageText,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setThinking(true);

    try {
      const res = await sendMessage(messageText);
      console.log("res:", res);

      // const aiText = res?.response || "No response from AI";
      const aiText =
        res?.status === "success" ? res.response : "AI not available right now";

      await typeMessage(aiText);
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
    <div style={{ display: "flex", flexDirection: "column", height: "98vh" }}>
      {/* <h1>🚀 Smart Laptop Analyzer + Cyber Guard</h1> */}
      {/* HEADER */}
      <div
        style={{
          padding: "10px 20px",
          fontSize: "30px",
          fontWeight: "bold",
          borderBottom: "1px solid #1f2937",
        }}
      >
        🤖 Smart AI Assistant
      </div>

      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#020617",
        }}
      >
        {messages.length === 0 ? (
          // ================= EMPTY STATE =================
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#9ca3af",
              fontSize: "26px",
              fontWeight: "500",
            }}
          >
            Ready when you are.
          </div>
        ) : (
          // ================= CHAT =================
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  minWidth: "220px",
                  padding: "14px 16px",
                  borderRadius: "18px",

                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "#0f172a",

                  border: msg.role === "ai" ? "1px solid #1e293b" : "none",

                  color: "white",

                  boxShadow: "0 4px 20px rgba(0,0,0,0.35)",

                  position: "relative",
                }}
              >
                {/* TOP LEFT SENDER */}
                <div
                  style={{
                    fontSize: "13px",
                    color: msg.role === "user" ? "#dbeafe" : "#cbd5e1",

                    marginBottom: "12px",

                    display: "flex",
                    alignItems: "center",
                    gap: "6px",

                    fontWeight: "500",
                    opacity: "0.8",
                  }}
                >
                  {msg.role === "user" ? "👤 User" : "🤖 OmniGuard AI"}
                </div>

                {/* MESSAGE */}
                <div
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.7",
                    wordBreak: "break-word",
                    paddingBottom: "20px",
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

                {/* BOTTOM RIGHT TIME */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "14px",

                    fontSize: "11px",
                    opacity: "0.8",

                    color: msg.role === "user" ? "#dbeafe" : "#94a3b8",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))
        )}

        {/* 🤖 Thinking */}
        {thinking && (
          <div
            style={{
              color: "#9ca3af",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            🤖 AI is thinking...
          </div>
        )}

        {/* ANIMATION */}
        <style>
          {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }
        `}
        </style>
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !thinking) {
              e.preventDefault();
              handleSend(false);
            }
          }}
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

const chat_placeholder = {
  width: "100%",
  marginTop: "15%",
  opacity: "0.8",
  textAlign: "center",
};

export default AIPage;
