/**
 * Maps each Danish word to its audio filename.
 * Special characters are transliterated: ø→oe, å→aa, æ→ae
 */

const charMap: Record<string, string> = {
  ø: "oe",
  å: "aa",
  æ: "ae",
};

function toFilename(word: string): string {
  return word
    .split("")
    .map((c) => charMap[c] ?? c)
    .join("");
}

// Audio cache to avoid re-creating Audio objects
const audioCache = new Map<string, HTMLAudioElement>();

let audioContextInitialized = false;

function initAudioContext() {
  if (audioContextInitialized) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    audioContextInitialized = true;
  } catch {
    // Silently fail
  }
}

/**
 * Play a pre-generated audio file for a Danish word.
 * Falls back to Web Speech API if the file fails to load.
 */
export function playWord(word: string, onEnd?: () => void): void {
  initAudioContext();

  const filename = toFilename(word);
  const url = `/audio/${filename}.mp3`;

  let audio = audioCache.get(word);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = "auto";
    audioCache.set(word, audio);
  }

  // Reset if previously played
  audio.currentTime = 0;

  const handleEnd = () => {
    onEnd?.();
    audio!.removeEventListener("ended", handleEnd);
    audio!.removeEventListener("error", handleError);
  };

  const handleError = () => {
    // Fallback to browser TTS
    console.warn(`Audio file not found for "${word}", falling back to TTS`);
    speakFallback(word, onEnd);
    audio!.removeEventListener("ended", handleEnd);
    audio!.removeEventListener("error", handleError);
  };

  audio.addEventListener("ended", handleEnd);
  audio.addEventListener("error", handleError);

  audio.play().catch(() => {
    // Play failed (e.g. user hasn't interacted yet), fallback
    speakFallback(word, onEnd);
  });
}

/**
 * Stop any currently playing audio.
 */
export function stopAudio(): void {
  audioCache.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Preload audio files for a list of words.
 */
export function preloadWords(words: string[]): void {
  words.forEach((word) => {
    if (!audioCache.has(word)) {
      const filename = toFilename(word);
      const audio = new Audio(`/audio/${filename}.mp3`);
      audio.preload = "auto";
      audioCache.set(word, audio);
    }
  });
}

/**
 * Fallback: use browser's SpeechSynthesis API
 */
function speakFallback(text: string, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "da-DK";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const danishVoice = voices.find((v) => v.lang.startsWith("da"));
  if (danishVoice) utterance.voice = danishVoice;

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}
