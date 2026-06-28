import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RefreshCw, Trophy, Home, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { playWord } from "../hooks/useAudio";
import type { World } from "../data/words";

interface MemoryGameProps {
  world: World;
  onBack: () => void;
  addStars: (n: number) => void;
  completeWorld: (id: number) => void;
}

interface Card {
  id: number;
  wordId: number;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame({ world, onBack, addStars, completeWorld }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    // Select 6 random words
    const shuffledWords = [...world.words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, 6);

    // Create 12 cards (2 of each)
    const newCards: Card[] = selectedWords.flatMap((word, idx) => [
      { id: idx * 2, wordId: word.id, text: word.text, isFlipped: false, isMatched: false },
      { id: idx * 2 + 1, wordId: word.id, text: word.text, isFlipped: false, isMatched: false },
    ]);

    // Shuffle cards
    newCards.sort(() => 0.5 - Math.random());
    
    setCards(newCards);
    setFlippedIds([]);
    setMatches(0);
    setIsWon(false);
  }, [world]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (clickedId: number) => {
    // Prevent clicking if 2 cards are already flipped, or card is already flipped/matched
    if (flippedIds.length === 2) return;
    
    const card = cards.find(c => c.id === clickedId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Flip the card
    setCards(prev => prev.map(c => c.id === clickedId ? { ...c, isFlipped: true } : c));
    playWord(card.text); // Play audio

    const newFlippedIds = [...flippedIds, clickedId];
    setFlippedIds(newFlippedIds);

    // Check for match
    if (newFlippedIds.length === 2) {
      const card1 = cards.find(c => c.id === newFlippedIds[0]);
      const card2 = cards.find(c => c.id === newFlippedIds[1]);

      if (card1 && card2 && card1.wordId === card2.wordId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setMatches(m => m + 1);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1?.id || c.id === card2?.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (matches === 6 && !isWon) {
      setIsWon(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFE81A", "#FF0000", "#ffffff"]
      });
      addStars(3); // Award 3 stars for memory game
      completeWorld(world.id);
    }
  }, [matches, isWon, world.id, addStars, completeWorld]);

  if (isWon) {
    return (
      <div className="min-h-full px-4 py-6 flex flex-col items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 text-center max-w-sm mt-8 animate-pop-in">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-2 text-white">Fantastisk!</h2>
          <p className="text-white/80 mb-6">
            Du fandt alle parrene og vandt 3 stjerner! ⭐⭐⭐
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={initGame}
              className="btn-touch glass rounded-2xl px-6 py-3 font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Spil Igen
            </button>
            <button
              onClick={onBack}
              className="btn-touch bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-2xl px-6 py-3 font-bold flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Check className="w-5 h-5" /> Fortsæt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <button
          onClick={onBack}
          className="btn-touch glass rounded-full p-3 hover:bg-white/20 transition-colors"
          aria-label="Gå tilbage"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white/80 font-bold">
          Vendespil: {world.name}
        </span>
        <div className="w-12 text-right font-bold text-yellow-400">
          {matches} / 6
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 flex-1 content-center pb-8 animate-pop-in">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || card.isFlipped}
            className="aspect-[3/4] relative w-full perspective-1000 btn-touch"
          >
            <div 
              className={`w-full h-full transition-all duration-500 transform-style-preserve-3d absolute inset-0 ${
                (card.isFlipped || card.isMatched) ? "rotate-y-180" : ""
              }`}
            >
              {/* Back of card (Pokéball pattern) */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-red-500 to-red-600 rounded-xl border-4 border-white/20 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 rounded-full border-4 border-white/40 flex items-center justify-center">
                   <div className="w-3 h-3 rounded-full bg-white/40"></div>
                </div>
              </div>

              {/* Front of card (Word) */}
              <div 
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center p-2 shadow-xl border-4 transition-colors ${
                  card.isMatched 
                    ? "bg-green-500 border-green-300" 
                    : "bg-white border-white/50"
                }`}
              >
                <span 
                  className={`text-lg sm:text-xl font-black break-words text-center ${
                    card.isMatched ? "text-white" : "text-gray-800"
                  }`}
                  style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                >
                  {card.text}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
