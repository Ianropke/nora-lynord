# 🧪 Komplets Testplan: Noras Lynord & Læringsunivers (`nora-lynord`)

> **Formål:** Dette dokument udgør den samlede, master-testplan for børne-læringsappen `nora-lynord`. Testplanen er struktureret, så den direkte kan fremsendes til faglig review hos ChatGPT eller et eksternt QA-team.

---

## 📌 1. Dokument-information & Scope

### 1.1 Projektbeskrivelse
- **Applikation:** Noras Lynord & Læringsunivers (`nora-lynord`)
- **Målgruppe:** Nora (2. klasse / 7-8 år)
- **Hovedformål:** En PWA-klar, interaktiv og børnevenlig React-applikation, der træner de 120 mest hyppige danske lynord, læseforståelse (Lix ~15), matematik (plus/minus op til 20) samt gangetabellerne 1-20 via gamification og Pokémon-tematisering.
- **Tech Stack:** React 19, TypeScript, Vite, TailwindCSS v4, Lucide React, Canvas Confetti, Web Speech API (TTS/STT), Web Audio API, Vitest, Playwright.

### 1.2 Test-Afgrænsning (Scope)
- **I Scope:**
  - ✅ **Modul 1: Noras Pokédex (Ord-Træner):** 48 ruter opdelt i 4 regioner (Kanto, Johto, Hoenn, Sinnoh). Spiltyper: *Lyt og Lær*, *Fang Ordet!*, *Stav Ordet*, *Ord-toget*, *Vendespil*.
  - ✅ **Modul 2: Noras Læsehjørne:** Interaktive bøger med klikbar udtale af nøgleord.
  - ✅ **Modul 3: Noras Regnehjørne:** Matematik-quizzes i 4 niveau-regioner (plus/minus op til 20 med ti-er overgang).
  - ✅ **Modul 4: Noras Tabeller:** Gangetabeller 1-20 med to modes: *Tælleremse (Hop-tælling)* og *Gange-Mester*.
  - ✅ **Trofæ- & Stjerne-Økonomi:** Belønninger (+10 ⭐ pr. gennemført opgave), anti-farming beskyttelse, trofæskab og medaljer (🏃‍♂️ Løbesko, ⚔️ Sværd, 👑 Guld-krone).
  - ✅ **Tilstandspersistens:** `localStorage` lagring med self-healing mekanismer.
  - ✅ **Audio & Touch-Unlock:** Web Speech API TTS på dansk (`da-DK`), Web Audio API iOS touch unlock.
  - ✅ **Automatiserede tests:** Vitest integrationstests og Playwright visuel QA.

- **Uden for Scope:**
  - ❌ Server-side database (Appen er en ren client-side SPA deployet på Vercel).

---

## 🎯 2. Test-Strategi & Testniveauer

1. **Enhedstests & Komponenttests (Unit/Integration):** Eksekveres via Vitest og React Testing Library. Tjekker state-logik, navigation og spilkomponenter.
2. **End-to-End & Visuel QA (E2E & Layout):** Eksekveres via Playwright på iPad/Tablet viewport (768x1024) og mobil (390x844).
3. **Pædagogisk & Børne-UX Audit:** Tjek af distraktorer, lydstøtte, touch-targets, læsbarhed og fravær af straffende mekanismer (straf-frie fejl).
4. **Enhed- og Browser-kompatibilitet:** iPad Safari (iOS Touch-unlock), Android Chrome, Desktop Edge/Chrome.

---

## 📑 3. Detaljerede Testcases (Test Suites)

### Suite A: Navigation, State & Persistens

#### TC-01: Førstegangsnavigation & Kort-visning
- **Modul:** Hovedmenu (`HomeScreen`)
- **Forudsætning:** Uren tilstand (`localStorage` ryddet).
- **Handling:** Åbn appen.
- **Forventet Resultat:** 
  - Overskrift "Noras Pokédex" vises.
  - Rute 1 (Pallet Town) i Kanto er åben.
  - Rute 2-48 er låste med hængelås-ikon.
  - Stjerne-tæller viser `0`.

#### TC-02: Tilstandspersistens & Anti-Farming af Stjerner
- **Modul:** `useProgress.ts` / `localStorage`
- **Handling:**
  1. Gennemfør en tabel (f.eks. 5-tabellen i Hop-tælling).
  2. Bekræft at der tildeles +10 ⭐.
  3. Genindlæs siden (F5).
  4. Gennemfør 5-tabellen igen i Hop-tælling.
