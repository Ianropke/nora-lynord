# 🧪 Master Testplan: Noras Lynord & Læringsunivers (`nora-lynord`)

> **Kvalitetsniveau:** Enterprise QA Lead & Software Architect Standard (10/10)  
> **Formål:** Dette dokument udgør den samlede, risikobaserede master-testplan for børne-læringsappen `nora-lynord`. Dokumentet dækker alle funktionelle kanttilfælde (edge cases), børnepædagogik, tilstandspersistens, audio-unlocking, PWA/offline-robusthed og automatiseret QA.

---

## 📌 1. Dokument-information & Scope

### 1.1 Stamdata
- **Applikation:** Noras Lynord & Læringsunivers (`nora-lynord`)
- **Målgruppe:** Nora (2. klasse / 7-8 år)
- **Hovedformål:** PWA-klar, interaktiv og børnevenlig React 19 applikation, der træner de 120 mest hyppige danske lynord, læseforståelse (Lix ~15), matematik (plus/minus op til 20) samt gangetabellerne 1-20 via gamification og Pokémon-tematisering.
- **Tech Stack:** React 19, TypeScript, Vite, TailwindCSS v4, Lucide React, Canvas Confetti, Web Speech API (TTS/STT), Web Audio API, Vitest, Playwright.

### 1.2 Test-Afgrænsning (Scope)
- **I Scope:**
  - ✅ **Modul 1: Noras Pokédex (Ord-Træner):** 48 ruter opdelt i 4 regioner (Kanto, Johto, Hoenn, Sinnoh). Spiltyper: *Lyt og Lær*, *Fang Ordet!*, *Stav Ordet*, *Ord-toget*, *Vendespil*.
  - ✅ **Modul 2: Noras Læsehjørne:** Interaktive bøger med uafhængig adgang og udtale af nøgleord.
  - ✅ **Modul 3: Noras Regnehjørne:** Matematik-quizzes med ti-er overgang og varierede opgaver.
  - ✅ **Modul 4: Noras Tabeller:** Gangetabeller 1-20 med *Tælleremse (Hop-tælling)* og *Gange-Mester*.
  - ✅ **Trofæ- & Stjerne-Økonomi:** Belønninger (+10 ⭐ pr. opgave), anti-farming beskyttelse, guld-kroner 👑 og datakonsistens.
  - ✅ **Tilstandspersistens & Robusthed:** `localStorage` lagring med self-healing, `QuotaExceededError` try-catch og korrupt JSON-oprydning.
  - ✅ **Audio & Touch-Unlock:** Web Speech API TTS på dansk (`da-DK` med udtale af æ, ø, å), Web Audio API iOS touch unlock.
  - ✅ **Børne-UX & Pædagogik:** Straf-fri fejlhåndtering, multi-cue feedback (farve+ikon+lyd mod farveblindhed), berøringsflader $\ge 48\text{px}$.
  - ✅ **Automatiserede tests:** Vitest dækkningsmål og Playwright E2E visual QA pipeline.

---

## 🎯 2. Risikomatrice & Prioritering (Risk Matrix)

For at sikre den mest effektive testindsats opdeles alle scenarier ud fra sandsynlighed og konsekvens:

| Risiko Scenario | Sandsynlighed | Konsekvens | Prioritet | Forebyggende Tiltag / Testdækning |
| :--- | :---: | :---: | :---: | :--- |
| **Progression mistes eller nulstilles** | Lav | Kritisk | **P0** | Self-healing i `loadProgress()` & `try-catch` om `setItem`. |
| **Dobbelt stjerne-tildeling ved hurtige klik / refresh** | Middel | Høj | **P0** | Idempotent completion check (`includes(id)` guard) & debounced buttons. |
| **App crash ved korrupt `localStorage` (JSON syntax error)** | Lav | Høj | **P0** | Graceful fallback i `loadProgress()` til `defaultProgress`. |
| **Lyd blokeret på iOS Safari (AudioContext lock)** | Høj | Høj | **P1** | Global `touchstart` & `click` audio-unlock listener i `App.tsx`. |
| **Tabel-opgaver viser forkert eller tilfældigt distractor-mønster** | Middel | Høj | **P1** | Hop-tælling tvinger distraktorer fra *samme* tabel. |
| **Forkert unlock-logik ved 48 ruter** | Lav | Kritisk | **P0** | End-to-end unlock test fra Rute 1 til Rute 48. |
| **Layout bryder ved tablet-rotation eller lange ord** | Middel | Middel | **P2** | Dynamisk brik-skalering i `SpellWordGame` & Playwright visual snapshots. |
| **Memory leak ved gentagen confetti-affyring** | Lav | Lav | **P2** | Confetti cleanup og animation frame rate limits. |

