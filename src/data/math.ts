export interface MathQuestion {
  question: string;
  options: number[];
  answer: number;
}

export interface MathQuiz {
  id: string;
  title: string;
  regionId: "kanto" | "johto" | "hoenn" | "sinnoh";
  pokemon: string;
  emoji: string;
  questions: MathQuestion[];
}

export const mathQuizzes: MathQuiz[] = [
  // ── LEVEL 1: KANTO (Plus op til 10) ──
  {
    id: "math-kanto-1",
    title: "Små plus-stykker",
    regionId: "kanto",
    pokemon: "Pikachu",
    emoji: "⚡",
    questions: [
      { question: "2 + 2", options: [3, 4, 5], answer: 4 },
      { question: "3 + 1", options: [2, 4, 6], answer: 4 },
      { question: "4 + 3", options: [6, 7, 8], answer: 7 },
      { question: "5 + 5", options: [9, 10, 11], answer: 10 },
      { question: "1 + 6", options: [6, 7, 8], answer: 7 },
    ]
  },
  {
    id: "math-kanto-2",
    title: "Flere plus-stykker",
    regionId: "kanto",
    pokemon: "Bulbasaur",
    emoji: "🌿",
    questions: [
      { question: "3 + 2", options: [4, 5, 6], answer: 5 },
      { question: "6 + 2", options: [7, 8, 9], answer: 8 },
      { question: "4 + 5", options: [8, 9, 10], answer: 9 },
      { question: "7 + 3", options: [9, 10, 11], answer: 10 },
      { question: "2 + 7", options: [8, 9, 10], answer: 9 },
    ]
  },
  {
    id: "math-kanto-3",
    title: "Charmanders opgaver",
    regionId: "kanto",
    pokemon: "Charmander",
    emoji: "🔥",
    questions: [
      { question: "4 + 4", options: [7, 8, 9], answer: 8 },
      { question: "5 + 1", options: [5, 6, 7], answer: 6 },
      { question: "2 + 5", options: [6, 7, 8], answer: 7 },
      { question: "8 + 2", options: [9, 10, 11], answer: 10 },
      { question: "3 + 6", options: [8, 9, 10], answer: 9 },
    ]
  },

  // ── LEVEL 2: JOHTO (Plus op til 20, lette overgange) ──
  {
    id: "math-johto-1",
    title: "Store plus-stykker",
    regionId: "johto",
    pokemon: "Togepi",
    emoji: "🥚",
    questions: [
      { question: "10 + 2", options: [11, 12, 13], answer: 12 },
      { question: "12 + 3", options: [14, 15, 16], answer: 15 },
      { question: "11 + 4", options: [14, 15, 16], answer: 15 },
      { question: "15 + 4", options: [18, 19, 20], answer: 19 },
      { question: "13 + 5", options: [17, 18, 19], answer: 18 },
    ]
  },
  {
    id: "math-johto-2",
    title: "Chikoritas regning",
    regionId: "johto",
    pokemon: "Chikorita",
    emoji: "🍃",
    questions: [
      { question: "10 + 5", options: [14, 15, 16], answer: 15 },
      { question: "14 + 2", options: [15, 16, 17], answer: 16 },
      { question: "11 + 6", options: [16, 17, 18], answer: 17 },
      { question: "16 + 3", options: [18, 19, 20], answer: 19 },
      { question: "12 + 7", options: [18, 19, 20], answer: 19 },
    ]
  },
  {
    id: "math-johto-3",
    title: "Tiervenner & Talpar",
    regionId: "johto",
    pokemon: "Cyndaquil",
    emoji: "🔥",
    questions: [
      { question: "6 + 4", options: [8, 10, 12], answer: 10 },
      { question: "15 + 5", options: [18, 20, 22], answer: 20 },
      { question: "7 + 3", options: [9, 10, 11], answer: 10 },
      { question: "12 + 8", options: [19, 20, 21], answer: 20 },
      { question: "14 + 6", options: [18, 20, 22], answer: 20 },
    ]
  },

  // ── LEVEL 3: HOENN (Minus op til 10) ──
  {
    id: "math-hoenn-1",
    title: "Små minus-stykker",
    regionId: "hoenn",
    pokemon: "Mudkip",
    emoji: "💧",
    questions: [
      { question: "5 - 2", options: [2, 3, 4], answer: 3 },
      { question: "4 - 1", options: [1, 3, 5], answer: 3 },
      { question: "7 - 3", options: [3, 4, 5], answer: 4 },
      { question: "8 - 6", options: [1, 2, 3], answer: 2 },
      { question: "10 - 5", options: [4, 5, 6], answer: 5 },
    ]
  },
  {
    id: "math-hoenn-2",
    title: "Skildpaddens tal",
    regionId: "hoenn",
    pokemon: "Squirtle",
    emoji: "🐢",
    questions: [
      { question: "7 - 2", options: [4, 5, 6], answer: 5 },
      { question: "9 - 3", options: [5, 6, 7], answer: 6 },
      { question: "8 - 5", options: [2, 3, 4], answer: 3 },
      { question: "10 - 2", options: [7, 8, 9], answer: 8 },
      { question: "6 - 4", options: [1, 2, 3], answer: 2 },
    ]
  },
  {
    id: "math-hoenn-3",
    title: "Dragens opgaver",
    regionId: "hoenn",
    pokemon: "Rayquaza",
    emoji: "🐉",
    questions: [
      { question: "9 - 6", options: [2, 3, 4], answer: 3 },
      { question: "7 - 5", options: [1, 2, 3], answer: 2 },
      { question: "10 - 8", options: [1, 2, 3], answer: 2 },
      { question: "8 - 7", options: [0, 1, 2], answer: 1 },
      { question: "5 - 4", options: [0, 1, 2], answer: 1 },
    ]
  },

  // ── LEVEL 4: SINNOH (Plus/Minus op til 20 med overgang) ──
  {
    id: "math-sinnoh-1",
    title: "Piplups udfordring",
    regionId: "sinnoh",
    pokemon: "Piplup",
    emoji: "🐧",
    questions: [
      { question: "8 + 5", options: [12, 13, 14], answer: 13 },
      { question: "7 + 6", options: [11, 13, 15], answer: 13 },
      { question: "9 + 5", options: [13, 14, 15], answer: 14 },
      { question: "6 + 8", options: [12, 14, 16], answer: 14 },
      { question: "9 + 7", options: [15, 16, 17], answer: 16 },
    ]
  },
  {
    id: "math-sinnoh-2",
    title: "Store minus-stykker",
    regionId: "sinnoh",
    pokemon: "Lucario",
    emoji: "🐺",
    questions: [
      { question: "12 - 5", options: [6, 7, 8], answer: 7 },
      { question: "15 - 7", options: [7, 8, 9], answer: 8 },
      { question: "14 - 5", options: [8, 9, 10], answer: 9 },
      { question: "11 - 4", options: [6, 7, 8], answer: 7 },
      { question: "13 - 8", options: [4, 5, 6], answer: 5 },
    ]
  },
  {
    id: "math-sinnoh-3",
    title: "Mesterens blandede",
    regionId: "sinnoh",
    pokemon: "Garchomp",
    emoji: "🦈",
    questions: [
      { question: "16 - 9", options: [6, 7, 8], answer: 7 },
      { question: "7 + 8", options: [14, 15, 16], answer: 15 },
      { question: "14 - 5", options: [8, 9, 10], answer: 9 },
      { question: "9 + 9", options: [17, 18, 19], answer: 18 },
      { question: "18 - 9", options: [8, 9, 10], answer: 9 },
    ]
  }
];
