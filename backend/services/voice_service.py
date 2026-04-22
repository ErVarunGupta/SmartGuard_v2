import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import speech_recognition as sr
import pyttsx3
import time
import threading

from services.jarvis_brain import jarvis_brain

SAMPLE_RATE = 48000
DURATION = 3
sd.default.device = None


engine = None
engine_lock = threading.Lock()

# def init_engine():
#     global engine
#     if engine is None:
#         engine = pyttsx3.init()
#         engine.setProperty('rate', 170)

# def speak(text: str):
#     def run():
#         global engine
#         with engine_lock:
#             try:
#                 init_engine()
#                 engine.say(text)
#                 engine.runAndWait()
#             except Exception as e:
#                 print("TTS Error:", e)

#     threading.Thread(target=run, daemon=True).start()


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


# def release_audio():
#     try:
#         sd.stop()
#     except:
#         pass


def listen():
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
