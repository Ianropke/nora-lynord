#!/bin/bash
# Generate 120 Danish word audio files using Google Cloud TTS Chirp3-HD
if [ -z "$GOOGLE_TTS_API_KEY" ]; then
  echo "Error: GOOGLE_TTS_API_KEY environment variable is not set."
  echo "Please set it, e.g.: export GOOGLE_TTS_API_KEY='your_api_key'"
  exit 1
fi
API_KEY="$GOOGLE_TTS_API_KEY"
VOICE="da-DK-Chirp3-HD-Achernar"
OUTPUT_DIR="public/audio"

WORDS=(
  "jeg" "er" "en" "det" "du" "og" "kan" "vi" "har" "den"
  "ikke" "på" "at" "med" "min" "han" "hun" "til" "der" "fra"
  "vil" "skal" "så" "om" "her" "alle" "men" "nu" "kom" "se"
  "for" "var" "sig" "hvad" "hvor" "når" "dit" "os" "dem" "sin"
  "glad" "god" "stor" "lille" "dag" "tid" "igen" "hen" "godt" "af"
  "hund" "kat" "fugl" "fisk" "sol" "vand" "træ" "blomst" "regn" "sne"
  "mad" "brød" "mælk" "hus" "hjem" "bog" "barn" "mor" "far" "ven"
  "skole" "leg" "bold" "bil" "spil" "sang" "dans" "tegne" "farve" "lys"
  "hånd" "fod" "øje" "mund" "hoved" "ben" "arm" "næse" "øre" "hår"
  "en" "to" "tre" "fire" "fem" "op" "ned" "ud" "ind" "over"
  "gå" "løbe" "spise" "sove" "lege" "læse" "skrive" "synge" "hoppe" "sidde"
  "fordi" "også" "mange" "nogen" "mellem" "efter" "under" "hele" "sammen" "aldrig"
)

count=0
total=${#WORDS[@]}
failed=0

for word in "${WORDS[@]}"; do
  # Use word as filename, handle special chars
  filename=$(echo "$word" | sed 's/ø/oe/g; s/å/aa/g; s/æ/ae/g')
  outfile="$OUTPUT_DIR/${filename}.mp3"

  # Skip if already generated
  if [ -f "$outfile" ]; then
    count=$((count + 1))
    echo "[$count/$total] SKIP $word (already exists)"
    continue
  fi

  # Call Google Cloud TTS
  response=$(curl -s -w "\n%{http_code}" \
    "https://texttospeech.googleapis.com/v1/text:synthesize?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"input\": {\"text\": \"$word\"},
      \"voice\": {\"languageCode\": \"da-DK\", \"name\": \"$VOICE\"},
      \"audioConfig\": {\"audioEncoding\": \"MP3\", \"speakingRate\": 0.9}
    }")

  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    # Extract base64 audio and decode
    echo "$body" | python3 -c "import sys,json,base64; d=json.load(sys.stdin); sys.stdout.buffer.write(base64.b64decode(d['audioContent']))" > "$outfile"
    count=$((count + 1))
    echo "[$count/$total] ✓ $word → $outfile"
  else
    count=$((count + 1))
    failed=$((failed + 1))
    echo "[$count/$total] ✗ FAILED $word (HTTP $http_code)"
    echo "$body" | head -3
  fi

  # Small delay to be nice to the API
  sleep 0.1
done

echo ""
echo "Done! Generated $((total - failed))/$total files. Failed: $failed"
