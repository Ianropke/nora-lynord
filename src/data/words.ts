/**
 * Noras Lynord Data
 * Indeholder Level 1-6 med 72 ruter og 720 danske ord.
 */

export interface Word {
  id: number;
  text: string;
}

export interface World {
  id: number;
  name: string;
  emoji: string;
  pokemon: string;
  words: Word[];
}

export interface Region {
  id: string;
  name: string;
  worlds: World[];
}

const kantoWords = ["jeg", "er", "en", "det", "du", "og", "kan", "vi", "har", "den", "ikke", "på", "at", "med", "min", "han", "hun", "til", "der", "fra", "vil", "skal", "så", "om", "her", "alle", "men", "nu", "kom", "se", "for", "var", "sig", "hvad", "hvor", "når", "dit", "os", "dem", "sin", "glad", "god", "stor", "lille", "dag", "tid", "igen", "hen", "godt", "af", "hund", "kat", "fugl", "fisk", "sol", "vand", "træ", "blomst", "regn", "sne", "mad", "brød", "mælk", "hus", "hjem", "bog", "barn", "mor", "far", "ven", "skole", "leg", "bold", "bil", "spil", "sang", "dans", "tegne", "farve", "lys", "hånd", "fod", "øje", "mund", "hoved", "ben", "arm", "næse", "øre", "hår", "nul", "to", "tre", "fire", "fem", "op", "ned", "ud", "ind", "over", "gå", "løbe", "spise", "sove", "lege", "læse", "skrive", "synge", "hoppe", "sidde", "fordi", "også", "mange", "nogen", "mellem", "efter", "under", "hele", "sammen", "aldrig"];
const kantoWorldNames = [{"name": "Pallet Town", "emoji": "\ud83c\udfd8\ufe0f", "pokemon": "Normal"}, {"name": "Viridian Skoven", "emoji": "\ud83c\udf3f", "pokemon": "Grass"}, {"name": "Pewter Grotten", "emoji": "\ud83e\udea8", "pokemon": "Rock"}, {"name": "Cerulean S\u00f8en", "emoji": "\ud83d\udca7", "pokemon": "Water"}, {"name": "Vermilion Havnen", "emoji": "\u26a1", "pokemon": "Electric"}, {"name": "Celadon Parken", "emoji": "\ud83c\udf38", "pokemon": "Fairy"}, {"name": "Fuchsia Safari", "emoji": "\ud83e\udd81", "pokemon": "Ground"}, {"name": "Saffron Arenaen", "emoji": "\ud83d\udd2e", "pokemon": "Psychic"}, {"name": "Cinnabar \u00d8en", "emoji": "\ud83c\udf0b", "pokemon": "Fire"}, {"name": "Indigo Vejen", "emoji": "\ud83d\udc09", "pokemon": "Dragon"}, {"name": "Victory Road", "emoji": "\u2b50", "pokemon": "Fighting"}, {"name": "Pok\u00e9mon Liga", "emoji": "\ud83c\udfc6", "pokemon": "Master"}];

const johtoWords = ["stjerne", "cykel", "vindue", "vinter", "sommer", "hjerte", "stykke", "venner", "t\u00e6nke", "hj\u00e6lpe", "familie", "bedste", "f\u00f8rste", "sidste", "bliver", "gjorde", "havde", "kunne", "skulle", "ville", "kigger", "l\u00f8ber", "hopper", "spiser", "drikker", "sover", "v\u00e5gner", "dr\u00f8mmer", "leger", "kaster", "rigtig", "faktisk", "allerede", "alligevel", "bange", "sulten", "t\u00f8rstig", "tr\u00e6t", "vigtig", "farlig", "morgen", "aften", "middag", "natten", "ugen", "m\u00e5ned", "\u00e5ret", "ig\u00e5r", "imorgen", "idag", "s\u00f8ster", "bror", "onkel", "tante", "f\u00e6tter", "kusine", "mormor", "farfar", "farmor", "morfar", "bj\u00f8rn", "l\u00f8ve", "tiger", "elefant", "slange", "abe", "giraf", "krokodille", "pingvin", "n\u00e6sehorn", "\u00e6ble", "p\u00e6re", "banan", "appelsin", "vindrue", "jordb\u00e6r", "hinanden", "selvom", "hvorfor", "hvordan", "dejlig", "hurtig", "langsom", "sjovt", "kedelig", "sp\u00e6ndende", "fantastisk", "m\u00e6rkelig", "uhyggelig", "hyggelig", "k\u00f8kken", "badev\u00e6relse", "sovev\u00e6relse", "stue", "have", "k\u00e6lder", "loft", "vinduer", "d\u00f8re", "trappe", "cykler", "biler", "busser", "tog", "flyvemaskine", "skib", "b\u00e5d", "helikopter", "raket", "rumskib", "s\u00f8lv", "guld", "bronze", "diamant", "krystal", "safir", "rubin", "smaragd", "perle", "platin"];
const johtoWorldNames = [{"name": "New Bark Town", "emoji": "\ud83c\udf43", "pokemon": "Normal"}, {"name": "Cherrygrove City", "emoji": "\ud83c\udf38", "pokemon": "Fairy"}, {"name": "Violet City", "emoji": "\ud83d\uded5", "pokemon": "Flying"}, {"name": "Azalea Town", "emoji": "\ud83e\udeb5", "pokemon": "Bug"}, {"name": "Goldenrod City", "emoji": "\ud83c\udfe2", "pokemon": "Normal"}, {"name": "Ecruteak City", "emoji": "\ud83d\udc7b", "pokemon": "Ghost"}, {"name": "Olivine City", "emoji": "\u2693", "pokemon": "Steel"}, {"name": "Cianwood City", "emoji": "\ud83c\udf0a", "pokemon": "Fighting"}, {"name": "Mahogany Town", "emoji": "\u2744\ufe0f", "pokemon": "Ice"}, {"name": "Blackthorn City", "emoji": "\ud83d\udc09", "pokemon": "Dragon"}, {"name": "Mt. Silver", "emoji": "\ud83c\udfd4\ufe0f", "pokemon": "Rock"}, {"name": "Johto Liga", "emoji": "\ud83c\udf1f", "pokemon": "Master"}];