---

## 📊 3. Test-Prioritering (P0, P1, P2 Hierarki)

- **P0 (Release Blockers / Kritisk):** Navigation, State management, Mid-game recovery, Unlock-logik over alle 48 ruter, Anti-farming, Data-Invarians (`Stars == Sum(Achievements)`), Rapid click / Touch spam beskyttelse, Corrupt JSON / QuotaExceeded recovery, Build & Compilation.
- **P1 (Kerne-Features & Audio):** Ord-træner modes, Læsehjørne, Regnehjørne, Tabeller (Hop-tælling & Gange-Mester), Dansk TTS (æ, ø, å udtale), Audio touch unlock, Multi-cue feedback (farveblindhed), PWA / Offline caching.
- **P2 (UX, Animationer & Performance):** Confetti memory leaks, 15-minutters børnemotivationstests, Tablet-rotation (Portrait ↔ Landscape), Kode-dækning (Code Coverage metrics).

---

## 📑 4. Detaljerede Testcases (Test Suites)

### Suite A: Navigation, State & Persistens (P0)

#### TC-01: Førstegangsnavigation & Kort-visning (P0)
- **Modul:** Hovedmenu (`HomeScreen`)
- **Handling:** Åbn appen med tom `localStorage`.
- **Forventet Resultat:** Rute 1 (Pallet Town) er åben. Rute 2-48 er låst. Stjerner = 0.

#### TC-02: Progression & Unlock-logik over Alle 48 Ruter (P0)
- **Handling:** Gennemfør Rute 47 ➔ Verificer at Rute 48 låses op. Gennemfør Rute 48.
- **Forventet Resultat:**
  - Rute 48 fuldføres uden ud-af-grænser (out-of-bounds) array-fejl.
  - Pokédex tæller viser `48 / 48 badges optjent`.
  - Ingen yderligere ugyldige unlock-kald (f.eks. Rute 49) forsøges.

#### TC-03: Genstart & Browser Refresh Midt i et Spil (P0)
- **Handling:** Start en quiz i Rute 5 (opgave 3/10). Genindlæs siden (F5) eller luk browseren og genåbn.
- **Forventet Resultat:**
  - Appen genstarter sikkert på forside/menu uden nedbrud.
  - Optjente stjerner fra tidligere fuldførte ruter er bevaret 100%.
  - Ingen stjerner tildeles for det afbrudte spil.

#### TC-04: Beskyttelse mod Hurtige Klik / Touch Spam (P0)
- **Handling:** Spam-klik 10 gange på 100 ms på knappen for et korrekt svar.
- **Forventet Resultat:**
  - Svars-tilstanden låses efter 1. klik (`disabled={correct !== null}`).
  - Der affyres KUN 1x confetti-sekvens og tildeles KUN 1 stjerne-event.
  - Ingen dobbelt-navigation eller tilstandsforvirring opstår.

#### TC-05: Håndtering af Korrupt JSON i LocalStorage (P0)
- **Handling:** Sæt `localStorage.setItem('nora-lynord-progress', '{ korrupt json...')` og genindlæs.
- **Forventet Resultat:** `loadProgress()` fanger `SyntaxError` via sin `try...catch` og falder yndefuldt tilbage til `defaultProgress` uden blank skærm.

#### TC-06: LocalStorage QuotaExceeded & Skrivefejl (P0)
- **Handling:** Simuler at `localStorage.setItem` kaster en `QuotaExceededError` (f.eks. i privat tilstand).
- **Forventet Resultat:** `useProgress.ts` fanger fejlen i sin `try...catch`, logger en advarsel i konsollen, og lader spillet fortsætte i hukommelsen uden at crashe UI'et.

#### TC-07: Data-Konsistens Invariant Check (P0)
- **Handling:** Verificer matematisk konsistens for stjerne-tælleren efter 10 tilfældige spil:
  $$\text{Stars} == 10 \times \left( |\text{completedWorlds}| + |\text{completedStories}| + |\text{completedMathQuizzes}| + |\text{completedTimesTables}| + |\text{completedTimesTablesCount}| \right)$$
- **Forventet Resultat:** Ligningen stemmer altid eksakt.

---

### Suite B: Noras Pokédex (Ord-Træner) (P1)

