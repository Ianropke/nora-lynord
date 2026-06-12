#!/usr/bin/env python3
"""Regenerate all 120 Danish word audio files with Neural2-F + SSML."""
import json, base64, urllib.request, os, time, sys

API_KEY = os.environ.get("GOOGLE_TTS_API_KEY")
if not API_KEY:
    print("Error: GOOGLE_TTS_API_KEY environment variable is not set.")
    print("Please set it in your terminal, e.g.: export GOOGLE_TTS_API_KEY='your_api_key'")
    sys.exit(1)

VOICE = "da-DK-Neural2-F"
OUTPUT_DIR = "public/audio"
URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}"

WORDS = [
    "jeg", "er", "en", "det", "du", "og", "kan", "vi", "har", "den",
    "ikke", "på", "at", "med", "min", "han", "hun", "til", "der", "fra",
    "vil", "skal", "så", "om", "her", "alle", "men", "nu", "kom", "se",
    "for", "var", "sig", "hvad", "hvor", "når", "dit", "os", "dem", "sin",
    "glad", "god", "stor", "lille", "dag", "tid", "igen", "hen", "godt", "af",
    "hund", "kat", "fugl", "fisk", "sol", "vand", "træ", "blomst", "regn", "sne",
    "mad", "brød", "mælk", "hus", "hjem", "bog", "barn", "mor", "far", "ven",
    "skole", "leg", "bold", "bil", "spil", "sang", "dans", "tegne", "farve", "lys",
    "hånd", "fod", "øje", "mund", "hoved", "ben", "arm", "næse", "øre", "hår",
    "to", "tre", "fire", "fem", "op", "ned", "ud", "ind", "over",
    "gå", "løbe", "spise", "sove", "lege", "læse", "skrive", "synge", "hoppe", "sidde",
    "fordi", "også", "mange", "nogen", "mellem", "efter", "under", "hele", "sammen", "aldrig",
]

CHAR_MAP = {"ø": "oe", "å": "aa", "æ": "ae"}

def to_filename(word: str) -> str:
    return "".join(CHAR_MAP.get(c, c) for c in word)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Clean old files
for f in os.listdir(OUTPUT_DIR):
    if f.endswith(".mp3"):
        os.remove(os.path.join(OUTPUT_DIR, f))

failed = []
total = len(WORDS)

for i, word in enumerate(WORDS):
    filename = to_filename(word)
    outfile = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
    
    # SSML for better pronunciation
    ssml = f'<speak><prosody rate="85%">{word}.</prosody></speak>'
    
    payload = json.dumps({
        "input": {"ssml": ssml},
        "voice": {"languageCode": "da-DK", "name": VOICE},
        "audioConfig": {"audioEncoding": "MP3"}
    }).encode("utf-8")
    
    req = urllib.request.Request(URL, data=payload, headers={"Content-Type": "application/json"})
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            audio = base64.b64decode(data["audioContent"])
            with open(outfile, "wb") as f:
                f.write(audio)
            print(f"[{i+1}/{total}] ✓ {word} → {outfile} ({len(audio)} bytes)")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        try:
            msg = json.loads(error_body).get("error", {}).get("message", "")
        except:
            msg = error_body[:100]
        print(f"[{i+1}/{total}] ✗ {word} (HTTP {e.code}): {msg}")
        failed.append(word)
    except Exception as e:
        print(f"[{i+1}/{total}] ✗ {word}: {e}")
        failed.append(word)
    
    time.sleep(0.12)

print(f"\nDone! {total - len(failed)}/{total} succeeded.")
if failed:
    print(f"Failed: {', '.join(failed)}")