const createWorlds = (names: any[], words: string[], startId: number): World[] => {
  return names.map((w, i) => ({
    id: startId + i,
    name: w.name,
    emoji: w.emoji,
    pokemon: w.pokemon,
    words: words.slice(i * 10, i * 10 + 10).map((text, j) => ({
      id: startId * 100 + i * 10 + j,
      text,
    })),
  }));
};


const hoennWords = ["kærlighed", "venskab", "fællesskab", "oplevelse", "mulighed", "fremtid", "historie", "samfund", "sandhed", "frihed", "matematik", "dansk", "engelsk", "videnskab", "geografi", "biologi", "eksamen", "bibliotek", "computer", "internet", "sommerfugl", "dinosaurus", "flodhest", "kænguru", "hvalros", "delfin", "skildpadde", "flagermus", "pindsvin", "bavian", "frikadeller", "spaghetti", "pandekager", "chokolade", "ananas", "gulerod", "kartoffel", "agurk", "tomat", "vandmelon", "lykkelig", "ulykkelig", "bekymret", "spændt", "nervøs", "overrasket", "skuffet", "stolt", "misundelig", "nysgerrig", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag", "januar", "februar", "december", "traktor", "ubåd", "motorcykel", "lastbil", "gravemaskine", "ambulance", "brandbil", "politi", "togstation", "lufthavn", "fjernsyn", "køleskab", "opvaskemaskine", "vaskemaskine", "støvsuger", "mikrobølgeovn", "skrivebord", "sofa", "lænestol", "kommode", "vinterjakke", "flyverdragt", "gummistøvler", "strømpebukser", "undertøj", "lyseblå", "mørkegrøn", "lilla", "orange", "lyserød", "tordenvejr", "snevejr", "regnbue", "orkan", "jordskælv", "solsystem", "mælkevejen", "planet", "komet", "astronaut", "forskellig", "forhåbentlig", "selvfølgelig", "fremragende", "enestående", "utrolig", "mærkelig", "spændende", "vanskelig", "nødvendig", "koncentration", "undersøgelse", "information", "præsentation", "kommunikation", "organisation", "inspiration", "dekoration", "situation", "konkurrence"];
const hoennWorldNames = [{"name": "Littleroot Town", "emoji": "🏡", "pokemon": "Normal"}, {"name": "Petalburg Woods", "emoji": "🌲", "pokemon": "Grass"}, {"name": "Rustboro City", "emoji": "🪨", "pokemon": "Rock"}, {"name": "Dewford Town", "emoji": "🏝️", "pokemon": "Fighting"}, {"name": "Slateport City", "emoji": "🚢", "pokemon": "Water"}, {"name": "Mauville City", "emoji": "⚡", "pokemon": "Electric"}, {"name": "Fallarbor Town", "emoji": "🌋", "pokemon": "Fire"}, {"name": "Lavaridge Town", "emoji": "♨️", "pokemon": "Fire"}, {"name": "Fortree City", "emoji": "🌳", "pokemon": "Flying"}, {"name": "Lilycove City", "emoji": "🌊", "pokemon": "Water"}, {"name": "Mossdeep City", "emoji": "🔮", "pokemon": "Psychic"}, {"name": "Hoenn Liga", "emoji": "🏆", "pokemon": "Master"}];

const sinnohWords = ["selvstændig", "hemmelighed", "nysgerrighed", "uforståelig", "mærkværdig", "modbydelig", "uforsigtig", "utålmodig", "uheldigvis", "pludselig", "arbejdsløs", "arbejdskraft", "beskyttelse", "beskedent", "eventyrlig", "forklaring", "forestilling", "forfærdelig", "forudsætning", "genkendelig", "hovedperson", "holdsport", "håbløshed", "indflydelse", "kontrol", "kunstner", "landskab", "langvarig", "lidenskab", "lynhurtig", "modstander", "mørklægning", "opmærksom", "opfindsom", "planlægning", "retfærdig", "retning", "rædselsfuld", "samvittighed", "skuffelse", "skræmmende", "spænding", "stolthed", "stædighed", "sundhed", "surhed", "sværhedsgrad", "tålmodighed", "tilfældig", "troværdig", "ubehagelig", "udfordring", "uendelig", "ufattelig", "uretfærdig", "usandsynlig", "udvikling", "vidunderlig", "virkelighed", "værdifuld", "særpræget", "ræsonnement", "overbevisning", "oprigtighed", "taknemmelighed", "uafhængig", "udelukkende", "forbindelse", "forventning", "forestille", "fuldstændig", "overveje", "beslutte", "betydning", "opmærksomhed", "hemmelig", "forsigtig", "tålmodig", "stædig", "beskidt", "legeplads", "skattejagt", "fodboldbane", "fødselsdag", "blyantspidser", "skoletaske", "viskelæder", "madpakke", "drikkedunk", "skoleskema", "istap", "snebold", "snemand", "vintertid", "slædebakke", "skistave", "nordlys", "frostvejr", "isbjørne", "nordpol", "solcreme", "strandstol", "badedragt", "sandslotte", "vandslange", "krabber", "vandmænd", "strandbold", "badelagen", "svømmevinge", "mesterskab", "pokalvinder", "sejrsherre", "guldmedalje", "sølvmedalje", "bronzemedalje", "champion", "pokal", "sejr", "pokalturnering"];
const sinnohWorldNames = [{"name": "Twinleaf Town", "emoji": "🏡", "pokemon": "Normal"}, {"name": "Sandgem City", "emoji": "🏖️", "pokemon": "Water"}, {"name": "Jubilife City", "emoji": "🏙️", "pokemon": "Normal"}, {"name": "Oreburgh City", "emoji": "🪨", "pokemon": "Rock"}, {"name": "Floaroma Town", "emoji": "🌸", "pokemon": "Grass"}, {"name": "Eterna City", "emoji": "🌲", "pokemon": "Grass"}, {"name": "Hearthome City", "emoji": "⛪", "pokemon": "Ghost"}, {"name": "Veilstone City", "emoji": "🏬", "pokemon": "Fighting"}, {"name": "Pastoria City", "emoji": "🐊", "pokemon": "Water"}, {"name": "Snowpoint City", "emoji": "❄️", "pokemon": "Ice"}, {"name": "Sunyshore City", "emoji": "⚡", "pokemon": "Electric"}, {"name": "Sinnoh Liga", "emoji": "🏆", "pokemon": "Master"}];

const unovaWords = ["eventyr","rejse","opdagelse","hemmelighed","skovsti","bjergtop","flod","dal","landsby","bytorv","marked","bro","fyrtårn","kyst","ø","hule","ruin","slot","tårn","have","stjerne","måne","solopgang","solnedgang","skygge","lysstråle","regndråbe","vandfald","bål","lejrbål","rygsæk","kompas","kort","kikkert","lommelygte","sovepose","telt","vandflaske","madpakke","snor","nøgle","blyant","viskelæder","lineal","saks","lim","maling","pensel","palet","kasse","kuffert","pakke","brev","besked","telefon","kamera","billede","film","musik","tromme","guitar","klaver","melodi","rytme","danser","scene","publikum","forestilling","grine","smile","råbe","hviske","lytte","spørge","svare","forklare","fortælle","beskrive","bygge","skabe","opfinde","reparere","sortere","samle","bytte","hjælpe","samarbejde","aftale","regel","plan","mål","drøm","mod","styrke","øvelse","træning","forsøg","resultat","løsning","fejltagelse","læring","belønning","fremskridt","ansvar","beslutning","overraskelse","fantasi","nysgerrig","modig","venlig","kreativ","tålmodig","opmærksom","stærk","stille","hurtigere","dygtig","stolt","klar","sammen"];
const unovaWorldNames = [{"name":"Nuvema Town","emoji":"🏡","pokemon":"Normal"},{"name":"Accumula Town","emoji":"🌇","pokemon":"Normal"},{"name":"Striaton City","emoji":"🍽️","pokemon":"Grass"},{"name":"Nacrene City","emoji":"🏛️","pokemon":"Rock"},{"name":"Castelia City","emoji":"🏙️","pokemon":"Bug"},{"name":"Nimbasa City","emoji":"🎡","pokemon":"Electric"},{"name":"Driftveil City","emoji":"🚂","pokemon":"Ground"},{"name":"Mistralton City","emoji":"✈️","pokemon":"Flying"},{"name":"Icirrus City","emoji":"❄️","pokemon":"Ice"},{"name":"Opelucid City","emoji":"🐉","pokemon":"Dragon"},{"name":"Victory Road","emoji":"⭐","pokemon":"Fighting"},{"name":"Unova Liga","emoji":"🏆","pokemon":"Master"}];

const kalosWords = ["fordybelse","sammenligning","argument","bevis","årsag","virkning","eksempel","sammenhæng","forskel","lighed","mønster","rækkefølge","retfærdighed","ansvarlig","beskrivelse","fortolkning","spørgsmål","svarmulighed","beslutning","forklaring","opfindelse","opdagelsesrejsende","laboratorium","eksperiment","forstørrelsesglas","mikroskop","magnet","måling","temperatur","vægt","afstand","hastighed","retning","vinkel","form","cirkel","trekant","firkant","kube","mønsterbrik","jordklode","kontinent","hovedstad","grænse","beboer","kultur","sprog","tradition","festival","museum","teater","udstilling","forfatter","illustration","kapitel","sætning","punktum","komma","overskrift","ordbog","samvittighed","venlighed","ærlighed","nysgerrighed","tillid","respekt","samarbejde","fællesskab","fortryde","tilgive","forsvare","beskytte","opmuntre","foreslå","forhandle","diskutere","enige","uenige","vælge","prioritere","planlægge","forberede","gennemføre","fortsætte","forandre","forbedre","undersøge","opdage","udvikle","vurdere","muligt","umuligt","sandsynlig","sjælden","almindelig","nødvendig","farlig","sikker","forsigtig","præcis","tålmodighed","koncentration","fantasi","skuffelse","begejstring","bekymring","lettelse","stolthed","overraskelse","forventning","eventyrlig","fremragende","besværlig","uventet","særlig","nøjagtig","effektiv","moderne","enorm","betydningsfuld"];
const kalosWorldNames = [{"name":"Vaniville Town","emoji":"🏡","pokemon":"Normal"},{"name":"Aquacorde Town","emoji":"💧","pokemon":"Water"},{"name":"Santalune City","emoji":"🌳","pokemon":"Bug"},{"name":"Cyllage City","emoji":"🪨","pokemon":"Rock"},{"name":"Ambrette Town","emoji":"🦴","pokemon":"Fossil"},{"name":"Lumiose City","emoji":"💡","pokemon":"Electric"},{"name":"Laverre City","emoji":"🍄","pokemon":"Fairy"},{"name":"Dendemille Town","emoji":"🌾","pokemon":"Grass"},{"name":"Anistar City","emoji":"🔮","pokemon":"Psychic"},{"name":"Snowbelle City","emoji":"❄️","pokemon":"Ice"},{"name":"Victory Road","emoji":"⭐","pokemon":"Fighting"},{"name":"Kalos Liga","emoji":"🏆","pokemon":"Master"}];

export const regions: Region[] = [
  {
    id: "kanto",
    name: "Level 1: Kanto",
    worlds: createWorlds(kantoWorldNames, kantoWords, 1),
  },
  {
    id: "johto",
    name: "Level 2: Johto",
    worlds: createWorlds(johtoWorldNames, johtoWords, 13),
  },
  {
    id: "hoenn",
    name: "Level 3: Hoenn",
    worlds: createWorlds(hoennWorldNames, hoennWords, 25),
  },
  {
    id: "sinnoh",
    name: "Level 4: Sinnoh",
    worlds: createWorlds(sinnohWorldNames, sinnohWords, 37),
  },
  {
    id: "unova",
    name: "Level 5: Unova",
    worlds: createWorlds(unovaWorldNames, unovaWords, 49),
  },
  {
    id: "kalos",
    name: "Level 6: Kalos",
    worlds: createWorlds(kalosWorldNames, kalosWords, 61),
  },
];

// Helper to get a single world array (flat list of all worlds for backward compatibility)
export const worlds: World[] = regions.flatMap(r => r.worlds);
