# 📄 GLOBAL_CODE_QA.md: Projekt-Læringer & Best Practices

> **Projekt:** Noras Lynord & Læringsunivers (`nora-lynord`)  
> **Målgruppe:** Nora (2. klasse / 7-8 år)  
> **Tech Stack:** React 19, TypeScript, Vite, TailwindCSS v4, Lucide React, Canvas Confetti, Web Speech API, Web Audio API, Vitest, Playwright.

Dette dokument samler nøglelæringer, arkitektoniske valg, pædagogiske principper, UX-erfaringer, læreplans-mapping og fejlløsninger fra udviklingsforløbet. Kildekode og automatiserede tests er den aktuelle sandhed, hvis dette historiske dokument afviger.

---

## 📑 Indholdsfortegnelse
1. [🧠 Arkitektur & Tilstandshåndtering (State & Persistence)](#1-arkitektur--tilstandshåndtering-state--persistence)
2. [🎯 Pædagogisk Design, Børne-UX & Læreplans-mapping](#2-pædagogisk-design-børne-ux--læreplans-mapping)
3. [🎨 Visuel Design, Animationer & Responsivitet](#3-visuel-design-animationer--responsivitet)
4. [🔊 Audio Handling (TTS, STT & Web Audio API)](#4-audio-handling-tts-stt--web-audio-api)
5. [🧪 Test-Disciplin, Kvalitetssikring & Deployment](#5-test-disciplin-kvalitetssikring--deployment)
6. [📜 Fejlfindings-katalog & Historiske Løsninger](#6-fejlfindings-katalog--historiske-løsninger)

---

## 1. 🧠 Arkitektur & Tilstandshåndtering (State & Persistence)

### 1.1 Afkoblet Progression i Side-Moduler (Decoupled Progression)
- **Problem:** Oprindeligt var adgangen til regionerne i Læsehjørnet og Regnehjørnet bundet direkte til hovedspillets `unlockedWorlds` (Ord-træneren). Hvis barnet ikke spillede Ord-træneren op til f.eks. Rute 25, var Level 3 (Hoenn) låst i Læse- og Regnehjørnet – uanset hvor mange matematik- eller læseopgaver barnet havde klaret.
- **Læring:** Side-moduler (Læsning, Matematik, Tabeller) skal have **modul-uafhængig adgangslogik**.
- **Mønster:**
  ```typescript
  const isRegionUnlocked = (regionId: string): boolean => {
    if (regionId === "kanto") return true;
    
    // Check om åbnet via hovedspillet
    if (regionId === "johto" && progress.unlockedWorlds.includes(13)) return true;
    
    // Sekventiel modul-opvisning: Forrige regions opgaver skal være gennemført
    const regionOrder = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar"];
    const idx = regionOrder.indexOf(regionId);
    if (idx > 0) {
      const prevRegionId = regionOrder[idx - 1];
      if (!isRegionUnlocked(prevRegionId)) return false;
      const prevQuizzes = mathQuizzes.filter(q => q.regionId === prevRegionId);
      return prevQuizzes.every(q => progress.completedMathQuizzes?.includes(q.id));
    }
    return false;
  };
  ```

### 1.2 Tilstandspersistens & QuotaExceeded Safeguards (`useProgress.ts`)
- **Centraliseret State:** Hele appens fremskridt gemmes i `localStorage` under `STORAGE_KEY = "nora-lynord-progress"`.
- **Self-Healing State:** Ved `loadProgress()` tjekkes `maxCompleted` i `completedWorlds`. `unlockedWorlds` genopbygges automatisk til `maxCompleted + 1`, så fremskridt aldrig går tabt ved opdateringer i datastrukturen.
- **Storage Write Protection:** `localStorage.setItem` er pakket ind i `try...catch` for at forhindre app-crash ved `QuotaExceededError` eller privat browsing.
- **Diskret Forældre-Reset:** `resetProgress()` kaldes fra en underspillet knap i Præmieskabet (`TrophyCabinet.tsx`) beskyttet af `window.confirm`.

---

## 2. 🎯 Pædagogisk Design, Børne-UX & Læreplans-mapping

### 2.1 Gamification Uden Straf
- **Ingen Game Over / Mistede Hjerter:** Hvis barnet svarer forkert på et ord eller et matematikstykke, ryster knappen blidt (`animate-shake`), og barnet kan frit prøve de andre svarmuligheder.
- **Positive Belønninger:**
  - Mini-konfetti udløses ved hvert rigtigt svar.
  - Stort konfetti-show, trofæ-animationer og `+10 ⭐` udløses ved 100% korrekt gennemførelse.

### 2.2 Læreplans-mapping (🇩🇰 Danske Fælles Mål vs. 🇮🇳 Indisk CBSE/ICSE)
Regnemodulet er opdelt i 8 progressionsniveauer, mens Ord-træneren aktuelt har 6 levels. Læsehjørnet har 12 forfatterede historier i de regioner, der aktuelt har story-data. Mappingen matcher både det danske og det indiske skolesystem:

| Level & Region | Indhold | 🇩🇰 Dansk Skoleklasse | 🇮🇳 Indisk Klasse |
| :--- | :--- | :--- | :--- |
| **Level 1: Kanto 🔴** | Plus op til 10 (`2+2`) | 0. - 1. klasse | Class 1 (UKG / Grade 1) |
| **Level 2: Johto 🔵** | Plus op til 20 (`10+2`) | 1. klasse | Class 1 (Grade 1) |
| **Level 3: Hoenn 🟢** | Minus op til 10 (`5-2`) | 1. klasse | Class 1 (Grade 1) |
| **Level 4: Sinnoh 🟡** | Plus/Minus op til 20 m. overgang (`8+5`) | 1. - 2. klasse | Class 1 - 2 (Grade 1-2) |
| **Level 5: Unova 🟣** | Plus/Minus op til 50 (`23+12`) | 2. klasse | Class 2 (Grade 2) |
| **Level 6: Kalos 💖** | 3-tals regning & Ligninger (`?+6=14`) | 2. - 3. klasse | Class 2 - 3 (Grade 2-3) |
| **Level 7: Alola 🌴** | Hundrede-tal & Store Hop (`60+40`) | 3. klasse | Class 3 (Grade 3) |
| **Level 8: Galar 👑** | Mesterens Finale op til 100 (`47+38`) | 3. - 4. klasse | Class 3 - 4 (Grade 3-4) |

---

## 3. 🎨 Visuel Design, Animationer & Responsivitet

### 3.1 PWA & Favicon Håndtering
- **PWA Webmanifest (`public/manifest.webmanifest`):** Definerer appens navn (*Noras Lynord*), display (`standalone`), baggrundsfarve (`#111827`) og tema (`#6366f1`).
- **Apple Touch Icon:** `<link rel="apple-touch-icon" href="/favicon.svg">` i `index.html` sikrer et flot ikon ved *"Føj til hjemmeskærm"* på iPad/iPhone.
- **Offline-status:** Webmanifestet er på plads, men der er endnu ingen service worker eller offline-cache. Offline-understøttelse må derfor ikke beskrives som implementeret.

### 3.2 Touch-Optimering & Unikke Ord
- **100% Unikke Ord (720 Ord):** Datamodellen `words.ts` indeholder 720 unikke danske ord fordelt på 6 levels og 72 ruter med 10 ord pr. rute. `src/data/words.test.ts` beskytter counts, route IDs og unikhed.

---

## 4. 🔊 Audio Handling (TTS, STT & Web Audio API)

### 4.1 iOS Safari Touch-Unlock Mønster
- **Udfordring:** iOS Safari blokerer `AudioContext` og `SpeechSynthesis`, medmindre de udløses direkte af en brugerbevægelse.
- **Løsning:** I `App.tsx` tilføjes globale listeners på `touchstart` og `click`, som initierer et 1-sampels tavst lydbuffer.

### 4.2 Dansk Oplæsning af Ukendte Tal i Ligninger
- **Web Speech API (`speakMath`):**
  - Formaterer matematiske tegn og ligninger for børnevenlig oplæsning:
  ```typescript
  function speakMath(text: string) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const formatted = text
        .replace(/\?/g, " hvad ")
        .replace(/\+/g, " plus ")
        .replace(/-/g, " minus ")
        .replace(/×|\*/g, " gange ")
        .replace(/=/g, " er lig med ");
      const utterance = new SpeechSynthesisUtterance(formatted);
      utterance.lang = "da-DK";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.debug("Math speech unavailable", error);
    }
  }
  ```

---

## 5. 🧪 Test-Disciplin, Kvalitetssikring & Deployment

### 5.1 Playwright End-to-End Browser QA
- `e2e/home.spec.ts` verificerer, at forsiden renderer, level 6 kan nås på smal viewport, route 1 åbner korrekt, og der ikke kommer browserkonsolfejl.
- CI kører Chromium-smoketesten via `npm run test:e2e`. Det er en smoke-suite, ikke en fuld visuel baseline-suite.

---

## 6. 📜 Fejlfindings-katalog & Historiske Løsninger

| Fejl / Symptom | Årsag | Løsning |
| :--- | :--- | :--- |
| **Ødelagt Favicon** | `index.html` pegede på ueksisterende `/vite.svg`. | Rettet til `/favicon.svg` og tilføjet `apple-touch-icon`. |
| **Manglende PWA Manifest** | Ingen `.webmanifest` fil til stede. | Oprettet `public/manifest.webmanifest` og linket i `index.html`. |
| **Meta Description Mismatch** | Beskrivelsen fulgte ikke den aktuelle vocabulary-count. | Opdateret til 720 danske ord. |
| **Dublerede ord i `words.ts`** | Samme ord optrådte i flere ruter efter level-udvidelser. | De 33 senere dubletter er erstattet, og `src/data/words.test.ts` håndhæver 720 unikke ord. |
| **Manglende lokale lydfiler** | Ikke alle nye level-ord har statiske MP3-filer. | `useAudio.ts` bruger dansk SpeechSynthesis-fallback; manglende assets er dokumenteret og må ikke maskeres. |
| **Ubenyttet `resetProgress`** | Hooket havde `resetProgress` uden UI-knap. | Tilføjet diskret forældreknap i `TrophyCabinet.tsx` m. `window.confirm`. |
| **Level 3 (Hoenn) fastlåst i Matematik** | `isRegionUnlocked` tjekkede kun hovedspillets rute-lås. | Ombygget `isRegionUnlocked` til også at tjekke fuldførte opgaver i samme modul. |

---

*Dette dokument opdateres kontinuerligt ved nye milepæle og arkitektoniske læringer i projektet.*
