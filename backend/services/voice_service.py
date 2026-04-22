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

SAMPLE_RATE = 48000
DURATION = 3
sd.default.device = None


engine = None
engine_lock = threading.Lock()


# =========================
# SPEAK FUNCTION
# =========================
def speak(text):
    clean = text.replace("groq:", "").replace("gemini:", "").replace("ollama:", "").replace("rule:", "")

    print("Jarvis:", clean)

    try:
        engine = pyttsx3.init()   
        engine.setProperty('rate', 170)
        engine.say(clean)
        engine.runAndWait()
        engine.stop()             
    except Exception as e:
        print("TTS Error:", e)  




def is_internet():
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=1)
        return True
    except:
        return False



def listen_online():
    try:
        # time.sleep(0.3)
        print("🎤 Listening...")
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
        print("❌ Listen error:", e)
        return None


# =========================
# vosk model for offline listening
# ===================================

# =========================
# LOAD MODEL (DO THIS ONCE)
# =========================
MODEL_PATH = "models/vosk-model-small-en-us-0.15"

model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model, 16000)

q = queue.Queue()

def audio_callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(bytes(indata))

# =========================
# OFFLINE LISTEN FUNCTION
# =========================
def listen_offline():
    print("🎤 Listening (offline)...")

    with sd.RawInputStream(
        samplerate=16000,
        blocksize=8000,
        dtype="int16",
        channels=1,
        callback=audio_callback
    ):
        while True:
            data = q.get()

            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                text = result.get("text", "")

                if text:
                    print("👂 Heard:", text)
                    return text
                
def listen():
    if is_internet():
        print("🌐 Using Google STT")
        text = listen_online()

        if text:
            return text

        print("⚠️ Fallback to offline")
        return listen_offline()
    else:
        print("🔌 Offline mode")
        return listen_offline()


def start_jarvis():
    print("🔥 Jarvis thread started")
    speak("Jarvis activated and ready")

    while True:
        text = listen()
        if not text:
            continue

        print("👂 Heard:", text)

        response = jarvis_brain(text)
        speak(response)

        # release_audio()    

        time.sleep(1.3) 
