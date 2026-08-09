/** Centralised audio playback for Danish word games. */

const charMap: Record<string, string> = { ø: "oe", å: "aa", æ: "ae" };
const audioCache = new Map<string, HTMLAudioElement>();
let playbackId = 0;

export function toFilename(word: string): string {
  return word.toLocaleLowerCase("da-DK").split("").map(c => charMap[c] ?? c).join("");
}

function getAudio(word: string): HTMLAudioElement {
  const cached = audioCache.get(word);
  if (cached) return cached;
  const audio = new Audio(`/audio/${toFilename(word)}.mp3`);
  audio.preload = "auto";
  audioCache.set(word, audio);
  return audio;
}

function speakFallback(text: string, id: number, onEnd?: () => void): void {
  if (!("speechSynthesis" in window)) { if (id === playbackId) onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "da-DK";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith("da"));
  if (voice) utterance.voice = voice;
  utterance.onend = () => { if (id === playbackId) onEnd?.(); };
  utterance.onerror = () => { if (id === playbackId) onEnd?.(); };
  window.speechSynthesis.speak(utterance);
}

export function playWord(word: string, onEnd?: () => void): void {
  if (!word) return;
  const id = ++playbackId;
  const audio = getAudio(word);
  audio.pause();
  audio.currentTime = 0;

  const cleanup = () => {
    audio.removeEventListener("ended", handleEnd);
    audio.removeEventListener("error", handleError);
  };
  const handleEnd = () => { cleanup(); if (id === playbackId) onEnd?.(); };
  const handleError = () => { cleanup(); if (id === playbackId) speakFallback(word, id, onEnd); };

  audio.addEventListener("ended", handleEnd, { once: true });
  audio.addEventListener("error", handleError, { once: true });
  audio.play().catch(() => {
    cleanup();
    if (id === playbackId) speakFallback(word, id, onEnd);
  });
}

export function playFeedback(kind: "correct" | "wrong", onEnd?: () => void): void {
  const id = ++playbackId;
  const audio = getAudio(`__feedback_${kind}`);
  audio.src = `/audio/${kind}.mp3`;
  audio.pause();
  audio.currentTime = 0;
  const cleanup = () => { audio.onended = null; audio.onerror = null; };
  audio.onended = () => { cleanup(); if (id === playbackId) onEnd?.(); };
  audio.onerror = () => { cleanup(); if (id === playbackId) onEnd?.(); };
  audio.play().catch(() => { cleanup(); if (id === playbackId) onEnd?.(); });
}

export function stopAudio(): void {
  ++playbackId;
  audioCache.forEach(audio => { audio.pause(); audio.currentTime = 0; });
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function preloadWords(words: string[]): void {
  words.forEach(word => { if (word && !audioCache.has(word)) void getAudio(word); });
}
