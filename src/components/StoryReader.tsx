import { ArrowLeft, Check, Volume2, Star } from "lucide-react";
import { playWord } from "../hooks/useAudio";
import { stories, type Story } from "../data/stories";
import { regions } from "../data/words";
import confetti from "canvas-confetti";
import { useState } from "react";

interface StoryReaderProps {
  storyId: string;
  onBack: () => void;
  onComplete: () => void;
  isCompletedBefore: boolean;
}

export function StoryReader({ storyId, onBack, onComplete, isCompletedBefore }: StoryReaderProps) {
  const story = stories.find((s) => s.id === storyId);
  const [readFinished, setReadFinished] = useState(false);

  if (!story) {
    return (
      <div className="p-6 text-center">
        <p className="text-white text-lg">Historien blev ikke fundet.</p>
        <button onClick={onBack} className="btn-touch glass rounded-xl px-4 py-2 mt-4 text-white font-bold">
          Tilbage
        </button>
      </div>
    );
  }

  // Get words for this region
  const region = regions.find((r) => r.id === story.regionId);
  const regionWords = new Set(
    region?.worlds.flatMap((w) => w.words.map((wo) => wo.text.toLowerCase())) ?? []
  );

  // Helper to split text, find training words, and format them as buttons
  const renderInteractiveText = (text: string) => {
    const tokens = text.split(" ");
    return tokens.map((token, idx) => {
      // Extract punctuation to keep correct formatting
      const match = token.match(/^([.,/#!$%&*;:{}=_`~()?"'–-]*)(.*?)([.,/#!$%&*;:{}=_`~()?"'–-]*)$/);
      if (!match) return <span key={idx}>{token} </span>;

      const leading = match[1];
      const wordBody = match[2];
      const trailing = match[3];
      const wordLower = wordBody.toLowerCase();

      // If the word matches a training word in the current region
      if (regionWords.has(wordLower)) {
        return (
          <span key={idx} className="inline-block mr-1">
            {leading}
            <button
              onClick={() => playWord(wordLower)}
              className="px-2 py-0.5 bg-yellow-100 hover:bg-yellow-200 active:scale-95 text-red-600 font-extrabold rounded-lg shadow-sm border border-yellow-300 transition-all text-xl sm:text-2xl inline-flex items-center gap-1 cursor-pointer"
              title="Tryk for at høre ordet"
            >
              {wordBody}
              <Volume2 className="w-4 h-4 text-red-400 inline" />
            </button>
            {trailing}
          </span>
        );
      }

      return (
        <span key={idx} className="text-gray-800 text-xl sm:text-2xl font-bold leading-relaxed mr-1">
          {token}
        </span>
      );
    });
  };

  const handleFinish = () => {
    setReadFinished(true);
    // Fire confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFE81A", "#FF0000", "#34D399"]
    });

    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-full px-4 py-6 flex flex-col max-w-lg mx-auto bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
          aria-label="Gå tilbage"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white/60 font-bold text-sm">
          Læser: {story.pokemon}
        </span>
        <div className="w-12 text-right">
          {isCompletedBefore && (
            <Star className="w-6 h-6 text-yellow-400 fill-current inline-block" />
          )}
        </div>
      </div>

      {/* Book Container */}
      <div className="flex-1 bg-[#fbf7f0] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-900/30 flex flex-col gap-6 animate-pop-in relative overflow-hidden">
        {/* Decorative page margin */}
        <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-red-200/50" />

        {/* Story Title */}
        <div className="text-center pb-4 border-b border-gray-200">
          <span className="text-4xl block mb-2">{story.emoji}</span>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {story.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-extrabold">
            Tryk på de <span className="text-red-500 bg-yellow-100 px-1 rounded">gule</span> ord for at høre dem!
          </p>
        </div>

        {/* Story Body */}
        <div className="flex-1 overflow-y-auto pr-1 text-left select-text">
          {renderInteractiveText(story.text)}
        </div>

        {/* Read Finish Action */}
        <div className="pt-4 border-t border-gray-200 flex justify-center">
          {readFinished ? (
            <div className="text-center py-2 animate-bounce">
              <span className="text-green-600 font-black text-xl flex items-center gap-2">
                🎉 Super flot læst! +10 ⭐
              </span>
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="btn-touch w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Check className="w-6 h-6" /> Jeg har læst bogen!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
