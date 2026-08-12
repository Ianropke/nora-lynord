import '@testing-library/jest-dom';
import '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock AudioContext
class MockAudioContext {
  createBuffer() {
    return {};
  }
  createBufferSource() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
    };
  }
  destination = {};
}
Object.defineProperty(window, 'AudioContext', { value: MockAudioContext });
Object.defineProperty(window, 'webkitAudioContext', { value: MockAudioContext });

// Mock HTMLAudioElement
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();

// Mock SpeechSynthesis
const mockSpeechSynthesis = {
  speak: vi.fn((utterance) => {
    // Simulate immediately finishing speaking
    setTimeout(() => {
      if (utterance.onend) utterance.onend(new Event('end'));
    }, 10);
  }),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([{ lang: 'da-DK', name: 'Danish' }]),
};
class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = '';
  rate: number = 1;
  pitch: number = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}
Object.defineProperty(window, 'speechSynthesis', { value: mockSpeechSynthesis });
Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: MockSpeechSynthesisUtterance });

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