#### TC-08: Mode 1 - "Lyt og Lær" (P1)
- **Handling:** Åbn Rute 1 ➔ "Lyt og Lær". Tryk "Næste →".
- **Forventet Resultat:** Ordet vises i stor skrift, og udtale afspilles.

#### TC-09: Mode 2 - "Fang Ordet!" (Straf-fri UI) (P1)
- **Handling:** Tryk på et forkert ord.
- **Forventet Resultat:** Knappen ryster (`animate-shake`), ingen mistede liv eller game-over, ordet gemmes i `hardWords`, og spillet lader barnet prøve igen.

#### TC-10: Dynamisk Brik-skalering i "Stav Ordet" (P1)
- **Handling:** Åbn "Stav Ordet" for et langt ord (>8 bogstaver, f.eks. *"koncentration"*).
- **Forventet Resultat:** Bogstavbrikkerne og tekststørrelsen skaleres ned (`w-10 h-10`), så alle brikker holdes på én række uden wrapping på tablet.

---

### Suite C: Noras Læsehjørne (P1)

#### TC-11: Afkoblet Region-Oplåsning (P1)
- **Handling:** Færdiggør alle 3 historier i Kanto uden at have spillet Ord-træneren op til Rute 13.
- **Forventet Resultat:** Level 2 (Johto) låses op i Læsehjørnet uafhængigt af Ord-trænerens progression.

#### TC-12: Interaktiv Tekst & Audio i Bøger (P1)
- **Handling:** Åbn historien "Pikachus nye bold". Tryk på et af de gule nøgleord.
- **Forventet Resultat:** Udtalen af nøgleordet afspilles øjeblikkeligt via `playWord()`.

---

### Suite D: Noras Regnehjørne (Matematik) (P1)

#### TC-13: Pædagogisk Progression & Varians i Matematik (P1)
- **Handling:** Gennemgå opgaver i Kanto (plus til 10), Johto (plus til 20), Hoenn (minus til 10) og Sinnoh (plus/minus med ti-er overgang).
- **Forventet Resultat:** Ingen quizzer har identiske svar 3-5 gange i træk. Varierede talpar skaber reel udregning.

#### TC-14: Dansk Lyd-støtte på Matematikstykker (P1)
- **Handling:** Tryk på knappen *"Hør opgaven"* (`Volume2` ikon) i et matematikstykke (`14 - 5`).
- **Forventet Resultat:** Opgaven oplæses på dansk via Web Speech API (*"Fjorten minus fem"*).

---

### Suite E: Noras Tabeller (Gangetabeller 1-20) (P1)

#### TC-15: Hop-tælling (Tælleremse) & Intelligente Distraktorer (P1)
- **Handling:** Åbn 5-tabellen i Hop-tælling (`30 ➔ 35 ➔ ? ➔ 45 ➔ 50`).
- **Forventet Resultat:** Alle 4 svarmuligheder er andre gyldige multipla af 5 (f.eks. `25`, `40`, `60`, `15`). Ingen tilfældige tal som `38` eller `43` optræder.

#### TC-16: Dobbelt Medalje-system & Guld-krone 👑 (P1)
- **Handling:** Gennemfør både Hop-tælling 🏃‍♂️ og Gange-Mester ⚔️ for 3-tabellen.
- **Forventet Resultat:** 3-tabel knappen får guldramme, guld-skygge og en krone 👑 i hjørnet.

---

### Suite F: Audio, Accessibility & PWA Robusthed (P1/P2)

#### TC-17: iOS Safari Touch-Unlock for AudioContext (P1)
- **Handling:** Åbn appen på en ren iOS Safari iPad. Tryk på skærmen.
- **Forventet Resultat:** Global `touchstart` listener initierer et tavst lydbuffer, så efterfølgende lydknapper afspiller uden blokering.

#### TC-18: Dansk Udtale af Specialbogstaver (æ, ø, å) (P1)
- **Handling:** Test TTS-udtale for ord med æ, ø, å (f.eks. *"æble"*, *"øje"*, *"år"*).
- **Forventet Resultat:** Web Speech API udtaler ordene korrekt på dansk (`da-DK`).

#### TC-19: Multi-cue Feedback mod Farveblindhed (P1)
- **Handling:** Inspicer feedback ved rigtigt/forkert svar.
- **Forventet Resultat:** Feedback er ALDRIG baseret på farve alene. Rigtigt svar ledsages af grøn farve + tjekmark-ikon + konfetti + positiv lyd. Forkert svar ledsages af rød farve + ryste-animation + lyd.

