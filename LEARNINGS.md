# 🧠 LEARNINGS.md - Projektets Læringsdokumentation

Dette dokument samler de vigtigste erfaringer, læringer og tekniske principper opnået i løbet af udviklingen af **Noras Lynord & Læringsunivers**.

---

## 📌 Top 5 Kerne-Læringer

### 1. Børnevenlig UX & Fejltolerant Gamification
- **Principper:** Ingen game-over, ingen mistede hjerter eller tidsstraf.
- **Micro-feedback:** Ved forkert svar ryster knappen blidt (`animate-shake`), mens barnet frit kan prøve igen uden tab af stjerner.
- **Pædagogisk Distraktor-Design:** I hop-tælling (f.eks. 5-tabellen) skal alle svarmuligheder tilhøre 5-tabellen (f.eks. 15, 25, 40), så barnet ikke blot udelukker tal, der ikke ender på 0 eller 5.

### 2. Afkoblet Progression (Modulær Oplåsning)
- Adgangen til nye regioner i side-moduler (Læsehjørne, Regnehjørne) må ikke afhænge udelukkende af spilruten i Ord-træneren.
- Side-moduler har sekventiel oplåsningslogik baseret på **fuldførte opgaver i samme modul**, så et barn kan gøre fremskridt i matematik uafhængigt af læsning.

### 3. iOS Web Audio & TTS Touch-Unlock
- iOS Safari kræver direkte brugerinteraktion (`click` / `touchstart`) for at genoptage `AudioContext` og aktivere `SpeechSynthesis`.
- Globale event-listeners i `App.tsx` afspiller en stum lyd ved første tryk for at låse op for alle lyde i appen.
- Matematiske tegn og ukendte tal i ligninger (`? + 6 = 14`) formateres eksplicit til dansk før oplæsning (*"Hvad plus seks er lig med fjorten"*).

### 4. Skole- & Læreplans-Mapping (🇩🇰 vs. 🇮🇳)
- Opgavesættene i **Noras Regnehjørne** (8 niveauer) er mappet til både den **danske folkeskole (0.-4. klasse)** og det **indiske CBSE/ICSE pensum (UKG - Grade 4)**.
- Hvert niveau har synlige flag-tags (`🇩🇰 0. - 1. klasse`, `🇮🇳 Class 1 (Grade 1)`), som hjælper forældre og lærere med at vælge det rette niveau for barnet.

### 5. Datakvalitet & Robusthed
- **100% Unikke Ord:** Alle 480 ord i Ord-trænerens 4 ruter er saniteret, så der ikke optræder dubletter på tværs af ruterne.
- **localStorage Protection:** Skriveoperationer til `localStorage` er pakket i `try...catch` for at forhindre app-krasch ved `QuotaExceededError`.
- **Forældre-Nulstilling:** Indbygget diskret `resetProgress()` i Præmieskabet med bekræftelsesdialog (`window.confirm`).

---

*Dette dokument vedligeholdes og opdateres ved nye arkitektoniske læringer.*
