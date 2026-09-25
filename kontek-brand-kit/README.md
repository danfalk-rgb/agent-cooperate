# Kontek Brand Kit

Ett agent-agnostiskt kit för att generera Kontek-brandade PowerPoint-slides (och Word-dokument) med valfri AI – Claude, Gemini, ChatGPT eller annan. Designen är låst i kod och tokens; agenten fyller bara i innehåll.

## Struktur

```
kontek-brand-kit/
├── AGENTS.md                    ← agentinstruktionerna (på engelska – det agenter läser bäst)
├── README.md                    ← denna fil (för människor)
├── brand/
│   ├── brand.json               ← alla färger, typsnitt, layoutmått
│   └── logo_0.png               ← LÄGG TILL: Kontek-logotypen (valfri, används automatiskt om den finns)
├── templates/
│   ├── slide-template.js        ← pptxgenjs-mall, datadriven (läser slides från JSON)
│   └── doc-template.js          ← docx-mall för Word-dokument
└── examples/
    └── example-slides.json      ← sex färdiga exempel-slides (bokföringsfil-decket, SV+EN)
```

## Så använder du kitet med en agent

**Claude (bäst – kan köra koden själv):**
Lägg repot i ett Claude-projekt eller ladda upp filerna, och skriv t.ex.
*"Följ AGENTS.md. Skapa en slide om X."* Claude genererar JSON, kör mallen, kvalitetsgranskar renderingen och levererar .pptx.

**ChatGPT / Gemini:**
Klistra in `AGENTS.md` + `brand/brand.json` + `templates/slide-template.js` i chatten (eller peka på GitHub-repot om agenten kan läsa URL:er). Be om en `slides.json` enligt mallens format. Kör sedan lokalt:

```bash
npm install pptxgenjs
node templates/slide-template.js my-slides.json my-deck.pptx
```

## Köra själv

```bash
npm install pptxgenjs docx
node templates/slide-template.js                       # bygger exempel-decket → output.pptx
node templates/slide-template.js slides.json out.pptx  # eget innehåll
node templates/doc-template.js                         # exempel på Word-dokument
```

## Slide-format (JSON)

```json
{
  "title": "Rubrik",
  "subtitle": "En menings ingress.",
  "c1title": "Kort 1", "c1": [{ "text": "Punkt" }, { "text": "Fet punkt", "bold": true }],
  "c2title": "Kort 2", "c2": [{ "text": "..." }],
  "c3title": "Mörkt kort", "c3": [
    { "text": "Etikett:", "bold": true, "bullet": false, "color": "FF8A76" },
    { "text": "Punkt under etiketten" }
  ],
  "noteLabel": "Bra att veta:", "note": "En mening i banden längst ner.",
  "notes": "Talarmanus."
}
```

## Principer (se AGENTS.md för detaljer)

- Svenska + engelska tvillingslides som standard
- High level på sliden, djupet i talarmanus
- Ärliga caveats: roadmap markeras alltid som preliminär
- Produktfakta som aldrig får motsägas (FTPS ≠ SFTP, ingen egen logik i Kontek Lön, m.m.) är kodifierade i AGENTS.md

## Nästa steg / idéer

- [ ] Lägg till `logo_0.png` i `brand/`
- [ ] GitHub Action som renderar PR-ändringar till PNG för visuell diff
- [ ] Fler slide-layouter (t.ex. processkarta, prisslide) som varianter i mallen
- [ ] Dokumentmall som datadriven JSON på samma sätt som slides
