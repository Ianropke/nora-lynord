import json
import re

with open("src/data/words.ts", "r") as f:
    content = f.read()

all_hoenn_words = [
  # Verden 1: Abstrakte begreber
  "kærlighed", "venskab", "fællesskab", "oplevelse", "mulighed", "fremtid", "historie", "samfund", "sandhed", "frihed",
  # Verden 2: Skole og viden
  "matematik", "dansk", "engelsk", "videnskab", "geografi", "historie", "eksamen", "bibliotek", "computer", "internet",
  # Verden 3: Dyr og natur (svære)
  "sommerfugl", "dinosaurus", "flodhest", "kænguru", "pingvin", "krokodille", "skildpadde", "flagermus", "pindsvin", "bavian",
  # Verden 4: Mad og drikke (lange)
  "frikadeller", "spaghetti", "pandekager", "chokolade", "appelsin", "gulerod", "kartoffel", "agurk", "tomat", "vandmelon",
  # Verden 5: Følelser
  "lykkelig", "ulykkelig", "bekymret", "spændt", "nervøs", "overrasket", "skuffet", "stolt", "misundelig", "nysgerrig",
  # Verden 6: Ugedage og måneder
  "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag", "januar", "februar", "december",
  # Verden 7: Transport og maskiner
  "flyvemaskine", "helikopter", "motorcykel", "lastbil", "gravemaskine", "ambulance", "brandbil", "politi", "togstation", "lufthavn",
  # Verden 8: Ting i hjemmet
  "fjernsyn", "køleskab", "opvaskemaskine", "vaskemaskine", "støvsuger", "mikrobølgeovn", "skrivebord", "sofa", "lænestol", "kommode",
  # Verden 9: Tøj og farver
  "vinterjakke", "flyverdragt", "gummistøvler", "strømpebukser", "undertøj", "lyseblå", "mørkegrøn", "lilla", "orange", "lyserød",
  # Verden 10: Vejr og universet
  "tordenvejr", "snevejr", "regnbue", "orkan", "jordskælv", "solsystem", "mælkevejen", "planet", "stjerne", "astronaut",
  # Verden 11: Beskrivende ord
  "forskellig", "forhåbentlig", "selvfølgelig", "fremragende", "fantastisk", "utrolig", "mærkelig", "spændende", "kedelig", "vigtig",
  # Verden 12: Super-mester ord
  "koncentration", "undersøgelse", "information", "præsentation", "kommunikation", "organisation", "inspiration", "dekoration", "situation", "konkurrence"
]

hoenn_world_names = [
  {"name": "Littleroot Town", "emoji": "🏡", "pokemon": "Normal"},
  {"name": "Petalburg Woods", "emoji": "🌲", "pokemon": "Grass"},
  {"name": "Rustboro City", "emoji": "🪨", "pokemon": "Rock"},
  {"name": "Dewford Town", "emoji": "🏝️", "pokemon": "Fighting"},
  {"name": "Slateport City", "emoji": "🚢", "pokemon": "Water"},
  {"name": "Mauville City", "emoji": "⚡", "pokemon": "Electric"},
  {"name": "Fallarbor Town", "emoji": "🌋", "pokemon": "Fire"},
  {"name": "Lavaridge Town", "emoji": "♨️", "pokemon": "Fire"},
  {"name": "Fortree City", "emoji": "🌳", "pokemon": "Flying"},
  {"name": "Lilycove City", "emoji": "🌊", "pokemon": "Water"},
  {"name": "Mossdeep City", "emoji": "🔮", "pokemon": "Psychic"},
  {"name": "Hoenn Liga", "emoji": "🏆", "pokemon": "Master"}
]

# Extract the existing code parts
start_regions = content.find("export const regions: Region[] = [")
if start_regions == -1:
    print("Could not find regions array")
    exit(1)

# Add Hoenn definitions before export const regions
hoenn_defs = f"""
const hoennWords = {json.dumps(all_hoenn_words, ensure_ascii=False)};
const hoennWorldNames = {json.dumps(hoenn_world_names, ensure_ascii=False)};
"""

content = content[:start_regions] + hoenn_defs + "\n" + content[start_regions:]

# Add Hoenn to regions array
new_region = """  {
    id: "hoenn",
    name: "Level 3: Hoenn",
    worlds: createWorlds(hoennWorldNames, hoennWords, 25),
  },
];"""

content = content.replace("];\n\n// Helper to get a single world array", new_region + "\n\n// Helper to get a single world array")

with open("src/data/words.ts", "w") as f:
    f.write(content)

print("Added Hoenn to words.ts")
