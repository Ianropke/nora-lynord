export interface MathQuestion {
  question: string;
  options: number[];
  answer: number;
}

export type MathRegionId = "kanto" | "johto" | "hoenn" | "sinnoh" | "unova" | "kalos" | "alola" | "galar";

export interface MathRegion {
  id: MathRegionId;
  name: string;
  badgeEmoji: string;
  description: string;
}

export interface MathQuiz {
  id: string;
  title: string;
  regionId: MathRegionId;
  pokemon: string;
  emoji: string;
  questions: MathQuestion[];
}

export const mathRegions: MathRegion[] = [
  { id: "kanto", name: "Level 1: Kanto", badgeEmoji: "🔴", description: "Plus op til 10" },
  { id: "johto", name: "Level 2: Johto", badgeEmoji: "🔵", description: "Plus op til 20" },
  { id: "hoenn", name: "Level 3: Hoenn", badgeEmoji: "🟢", description: "Minus op til 10" },
  { id: "sinnoh", name: "Level 4: Sinnoh", badgeEmoji: "🟡", description: "Plus/Minus op til 20 med overgang" },
  { id: "unova", name: "Level 5: Unova", badgeEmoji: "🟣", description: "Plus/Minus op til 50" },
  { id: "kalos", name: "Level 6: Kalos", badgeEmoji: "💖", description: "3-tals regning & Ligninger (?)" },
  { id: "alola", name: "Level 7: Alola", badgeEmoji: "🌴", description: "Hundrede-tal & Store Hop op til 100" },
  { id: "galar", name: "Level 8: Galar & Paldea", badgeEmoji: "👑", description: "Mesterens Legendariske Udfordring" },
];

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
  },

  // ── LEVEL 5: UNOVA (Plus/Minus op til 50) ──
  {
    id: "math-unova-1",
    title: "Victinis 10er-hop",
    regionId: "unova",
    pokemon: "Victini",
    emoji: "✌️",
    questions: [
      { question: "20 + 30", options: [40, 50, 60], answer: 50 },
      { question: "50 - 20", options: [25, 30, 35], answer: 30 },
      { question: "10 + 40", options: [45, 50, 55], answer: 50 },
      { question: "40 - 30", options: [10, 15, 20], answer: 10 },
      { question: "25 + 10", options: [30, 35, 40], answer: 35 },
    ]
  },
  {
    id: "math-unova-2",
    title: "Reshirams plus til 50",
    regionId: "unova",
    pokemon: "Reshiram",
    emoji: "🐉",
    questions: [
      { question: "23 + 12", options: [33, 35, 37], answer: 35 },
      { question: "31 + 14", options: [43, 45, 47], answer: 45 },
      { question: "15 + 22", options: [35, 37, 39], answer: 37 },
      { question: "24 + 24", options: [46, 48, 50], answer: 48 },
      { question: "30 + 19", options: [47, 49, 51], answer: 49 },
    ]
  },
  {
    id: "math-unova-3",
    title: "Zekroms minus til 50",
    regionId: "unova",
    pokemon: "Zekrom",
    emoji: "⚡",
    questions: [
      { question: "45 - 12", options: [31, 33, 35], answer: 33 },
      { question: "38 - 15", options: [21, 23, 25], answer: 23 },
      { question: "50 - 25", options: [20, 25, 30], answer: 25 },
      { question: "42 - 20", options: [20, 22, 24], answer: 22 },
      { question: "49 - 14", options: [33, 35, 37], answer: 35 },
    ]
  },

  // ── LEVEL 6: KALOS (Tre-tals Regning & Ligninger) ──
  {
    id: "math-kalos-1",
    title: "Greninjas 3-tals plus",
    regionId: "kalos",
    pokemon: "Greninja",
    emoji: "🐸",
    questions: [
      { question: "4 + 5 + 6", options: [14, 15, 16], answer: 15 },
      { question: "3 + 7 + 5", options: [13, 15, 17], answer: 15 },
      { question: "8 + 2 + 6", options: [14, 16, 18], answer: 16 },
      { question: "5 + 5 + 8", options: [16, 18, 20], answer: 18 },
      { question: "9 + 1 + 9", options: [17, 19, 21], answer: 19 },
    ]
  },
  {
    id: "math-kalos-2",
    title: "Sylveons 3-tals kæder",
    regionId: "kalos",
    pokemon: "Sylveon",
    emoji: "🎀",
    questions: [
      { question: "15 - 5 + 3", options: [11, 13, 15], answer: 13 },
      { question: "10 + 6 - 4", options: [10, 12, 14], answer: 12 },
      { question: "20 - 5 - 5", options: [8, 10, 12], answer: 10 },
      { question: "12 + 4 - 6", options: [8, 10, 12], answer: 10 },
      { question: "18 - 8 + 7", options: [15, 17, 19], answer: 17 },
    ]
  },
  {
    id: "math-kalos-3",
    title: "Xerneas' ukendte tal (?)",
    regionId: "kalos",
    pokemon: "Xerneas",
    emoji: "🦌",
    questions: [
      { question: "? + 6 = 14", options: [6, 8, 10], answer: 8 },
      { question: "15 - ? = 8", options: [5, 7, 9], answer: 7 },
      { question: "? + 10 = 25", options: [13, 15, 17], answer: 15 },
      { question: "20 - ? = 11", options: [7, 9, 11], answer: 9 },
      { question: "? + 7 = 19", options: [10, 12, 14], answer: 12 },
    ]
  },

  // ── LEVEL 7: ALOLA (Hundrede-tal & Store Hop) ──
  {
    id: "math-alola-1",
    title: "Solgaleos 100-venner",
    regionId: "alola",
    pokemon: "Solgaleo",
    emoji: "🦁",
    questions: [
      { question: "60 + 40", options: [90, 100, 110], answer: 100 },
      { question: "100 - 30", options: [60, 70, 80], answer: 70 },
      { question: "50 + 50", options: [90, 100, 110], answer: 100 },
      { question: "90 - 40", options: [40, 50, 60], answer: 50 },
      { question: "30 + 70", options: [90, 100, 110], answer: 100 },
    ]
  },
  {
    id: "math-alola-2",
    title: "Lunalas store plusstykker",
    regionId: "alola",
    pokemon: "Lunala",
    emoji: "🦇",
    questions: [
      { question: "45 + 35", options: [70, 80, 90], answer: 80 },
      { question: "52 + 23", options: [65, 75, 85], answer: 75 },
      { question: "60 + 25", options: [75, 85, 95], answer: 85 },
      { question: "38 + 42", options: [70, 80, 90], answer: 80 },
      { question: "44 + 44", options: [78, 88, 98], answer: 88 },
    ]
  },
  {
    id: "math-alola-3",
    title: "Mimikyus store minusstykker",
    regionId: "alola",
    pokemon: "Mimikyu",
    emoji: "👻",
    questions: [
      { question: "85 - 25", options: [50, 60, 70], answer: 60 },
      { question: "70 - 35", options: [25, 35, 45], answer: 35 },
      { question: "95 - 40", options: [45, 55, 65], answer: 55 },
      { question: "100 - 45", options: [45, 55, 65], answer: 55 },
      { question: "66 - 33", options: [23, 33, 43], answer: 33 },
    ]
  },

  // ── LEVEL 8: GALAR & PALDEA (Regne-Mesterens Legendariske Udfordring) ──
  {
    id: "math-galar-1",
    title: "Koraidons Legendariske Plus",
    regionId: "galar",
    pokemon: "Koraidon",
    emoji: "🔴",
    questions: [
      { question: "47 + 38", options: [75, 85, 95], answer: 85 },
      { question: "56 + 29", options: [75, 85, 95], answer: 85 },
      { question: "68 + 27", options: [85, 95, 105], answer: 95 },
      { question: "39 + 51", options: [80, 90, 100], answer: 90 },
      { question: "48 + 48", options: [86, 96, 106], answer: 96 },
    ]
  },
  {
    id: "math-galar-2",
    title: "Miraidons Legendariske Minus",
    regionId: "galar",
    pokemon: "Miraidon",
    emoji: "🟣",
    questions: [
      { question: "72 - 35", options: [27, 37, 47], answer: 37 },
      { question: "84 - 47", options: [27, 37, 47], answer: 37 },
      { question: "63 - 28", options: [25, 35, 45], answer: 35 },
      { question: "91 - 54", options: [27, 37, 47], answer: 37 },
      { question: "100 - 62", options: [28, 38, 48], answer: 38 },
    ]
  },
  {
    id: "math-galar-3",
    title: "Tera-Charizards Mester-Finale",
    regionId: "galar",
    pokemon: "Tera Charizard",
    emoji: "🐉",
    questions: [
      { question: "? + 25 = 75", options: [40, 50, 60], answer: 50 },
      { question: "100 - 45 = ?", options: [45, 55, 65], answer: 55 },
      { question: "33 + 33 + 34", options: [90, 100, 110], answer: 100 },
      { question: "90 - ? = 42", options: [38, 48, 58], answer: 48 },
      { question: "25 + 25 + 50", options: [80, 100, 120], answer: 100 },
    ]
  }
];