#### TC-20: Offline & PWA Cache Test (P1)
- **Handling:** Indlæs appen 1. gang med internet. Slå derefter internet fra (Airplane mode) og genindlæs.
- **Forventet Resultat:** PWA Service Worker / Cache storage serverer appen fejlfrit offline.

#### TC-21: Zoom & Multi-touch Beskyttelse (P2)
- **Handling:** Udfør hurtige dobbelttryk eller pinch-to-zoom på tablet-skærmen.
- **Forventet Resultat:** Touch-action (`touch-action: manipulation`) og viewport meta forhindrer uønsket zoom eller skærmforskydning.

#### TC-22: Tablet Rotation (Portrait ↔ Landscape) (P2)
- **Handling:** Roter iPaden 90 grader under et spil.
- **Forventet Resultat:** Layoutet tilpasser sig dynamisk uden at skjule svarknapper eller knække brikker.

---

### Suite G: Automatiserede Testmetrikker (Vitest & Playwright E2E) (P0/P2)

#### TC-23: Automatiseret Integrationstest Suite (Vitest) (P0)
- **Handling:** Kør `npx vitest run`.
- **Acceptkriterie:** **100% af alle automatiserede integrationstests skal passere med 0 fejl og 0 React `act(...)` advarsler.**

#### TC-24: Kode-dækningsmål (Code Coverage Thresholds) (P2)
- **Handling:** Kør `npx vitest run --coverage`.
- **Acceptkriterie:** Minimum dækningsgrad skal overholdes:
  - **Statements:** $\ge 85\%$
  - **Lines:** $\ge 85\%$
  - **Functions:** $\ge 80\%$
  - **Branches:** $\ge 80\%$

#### TC-25: Playwright E2E Visual Snapshot Pipeline (P2)
- **Handling:** Afvikl Playwright visuel QA pipeline på 768x1024 tablet viewport:
  $$\text{Home} \longrightarrow \text{World} \longrightarrow \text{Game} \longrightarrow \text{Finish} \longrightarrow \text{Reward} \longrightarrow \text{Back}$$
- **Acceptkriterie:** Pixel-tolerance (diff) $< 0.1\%$ i forhold til godkendte baseline-screenshots.

---

## 📋 5. Pass/Fail Acceptkriterier & Release Gate

Applikationen er **godkendt til release**, når følgende 5 Release Gates er opfyldt:

1. **P0 Release Gate:** 100% af alle P0 testcases (TC-01 til TC-07) skal være bestået uden undtagelse.
2. **P1 Release Gate:** Ingen åbne P1 fejl med høj konsekvens. Audio udtale og Hop-tælling fungerer konsistent.
3. **Build Gate:** `npm run build` (`tsc && vite build`) gennemføres med 0 TypeScript- eller bundling-fejl.
4. **Test Gate:** Alle automatiserede Vitest integrationstests passerer med 0 warnings.
5. **Pædagogisk Gate:** 0 straffende mekanismer; berøringsflader $\ge 48\text{px}$; multi-cue feedback mod farveblindhed er opfyldt.

---

## 💬 6. Review-Skabelon til ChatGPT Prompt

Kopier teksten herunder og send direkte til ChatGPT for at anmode om et fagligt review af den opdaterede Master Testplan:

```text
Hej ChatGPT,

Jeg har opdateret master-testplanen (TEST_PLAN.md) for min børne-læringsapplikation ("Noras Lynord & Læringsunivers") på baggrund af din QA Lead & Software Architect evaluering.

Testplanen indeholder nu:
1. En komplet Risikomatrice (Risk Matrix) med P0/P1/P2 prioritering.
2. P0 edge cases for progression over alle 48 ruter, mid-game refresh/recovery, touch-spam, korrupt JSON og QuotaExceeded handling.
3. Matematisk data-konsistens invariant check: Stars == Sum(Achievements).
4. Børne-UX & Farveblindhed (multi-cue feedback), tablet-rotation og offline PWA caching.
5. Dynamiske kode-dækningsmål (Vitest coverage > 85%) og Playwright E2E visuel snapshot pipeline.

Vil du gennemføre et afsluttende review af den opdaterede master-testplan og bekræfte, om den nu opfylder 10/10 Enterprise QA Lead standard?

Her er den opdaterede testplan:
[SÆT INDHOLDET AF TEST_PLAN.md IND HER]
```
