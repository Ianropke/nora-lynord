#!/bin/bash
# Generate remaining failed words using Wavenet voice as fallback
if [ -z "$GOOGLE_TTS_API_KEY" ]; then
  echo "Error: GOOGLE_TTS_API_KEY environment variable is not set."
  echo "Please set it, e.g.: export GOOGLE_TTS_API_KEY='your_api_key'"
  exit 1
fi
API_KEY="$GOOGLE_TTS_API_KEY"
VOICE="da-DK-Wavenet-F"
OUTPUT_DIR="public/audio"

WORDS=("ikke" "min" "vil" "her" "men" "dit" "os" "sin" "stor" "tid" "kat" "fisk" "vand" "blomst" "mad" "brød" "mor" "sang" "tegne" "farve" "tre" "fire" "ind" "nogen" "aldrig")

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
    echo "$body" | python3 -c "import sys,json,base64; d=json.load(sys.stdin); sys.stdout.buffer.write(base64.b64decode(d['audioContent']))" > "$outfile"
    count=$((count + 1))
    echo "[$count/$total] ✓ $word → $outfile"
  else
    count=$((count + 1))
    failed=$((failed + 1))
    echo "[$count/$total] ✗ FAILED $word (HTTP $http_code)"
  fi
  sleep 0.1
done

echo ""
echo "Done! Generated $((total - failed))/$total. Failed: $failed"
