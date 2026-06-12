import json

all_kanto_words = [
  "jeg", "er", "en", "det", "du", "og", "kan", "vi", "har", "den",
  "ikke", "på", "at", "med", "min", "han", "hun", "til", "der", "fra",
  "vil", "skal", "så", "om", "her", "alle", "men", "nu", "kom", "se",
  "for", "var", "sig", "hvad", "hvor", "når", "dit", "os", "dem", "sin",
  "glad", "god", "stor", "lille", "dag", "tid", "igen", "hen", "godt", "af",
  "hund", "kat", "fugl", "fisk", "sol", "vand", "træ", "blomst", "regn", "sne",
  "mad", "brød", "mælk", "hus", "hjem", "bog", "barn", "mor", "far", "ven",
  "skole", "leg", "bold", "bil", "spil", "sang", "dans", "tegne", "farve", "lys",
  "hånd", "fod", "øje", "mund", "hoved", "ben", "arm", "næse", "øre", "hår",
  "en", "to", "tre", "fire", "fem", "op", "ned", "ud", "ind", "over",
  "gå", "løbe", "spise", "sove", "lege", "læse", "skrive", "synge", "hoppe", "sidde",
  "fordi", "også", "mange", "nogen", "mellem", "efter", "under", "hele", "sammen", "aldrig"
]

kanto_world_names = [
  {"name": "Pallet Town", "emoji": "🏘️", "pokemon": "Normal"},
  {"name": "Viridian Skoven", "emoji": "🌿", "pokemon": "Grass"},
  {"name": "Pewter Grotten", "emoji": "🪨", "pokemon": "Rock"},
  {"name": "Cerulean Søen", "emoji": "💧", "pokemon": "Water"},
  {"name": "Vermilion Havnen", "emoji": "⚡", "pokemon": "Electric"},
  {"name": "Celadon Parken", "emoji": "🌸", "pokemon": "Fairy"},
  {"name": "Fuchsia Safari", "emoji": "🦁", "pokemon": "Ground"},
  {"name": "Saffron Arenaen", "emoji": "🔮", "pokemon": "Psychic"},
  {"name": "Cinnabar Øen", "emoji": "🌋", "pokemon": "Fire"},
  {"name": "Indigo Vejen", "emoji": "🐉", "pokemon": "Dragon"},
  {"name": "Victory Road", "emoji": "⭐", "pokemon": "Fighting"},
  {"name": "Pokémon Liga", "emoji": "🏆", "pokemon": "Master"}
]

all_johto_words = [
  "stjerne", "cykel", "vindue", "vinter", "sommer", "hjerte", "stykke", "venner", "tænke", "hjælpe",
  "familie", "bedste", "første", "sidste", "bliver", "gjorde", "havde", "kunne", "skulle", "ville",
  "kigger", "løber", "hopper", "spiser", "drikker", "sover", "vågner", "drømmer", "leger", "kaster",
  "rigtig", "faktisk", "allerede", "alligevel", "bange", "sulten", "tørstig", "træt", "vigtig", "farlig",
  "morgen", "aften", "middag", "natten", "ugen", "måned", "året", "igår", "imorgen", "idag",
  "søster", "bror", "onkel", "tante", "fætter", "kusine", "mormor", "farfar", "farmor", "morfar",
  "bjørn", "løve", "tiger", "elefant", "slange", "abe", "giraf", "krokodille", "pingvin", "næsehorn",
  "æble", "pære", "banan", "appelsin", "vindrue", "jordbær", "hinanden", "selvom", "hvorfor", "hvordan",
  "dejlig", "hurtig", "langsom", "sjovt", "kedelig", "spændende", "fantastisk", "mærkelig", "uhyggelig", "hyggelig",
  "køkken", "badeværelse", "soveværelse", "stue", "have", "kælder", "loft", "vinduer", "døre", "trappe",
  "cykler", "biler", "busser", "tog", "flyvemaskine", "skib", "båd", "helikopter", "raket", "rumskib",
  "sølv", "guld", "bronze", "diamant", "krystal", "safir", "rubin", "smaragd", "perle", "platin"
]

johto_world_names = [
  {"name": "New Bark Town", "emoji": "🍃", "pokemon": "Normal"},
  {"name": "Cherrygrove City", "emoji": "🌸", "pokemon": "Fairy"},
  {"name": "Violet City", "emoji": "🛕", "pokemon": "Flying"},
  {"name": "Azalea Town", "emoji": "🪵", "pokemon": "Bug"},
  {"name": "Goldenrod City", "emoji": "🏢", "pokemon": "Normal"},
  {"name": "Ecruteak City", "emoji": "👻", "pokemon": "Ghost"},
  {"name": "Olivine City", "emoji": "⚓", "pokemon": "Steel"},
  {"name": "Cianwood City", "emoji": "🌊", "pokemon": "Fighting"},
  {"name": "Mahogany Town", "emoji": "❄️", "pokemon": "Ice"},
  {"name": "Blackthorn City", "emoji": "🐉", "pokemon": "Dragon"},
  {"name": "Mt. Silver", "emoji": "🏔️", "pokemon": "Rock"},
  {"name": "Johto Liga", "emoji": "🌟", "pokemon": "Master"}
]

content = f"""/**
 * Noras Lynord Data
 * Indeholder Level 1 (Kanto) og Level 2 (Johto).
 */

export interface Word {{
  id: number;
  text: string;
}}

export interface World {{
  id: number;
  name: string;
  emoji: string;
  pokemon: string;
  words: Word[];
}}

export interface Region {{
  id: string;
  name: string;
  worlds: World[];
}}

const kantoWords = {json.dumps(all_kanto_words)};
const kantoWorldNames = {json.dumps(kanto_world_names)};

const johtoWords = {json.dumps(all_johto_words)};
const johtoWorldNames = {json.dumps(johto_world_names)};

const createWorlds = (names: any[], words: string[], startId: number): World[] => {{
  return names.map((w, i) => ({{
    id: startId + i,
    name: w.name,
    emoji: w.emoji,
    pokemon: w.pokemon,
    words: words.slice(i * 10, i * 10 + 10).map((text, j) => ({{
      id: startId * 100 + i * 10 + j,
      text,
    }})),
  }}));
}};

export const regions: Region[] = [
  {{
    id: "kanto",
    name: "Level 1: Kanto",
    worlds: createWorlds(kantoWorldNames, kantoWords, 1),
  }},
  {{
    id: "johto",
    name: "Level 2: Johto",
    worlds: createWorlds(johtoWorldNames, johtoWords, 13),
  }},
];

// Helper to get a single world array (flat list of all worlds for backward compatibility)
export const worlds: World[] = regions.flatMap(r => r.worlds);
"""

with open("src/data/words.ts", "w") as f:
    f.write(content)