- **Forventet Resultat:**
  - Efter genindlæsning bevares de optjente stjerner og medaljer.
  - Ved 2. gennemførelse tildeles der **IKKE** 10 ekstra stjerner (anti-farming tjek).

#### TC-03: Self-Healing State ved Korrupt/Ældre State
- **Modul:** `loadProgress()`
- **Handling:** Sæt `localStorage` manuelt med `{ completedWorlds: [1, 2, 3] }` uden `unlockedWorlds`.
- **Forventet Resultat:** `loadProgress()` reparerer tilstanden og sætter `unlockedWorlds` til `[1, 2, 3, 4]`.

---

### Suite B: Noras Pokédex (Ord-Træner)

#### TC-04: Mode 1 - "Lyt og Lær"
- **Handling:** Vælg Rute 1 ➔ "Lyt og Lær". Tryk "Næste →".
- **Forventet Resultat:** Ordet vises med stor fed skrift, og udtale afspilles uden nedbrud.

#### TC-05: Mode 2 - "Fang Ordet!" (Korrekt Svar)
- **Handling:** Vælg Rute 1 ➔ "Fang Ordet!". Tryk på det rigtige ord blandt de 3 knapper.
- **Forventet Resultat:** Grønt blink, mini-konfetti og automatisk skift til næste ord.

#### TC-06: Mode 2 - "Fang Ordet!" (Forkert Svar - Straf-fri UI)
- **Handling:** Tryk på et forkert ord.
- **Forventet Resultat:** 
  - Knappen ryster (`animate-shake`).
  - Ingen mistede liv eller game-over.
  - Ordet gemmes i arrayet `hardWords`.
  - Spillet forbliver på samme ord, så barnet kan prøve igen.

#### TC-07: Dynamisk Brik-skalering i "Stav Ordet"
- **Handling:** Åbn "Stav Ordet" for et langt ord (>8 bogstaver, f.eks. *"koncentration"*).
- **Forventet Resultat:** Bogstavbrikkerne og tekststørrelsen skaleres ned (`w-10 h-10`), så alle brikker forbliver på én række uden wrapping på tablet-skærm.

---

### Suite C: Noras Læsehjørne

#### TC-08: Afkoblet Region-Oplåsning i Læsehjørnet
- **Handling:** Færdiggør alle 3 historier i Kanto uden at have spillet Ord-træneren op til Rute 13.
- **Forventet Resultat:** Level 2 (Johto) låses op i Læsehjørnet uafhængigt af Ord-trænerens progression.

#### TC-09: Interaktiv Tekst & Audio-afspilning i Bøger
- **Handling:** Åbn historien "Pikachus nye bold". Tryk på et af de gule nøgleord.
- **Forventet Resultat:** Udtalen af nøgleordet afspilles øjeblikkeligt via `playWord()`.

---

### Suite D: Noras Regnehjørne (Matematik)

#### TC-10: Pædagogisk Progression i Matematik
- **Handling:** Gennemgå opgaver i Kanto (plus til 10), Johto (plus til 20), Hoenn (minus til 10) og Sinnoh (plus/minus med ti-er overgang).
- **Forventet Resultat:** 
  - Kanto: Plusstykker op til 10.
  - Sinnoh: Sværere opgaver med ti-er overgang (f.eks. `12 - 5 = 7`).
  - Ingen quizzer må have identiske svar 3-5 gange i træk.

#### TC-11: Dansk Lyd-støtte på Matematikstykker
- **Handling:** Tryk på knappen *"Hør opgaven"* (`Volume2` ikon) i et matematikstykke (`14 - 5`).
- **Forventet Resultat:** Opgaven oplæses på dansk via Web Speech API (*"Fjorten minus fem"*).

---

### Suite E: Noras Tabeller (Gangetabeller 1-20)

#### TC-12: Hop-tælling (Tælleremse) & Intelligente Distraktorer
- **Handling:** Åbn 5-tabellen i Hop-tælling (`30 ➔ 35 ➔ ? ➔ 45 ➔ 50`).
- **Forventet Resultat:** 
  - Alle 4 svarmuligheder er andre gyldige multipla af 5 (f.eks. `25`, `40`, `60`, `15`).
  - Ingen tilfældige tal som `38` eller `43` må optræde i 5-tabellen.
  - Svaret `40` placerer tallet korrekt i sekvensen.

