#!/bin/bash
# Regenerate ALL 120 words with Neural2-F + SSML for better Danish pronunciation
if [ -z "$GOOGLE_TTS_API_KEY" ]; then
  echo "Error: GOOGLE_TTS_API_KEY environment variable is not set."
  echo "Please set it, e.g.: export GOOGLE_TTS_API_KEY='your_api_key'"
  exit 1
fi
API_KEY="$GOOGLE_TTS_API_KEY"
VOICE="da-DK-Neural2-F"
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
  "to" "tre" "fire" "fem" "op" "ned" "ud" "ind" "over"
  "gå" "løbe" "spise" "sove" "lege" "læse" "skrive" "synge" "hoppe" "sidde"
  "fordi" "også" "mange" "nogen" "mellem" "efter" "under" "hele" "sammen" "aldrig"
)

# Remove old files
rm -f "$OUTPUT_DIR"/*.mp3

count=0
total=${#WORDS[@]}
failed=0

for word in "${WORDS[@]}"; do
  filename=$(echo "$word" | sed 's/ø/oe/g; s/å/aa/g; s/æ/ae/g')
  outfile="$OUTPUT_DIR/${filename}.mp3"

  if [ -f "$outfile" ]; then
    count=$((count + 1))
    echo "[$count/$total] SKIP $word"
    continue
  fi

  # Use SSML for better pronunciation - slower rate, slight pause after
  ssml="<speak><prosody rate=\"85%\">${word}.</prosody></speak>"

  response=$(curl -s -w "\n%{http_code}" \
    "https://texttospeech.googleapis.com/v1/text:synthesize?key=$API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"input\": {\"ssml\": \"$ssml\"},
      \"voice\": {\"languageCode\": \"da-DK\", \"name\": \"$VOICE\"},
      \"audioConfig\": {\"audioEncoding\": \"MP3\"}
    }")

  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "200" ]; then
    echo "$body" | python3 -c "import sys,json,base64; d=json.load(sys.stdin); sys.stdout.buffer.write(base64.b64decode(d['audioContent']))" > "$outfile"
    count=$((count + 1))
    echo "[$count/$total] ✓ $word → $outfile"
  else
    count=$((count + 1))
    failed=$((failed + 1))
    echo "[$count/$total] ✗ FAILED $word (HTTP $http_code)"
    # Extract error message
    echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message',''))" 2>/dev/null
  fi
  sleep 0.15
done

echo ""
echo "Done! Generated $((total - failed))/$total files. Failed: $failed"
