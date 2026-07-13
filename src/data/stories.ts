export interface Story {
  id: string;
  title: string;
  regionId: "kanto" | "johto" | "hoenn" | "sinnoh";
  pokemon: string;
  emoji: string;
  text: string;
}

export const stories: Story[] = [
  // ── LEVEL 1: KANTO ──
  {
    id: "kanto-1",
    title: "Pikachus nye bold",
    regionId: "kanto",
    pokemon: "Pikachu",
    emoji: "⚡",
    text: "En glad Pikachu har en rød bold. Pikachu kan godt lide at lege med den. Se, en lille kat vil også lege! Kan vi løbe og hoppe med bolden? Ja, vi kan! Det er en god leg."
  },
  {
    id: "kanto-2",
    title: "Den trætte Bulbasaur",
    regionId: "kanto",
    pokemon: "Bulbasaur",
    emoji: "🌿",
    text: "Bulbasaur er træt efter en lang dag i skolen. Solen går ned, og det er tid til at sove. Bulbasaur går hen til sit træ. Min lille hund og min kat sover også. Godnat Bulbasaur, sov godt!"
  },
  {
    id: "kanto-3",
    title: "Ord-toget på tur",
    regionId: "kanto",
    pokemon: "Charmander",
    emoji: "🔥",
    text: "Vi skal køre med et tog i dag. Toget er stort og blåt. Kan du se, hvem der sidder i toget? Det er Charmander! Charmander vil gerne have mad og mælk. Vi spiser sammen og er glade."
  },

  // ── LEVEL 2: JOHTO ──
  {
    id: "johto-1",
    title: "En god sommerdag",
    regionId: "johto",
    pokemon: "Cyndaquil",
    emoji: "🔥",
    text: "Cyndaquil står ude i en stor have. Han vil gerne køre på sin cykel. Snart kommer lille Togepi med en chokolade og et lille æble. De spiser mad og leger. Det er en god sommerdag."
  },
  {
    id: "johto-2",
    title: "Bjørnen i skoven",
    regionId: "johto",
    pokemon: "Chikorita",
    emoji: "🍃",
    text: "Chikorita går en tur i en eventyrskov. Der er lidt mørkt, for det er nat. Nu ser Chikorita en bjørn! Men den lille bjørn er træt og vil sove. Så de siger pænt godnat."
  },
  {
    id: "johto-3",
    title: "Mælk på trappen",
    regionId: "johto",
    pokemon: "Togepi",
    emoji: "🥚",
    text: "Togepi sidder stille på trappen. Togepi har en flot krystal i sin hånd. Den lyser pænt i den varme aften. Nu kommer mormor ud fra køkkenet. Hun har lidt varm mælk med til Togepi."
  },

  // ── LEVEL 3: HOENN ──
  {
    id: "hoenn-1",
    title: "Mudkips flyverejse",
    regionId: "hoenn",
    pokemon: "Mudkip",
    emoji: "💧",
    text: "Mudkip skal ud at rejse med en stor flyvemaskine i januar. Mudkip er meget spændt, men også lidt bekymret. I lufthavnen kigger Mudkip på en flot regnbue på himlen. Det er en spændende historie!"
  },
  {
    id: "hoenn-2",
    title: "Den nysgerrige skildpadde",
    regionId: "hoenn",
    pokemon: "Squirtle",
    emoji: "🐢",
    text: "En nysgerrige skildpadde sidder på en sofa og ser fjernsyn. Pludselig ser den en flot sommerfugl flyve ind fra haven. Skildpadden er stolt, fordi den kan fange en chokolade fra køleskabet selv. Det var fantastisk!"
  },
  {
    id: "hoenn-3",
    title: "Astronauten Mudkip",
    regionId: "hoenn",
    pokemon: "Rayquaza",
    emoji: "🐉",
    text: "Om mandagen drømte Mudkip om at være astronaut på en ny planet. Mudkip vil gerne flyve op til stjernerne og mælkevejen. Det kræver stor koncentration at styre et rumskib, men Mudkip er lykkelig."
  },

  // ── LEVEL 4: SINNOH ──
  {
    id: "sinnoh-1",
    title: "Piplups fødselsdag",
    regionId: "sinnoh",
    pokemon: "Piplup",
    emoji: "🐧",
    text: "I dag har Piplup fødselsdag! Der er stor spænding, og Piplup har pakket sin nye skoletaske og drikkedunk. Vennerne leger skattejagt på en legeplads. Pludselig begynder det at sne, og de bygger en snemand. Det var en vidunderlig dag!"
  },
  {
    id: "sinnoh-2",
    title: "Det store mesterskab",
    regionId: "sinnoh",
    pokemon: "Lucario",
    emoji: "🐺",
    text: "Piplup deltager i et mesterskab i holdsport. Det er en stor udfordring, og Piplup skal løbe lynhurtigt. Piplup viser stor tålmodighed og stædighed. Efter en langvarig kamp vinder Piplup en flot guldmedalje og en stor pokal! Piplup is nu en ægte champion."
  },
  {
    id: "sinnoh-3",
    title: "Sommerferie i sandet",
    regionId: "sinnoh",
    pokemon: "Garchomp",
    emoji: "🦈",
    text: "Piplup holder sommerferie på stranden. Piplup har sin badedragt på og sidder i en strandstol. Med en vandslange bygger Piplup store sandslotte i sandet. Uheldigvis kom en krabbe og kiggede nysgerrigt. Piplup besluttede at dele sin madpakke med den."
  }
];