#### TC-13: Gange-Mester Mode & Lyd-støtte
- **Handling:** Åbn 7-tabellen i Gange-Mester (`4 × 7 = ?`). Tryk *"Hør opgaven"*.
- **Forventet Resultat:** Udtales som *"Fire gange syv"*.

#### TC-14: Dobbelt Medalje-system & Guld-krone 👑
- **Handling:**
  1. Gennemfør Hop-tælling for 3-tabellen ➔ Vinder Løbesko-medalje 🏃‍♂️.
  2. Gennemfør Gange-Mester for 3-tabellen ➔ Vinder Sværd-medalje ⚔️.
- **Forventet Resultat:**
  - 3-tabel knappen i oversigten får guldramme, guld-skygge og en krone 👑 i hjørnet.
  - Samlet medaljetæller opdateres til `2 / 40 Medaljer`.

---

### Suite F: Audio, STT & Cross-Browser Touch-Unlock

#### TC-15: iOS Safari Touch-Unlock for AudioContext
- **Handling:** Åbn appen på en ren iOS Safari iPad. Tryk på skærmen (f.eks. vælg en rute).
- **Forventet Resultat:** Global `touchstart` listener initierer et tavst lydbuffer, så efterfølgende lydknapper afspiller uden at blive blokeret af iOS autoplay-restriktioner.

#### TC-16: STT Talegenkendelse Fallback ("Sig Ordet")
- **Handling:** Åbn "Sig Ordet" i en browser uden mikrofon-tilladelse eller SpeechRecognition support.
- **Forventet Resultat:** Graceful fallback UI uden app-crash eller blank skærm.

---

### Suite G: Automatiserede Tests & CI/CD

#### TC-17: Integrationstest Suite (Vitest)
- **Handling:** Kør `npx vitest run` i terminalen.
- **Acceptkriterie:** **8 / 8 tests passed med 0 fejl og 0 React `act(...)` advarsler.**

#### TC-18: Produktions-byggesystem
- **Handling:** Kør `npm run build` (`tsc && vite build`).
- **Acceptkriterie:** 0 TypeScript-kompileringsfejl. Bundling gennemføres på under 1 sekund.

---

## 📋 4. Acceptkriterier & Risikostyring (Pass/Fail Criteria)

| Kriterium | Pass Betingelse | Fail Betingelse |
| :--- | :--- | :--- |
| **Funktionel Korrekthed** | Alle knapper og navigationer fører til den korrekte skærm. | Blanke skærme, NPE/ReferenceError, eller knapper uden funktion. |
| **Pædagogisk Kvalitet** | Ingen straffende elementer; distraktorer i Hop-tælling matcher tabellen. | Tilfældige urelaterede tal i Hop-tælling; gentagne identiske svar i matematik. |
| **Børne-UX & Touch** | Alle berøringsflader er $\ge 48\text{px}$; høj kontrast; intuitiv brug for 7-årig. | Små knapper (<32px), overlappende tekst, eller umulig læsbarhed. |
| **Lydstøtte** | Dansk udtale fungerer på alle ord, matematik- og tabelstykker. | Lyd blokeret uden mulighed for genaktivering; forvrænget tekst-til-tale. |
| **Build & Test Pipeline** | `npm run build` og `vitest` gennemføres med 0 fejl og 0 warnings. | TypeScript kompileringsfejl eller fejlede tests i CI/CD. |

---

## 💬 5. Review-Skabelon til ChatGPT Prompt

Kopier teksten herunder og send direkte til ChatGPT for at anmode om et fagligt review af testplanen:

```text
Hej ChatGPT,

Jeg har udviklet en børne-læringsapplikation i React 19, TypeScript og TailwindCSS ("Noras Lynord & Læringsunivers"), målrettet min 7-årige datter i 2. klasse. 

Jeg vil gerne bede dig om at gennemføre et kritisk review af den vedlagte TESTPLAN (TEST_PLAN.md).

Bedøm venligst testplanen ud fra følgende parametre:
1. Test-dækning (Coverage): Er der vigtige kanttilfælde (edge cases) eller spilkomponenter, som mangler testcases?
2. Pædagogisk og Børne-UX relevans: Rammer testkriterierne behovene hos et 7-8 årigt barn i 2. klasse?
3. Teknisk stringens: Er de automatiserede og manuelle testkriterier (Vitest, Playwright, Audio touch unlock, LocalStorage persistence) tilstrækkeligt beskrevet?
4. Eventuelle forbedringsforslag eller manglende testscenarier.

Her er den komplette testplan:
[SÆT INDHOLDET AF TEST_PLAN.md IND HER]
```
