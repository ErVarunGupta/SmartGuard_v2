import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import speech_recognition as sr
import pyttsx3
import time
import threading
import socket
import queue
import json
from vosk import Model, KaldiRecognizer

from services.jarvis_brain import jarvis_brain
from services.runtime_state import runtime_state


# =========================
# CONFIG
# =========================
SAMPLE_RATE = 48000
DURATION = 5
MODEL_PATH = "models/vosk-model-small-en-us-0.15"

sd.default.device = None

# =========================
# GLOBAL STATE
# =========================
is_speaking = False
q = queue.Queue()

# =========================
# LOAD MODEL
# =========================
model = Model(MODEL_PATH)


# =========================
# AUDIO CALLBACK
# =========================
def audio_callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(bytes(indata))


# =========================
# SPEAK FUNCTION
# =========================
def speak(text):
    if runtime_state["mute"]:
        return

    if not runtime_state["speak"]:
        return
    global is_speaking
    is_speaking = True

    clean = text.replace("groq:", "").replace("gemini:", "").replace("ollama:", "").replace("rule:", "")
    print("Omni:", clean)

    try:
        runtime_state["speak"] = True
        engine = pyttsx3.init()
        engine.setProperty('rate', 170)
        engine.say(clean)
        engine.runAndWait()
        engine.stop()
    except Exception as e:
        print("TTS Error:", e)
    finally:
        is_speaking = False
        runtime_state["speak"] = False


# =========================
# INTERNET CHECK
# =========================
def is_internet():
    try:
        
        socket.create_connection(("8.8.8.8", 53), timeout=1)
        return True
    except:
        return False


# =========================
# ONLINE LISTEN (GOOGLE)
# =========================
def listen_online():
    try:
        print("🎤 Listening (online)...")
        runtime_state["online_mode"] = is_internet()

        rec = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
        sd.wait()

        volume = np.max(np.abs(rec))
        print("🔊 Volume:", volume)

        if volume < 1000:
            return None

        write("temp.wav", SAMPLE_RATE, rec)

        r = sr.Recognizer()
        with sr.AudioFile("temp.wav") as src:
            audio = r.record(src)

        return r.recognize_google(audio).lower()

    except Exception as e:
        print("❌ Online STT error:", e)
        return None


# =========================
# OFFLINE LISTEN (VOSK)
# =========================
def listen_offline():
    print("🎤 Listening (offline)...")

    recognizer_local = KaldiRecognizer(model, 16000)

    with sd.RawInputStream(
        samplerate=16000,
        blocksize=8000,
        dtype="int16",
        channels=1,
        callback=audio_callback
    ):
        while True:
            if runtime_state["mute"]:
                runtime_state["ai_state"] = "Muted"
                time.sleep(1)
                continue

            if not runtime_state["wake_word"]:
                runtime_state["ai_state"] = "Wake Word Disabled"
                time.sleep(1)
                continue

            if not runtime_state["mic"]:
                runtime_state["ai_state"] = "Mic Off"
                time.sleep(1)
                continue
            data = q.get()

            if recognizer_local.AcceptWaveform(data):
                result = json.loads(recognizer_local.Result())
                text = result.get("text", "")

                if text:
                    print("👂 Heard:", text)
                    return text


# =========================
# HYBRID LISTEN
# =========================
def listen():
    if runtime_state["mute"]:
        return None

    if not runtime_state["mic"]:
        return None
    if is_internet():
        text = listen_online()

        if text:
            return text

        print("⚠️ Fallback to offline...")
        return listen_offline()
    else:
        return listen_offline()


# =========================
# WAKE WORD LISTENER
# =========================
WAKE_WORDS = ["omni", "omny", "only", "army", "omini", "mini"]

def wait_for_wake_word():
    print("👂 Waiting for wake word: 'omni'...")

    WAKE_WORDS = ["omni", "omny", "only", "army", "mini", "omini"]

    # 🌐 ONLINE MODE (Google)
    if is_internet():
        print("🌐 Wake word via Google")

        while True:
            if runtime_state["mute"]:
                runtime_state["ai_state"] = "Muted"
                time.sleep(1)
                continue

            if not runtime_state["wake_word"]:
                runtime_state["ai_state"] = "Wake Word Disabled"
                time.sleep(1)
                continue

            if not runtime_state["mic"]:
                runtime_state["ai_state"] = "Mic Off"
                time.sleep(1)
                continue
            if is_speaking:
                continue

            text = listen_online()

            if text:
                print("🧠 Heard (online wake):", text)

                if any(word in text for word in WAKE_WORDS):
                    print("✅ Wake word detected!")
                    speak("Yes?")
                    return

    # 🔌 OFFLINE MODE (Vosk)
    else:
        print("🔌 Wake word via Vosk")

        recognizer_local = KaldiRecognizer(model, 16000)

        with sd.RawInputStream(
            samplerate=16000,
            blocksize=8000,
            dtype="int16",
            channels=1,
            callback=audio_callback
        ):
            while True:
                if is_speaking:
                    continue

                data = q.get()

                if recognizer_local.AcceptWaveform(data):
                    result = json.loads(recognizer_local.Result())
                    text = result.get("text", "").lower()

                    if text:
                        print("🧠 Heard (offline wake):", text)

                        if any(word in text for word in WAKE_WORDS):
                            print("✅ Wake word detected!")
                            speak("Yes, sir")
                            return


# =========================
# MAIN LOOP
# =========================
def start_jarvis():
    print("🔥 Omni started")
    speak("Omni activated and ready")
    runtime_state["mic"] = True

    while True:
        # 💤 WAIT FOR WAKE WORD
        wait_for_wake_word()

        runtime_state["ai_state"] = "Listening"

        # 🎤 LISTEN COMMAND
        text = listen()

        if not text:
            continue

        print("👂 Command:", text)

        runtime_state["ai_state"] = "Processing"

        # 🧠 PROCESS
        response = jarvis_brain(text)

        runtime_state["ai_state"] = "Speaking"

        # 🔊 SPEAK
        speak(response)

        runtime_state["ai_state"] = "Idle"

        if runtime_state["mute"]:
            runtime_state["ai_state"] = "Muted"
            time.sleep(1)
            continue

        # 💤 BACK TO SLEEP
        time.sleep(1)