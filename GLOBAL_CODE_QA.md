# 📄 GLOBAL_CODE_QA.md: Projekt-Læringer & Best Practices

> **Projekt:** Noras Lynord & Læringsunivers (`nora-lynord`)  
> **Målgruppe:** Nora (2. klasse / 7-8 år)  
> **Tech Stack:** React 19, TypeScript, Vite, TailwindCSS v4, Lucide React, Canvas Confetti, Web Speech API, Web Audio API, Vitest, Playwright.

Dette dokument samler alle nøglelæringer, arkitektoniske valg, pædagogiske principper, UX-erfaringer og fejlløsninger fra hele udviklingsforløbet.

---

## 📑 Indholdsfortegnelse
1. [🧠 Arkitektur & Tilstandshåndtering (State & Persistence)](#1-arkitektur--tilstandshåndtering-state--persistence)
2. [🎯 Pædagogisk Design & Børne-UX](#2-pædagogisk-design--børne-ux)
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
    
    // Mulighed 1: Åbnet via hovedspillet
    if (regionId === "johto" && progress.unlockedWorlds.includes(13)) return true;
    
    // Mulighed 2: Åbnet ved at færdiggøre foregående niveau i SAMME modul
    if (regionId === "johto") {
      const kantoQuizzes = mathQuizzes.filter(q => q.regionId === "kanto");
      return kantoQuizzes.every(q => progress.completedMathQuizzes?.includes(q.id));
    }
    // ...
  };
  ```

### 1.2 Tilstandspersistens & Anti-Farming (`useProgress.ts`)
- **Centraliseret State:** Hele appens fremskridt gemmes i `localStorage` under `STORAGE_KEY = "nora-lynord-progress"`.
- **Self-Healing State:** Ved `loadProgress()` tjekkes `maxCompleted` i `completedWorlds`. `unlockedWorlds` genopbygges automatisk til `maxCompleted + 1`, så fremskridt aldrig går tabt eller låses ved ændringer i datastrukturen.
- **Anti-Farming af Stjerner:**
  ```typescript
  const completeTimesTable = useCallback((tableId: number) => {
    saveUpdater((prev) => {
      const currentCompleted = prev.completedTimesTables ?? [];
      // Stjerner tildeles KUN ved første gennemførelse
      if (currentCompleted.includes(tableId)) return prev;
      return {
        ...prev,
        stars: prev.stars + 10,
        completedTimesTables: [...currentCompleted, tableId],
      };
    });
  }, [saveUpdater]);
  ```

---

## 2. 🎯 Pædagogisk Design & Børne-UX

### 2.1 Gamification Uden Straf
- **Ingen Game Over / Mistede Hjerter:** Hvis barnet svarer forkert på et ord eller et matematikstykke, ryster knappen blidt (`animate-shake`), og barnet kan frit prøve de andre svarmuligheder.
- **Positive Belønninger:**
  - Mini-konfetti udløses ved hvert rigtigt svar.
  - Stort konfetti-show, trofæ-animationer og `+10 ⭐` udløses ved 100% korrekt gennemførelse.

### 2.2 Hop-tælling (Tælleremser) vs. Multiplikation
- **Tælleremse (`25 ➔ 30 ➔ ? ➔ 45 ➔ 50`):** Lærer barnet talrækkens rytme i tabellen.
- **Pædagogisk Distraktor-mønster i Hop-tælling:**
  - *Fejl:* Hvis distraktorerne genereres som tilfældige tal (f.eks. `38`, `43` i 5-tabellen), lærte barnet blot at frasortere tal, der ikke ender på 0 eller 5.
  - *Korrekt:* For Hop-tælling **skal alle svarmuligheder tilhøre samme tabel** (f.eks. `15, 25, 40, 60` for 5-tabellen). Dette tvinger barnet til at finde den nøjagtige placering i rækken.

### 2.3 Data-Varians i Opgavesæt (`src/data/math.ts`)
- **Undgå sekventielle svar-gentagelser:** Sørg for, at facit og svarmuligheder varierer fra spørgsmål til spørgsmål i samme quiz. Identiske svar 3-5 gange i træk (f.eks. facit `20` med svarmuligheder `[19, 20, 21]`) fører til mønstergenkendelse frem for udregning.

---

## 3. 🎨 Visuel Design, Animationer & Responsivitet

### 3.1 Farvesystem & Tematisering
- **Klart Farveskel mellem Moduler:**
  - 🟢 **Noras Læsehjørne:** Emerald / Teal gradienter (`from-emerald-500 to-teal-500`).
  - 🔵 **Noras Regnehjørne:** Blue / Indigo gradienter (`from-blue-500 to-indigo-500`).
  - 🟣 **Noras Tabeller:** Purple / Pink gradienter (`from-purple-500 to-pink-500`).
  - 🔴 **Pokédex Ord-træner:** Rød / Gul / Pokeball-tema.
- **Glassmorphism:** Tailwind CSS utility-klasser (`glass`, `glass-strong`, `backdrop-blur-sm`) kombineret med en sløret baggrund for et moderne, dybt udtryk.

### 3.2 Touch-Optimering (iPad / Tablet)
- **Minimum Touch Targets:** Svarmuligheder har stor højde (`py-6`), fed skrift (`font-black text-4xl`) og stor afstand (`gap-4`), så barnehænder rammer plet på berøringsskærme.
- **Dynamisk Brik-skalering for Lange Ord (`SpellWordGame.tsx`):**
  - For ord med `> 8` eller `> 10` bogstaver skaleres bogstavbrikkerne og tekststørrelsen ned (`w-10 h-10 text-xl`), for at forhindre linjeskift eller visuelt overflow på mindre skærme.

---

## 4. 🔊 Audio Handling (TTS, STT & Web Audio API)

### 4.1 iOS Safari Touch-Unlock Mønster
- **Udfordring:** iOS Safari blokerer `AudioContext` og `SpeechSynthesis`, medmindre de udløses direkte af en brugerbevægelse (`click` eller `touchstart`).
- **Løsning:** I `App.tsx` tilføjes globale listeners på `touchstart` og `click`, som initierer et 1-sampels tavst lydbuffer og henter Web Speech stemmer.

### 4.2 Dansk Oplæsning (TTS i Matematik & Tabeller)
- **Web Speech API (`speechSynthesis`):**
  - Konverterer matematiske tegn til danske ord før oplæsning:
  ```typescript
  function speakMath(text: string) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const formatted = text
        .replace(/×|\*/g, " gange ")
        .replace(/\+/g, " plus ")
        .replace(/-/g, " minus ")
        .replace(/=/g, " er ");
      const utterance = new SpeechSynthesisUtterance(formatted);
      utterance.lang = "da-DK";
      utterance.rate = 0.85; // Lidt lavere hastighed for børn
      window.speechSynthesis.speak(utterance);
    } catch {}
  }
  ```

---

## 5. 🧪 Test-Disciplin, Kvalitetssikring & Deployment

### 5.1 React 19 & Vitest Integrationstests
- **Indkapsling i `act(...)`:**
  - Når du tester asynkrone tilstande i React (f.eks. rystelser med `setTimeout`), skal tidsventen indkapsles i `act`:
  ```typescript
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
  });
  ```
  Dette garanterer 0 advarsler i Vitest.

### 5.2 Visual QA & Headless Playwright
- **Automatiserede Skærmbilleder:** Et Python Playwright script tager automatisk skærmbilleder af alle vigtige skærmtilstande på en tablet-viewport (768x1024). Dette muliggør omgående visuel kvalitetskontrol efter nye features.

### 5.3 CI/CD Workflow
1. **Lokal verifikation:** Kør `npm run build` (tsc + vite build) og `npx vitest run` lokalt.
2. **Commit & Push:** Skub til `main` branch på GitHub.
3. **Automatisk Deployment:** Vercel opfanger commitet og bygger produktionsbundlet automatisk.

---

## 6. 📜 Fejlfindings-katalog & Historiske Løsninger

| Fejl / Symptom | Årsag | Løsning |
| :--- | :--- | :--- |
| **Level 3 (Hoenn) fastlåst i Matematik** | `isRegionUnlocked` tjekkede kun hovedspillets rute-lås. | Ombygget `isRegionUnlocked` til også at tjekke fuldførte opgaver i samme modul. |
| **Identiske svarmuligheder i Matematik** | Hårdkodede quizzes i `math.ts` havde samme svar gentaget 3-5 gange. | Varierede opgaverne og distraktorerne i `math.ts`. |
| **Hop-tælling for nem** | Distraktorer indeholdt tal fra andre tabeller (f.eks. udelukkelse af ulige tal i 5-tabellen). | Ændret distractor-generatoren til kun at vælge andre multipla i *samme* tabel. |
| **React Test Warnings i Vitest** | Asynkron timer-opdatering skete uden for React's `act(...)` scope. | Indkapslet ventetid i `act(async () => { ... })`. |
| **Manglende lyd på iOS** | Safari blokerer autospil af lyd uden forudgående bruger-tryk. | Tilføjet global touch-unlock listener i `App.tsx`. |

---

*Dette dokument opdateres kontinuerligt ved nye milepæle og arkitektoniske læringer i projektet.*
