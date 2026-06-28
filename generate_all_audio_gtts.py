#!/usr/bin/env python3
import os
import re
import json
import time
from gtts import gTTS

WORDS_FILE = "src/data/words.ts"
OUTPUT_DIR = "public/audio"

# Character mapping for filenames
CHAR_MAP = {
    "ø": "oe",
    "å": "aa",
    "æ": "ae"
}

def to_filename(word: str) -> str:
    return "".join(CHAR_MAP.get(c, c) for c in word)

def main():
    if not os.path.exists(WORDS_FILE):
        print(f"Error: {WORDS_FILE} not found!")
        return

    print("Reading words from src/data/words.ts...")
    with open(WORDS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract words using regex
    kanto_match = re.search(r"const kantoWords\s*=\s*(\[.*?\]);", content)
    johto_match = re.search(r"const johtoWords\s*=\s*(\[.*?\]);", content)
    hoenn_match = re.search(r"const hoennWords\s*=\s*(\[.*?\]);", content)

    if not (kanto_match and johto_match and hoenn_match):
        print("Error: Could not parse all word lists from words.ts!")
        return

    kanto_words = json.loads(kanto_match.group(1))
    johto_words = json.loads(johto_match.group(1))
    hoenn_words = json.loads(hoenn_match.group(1))

    # Combine all words and get unique ones to avoid duplicate TTS requests
    all_words = list(set(kanto_words + johto_words + hoenn_words))
    all_words.sort()

    print(f"Parsed {len(kanto_words)} Kanto words, {len(johto_words)} Johto words, and {len(hoenn_words)} Hoenn words.")
    print(f"Total unique words to generate: {len(all_words)}")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    success_count = 0
    total = len(all_words)

    for i, word in enumerate(all_words):
        filename = to_filename(word)
        outfile = os.path.join(OUTPUT_DIR, f"{filename}.mp3")

        # Log progress
        print(f"[{i+1}/{total}] Genererer lyd for: '{word}' -> {outfile}")

        try:
            # Generate TTS
            tts = gTTS(text=word, lang="da", slow=False)
            tts.save(outfile)
            success_count += 1
        except Exception as e:
            print(f"  ✗ FEJL ved '{word}': {e}")

        # Sleep briefly to be nice to Google's translation endpoint
        time.sleep(0.1)

    print(f"\nFærdig! Genererede {success_count} ud af {total} lydfiler succesfuldt.")

if __name__ == "__main__":
    main()
