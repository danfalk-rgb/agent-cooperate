# Kontek Brand Kit — Agent Instructions

You are generating **Kontek-branded PowerPoint slides** (and optionally Word documents) for Visma HRM Sverige AB. Follow this file exactly. All design tokens live in `brand/brand.json`; the reference implementation lives in `templates/`.

## 1. Output rules

- **Deliverable:** a runnable Node.js script based on `templates/slide-template.js` (pptxgenjs), producing a `.pptx`. If you can execute code, run it and return the file. If you cannot execute code, return the complete script plus run instructions (`npm install pptxgenjs && node build.js`).
- **Never freehand the design.** Reuse `buildSlide()`, `card()` and `mosaic()` from the template. Only edit the slide data objects.
- **Bilingual by default:** produce each slide in Swedish first, then an English twin with identical layout, unless the user says otherwise.
- **High level + speaker notes:** slides carry short bullets (max ~6 per card, 1 line each ideally); depth goes into `notes`.

## 2. Slide anatomy (fixed)

Every content slide has:

1. **Title** (28pt bold, dark green) + one-sentence subtitle (12.5pt, muted grey).
2. **Pixel mosaic** decoration, upper right (brand element).
3. **Three cards**: two white cards + one dark-green card (rightmost). The dark card is for the "special" content: dimensions, caveats, today-vs-future, key takeaways. Coral-light (`FF8A76`) bold labels inside the dark card introduce sub-groups (e.g. "Tips:", "Idag:", "Special logic:").
4. **Note band** at the bottom: coral bold label + one sentence (e.g. "Bra att veta:", "Preliminärt:", "Sammanfattning:").
5. **Footer**: `kontek | Visma HRM Sverige AB` (text). If `brand/logo_0.png` exists, place the logo in the lower right instead/in addition.
6. **Speaker notes** on every slide.

## 3. Content principles (non-negotiable)

- **Honest caveats.** Roadmap items are always marked preliminary ("Preliminärt: … stäm av med produktteamet innan kundlöften."). Technical limitations are stated plainly.
- **Known product facts that must never be contradicted:**
  - Kontek Lön supports **FTPS, not SFTP** (no key-based authentication). Never write SFTP as supported.
  - No custom logic can be built inside Kontek Lön; logic based on file content is handled outside (Kontek can offer it as a service at an ongoing cost).
  - The report generator may **not** solve special logic like zero-padding on non-standard field types — such needs are investigated case by case.
  - Accounting file dimensions: Dim 1 = Konto (fixed), Dim 2 = Kostnadsställe, Dim 3 = Projekt (Objekt), Dim 4 = Nivå 4. An unused dimension can in some cases be repurposed to meet a receiving system's requirements.
  - Report generator data can also be retrieved via Kontek Lön's open API, including JSON format.
- **Never promise** anything to customers on behalf of Kontek; unverified AI-generated technical claims must be flagged for verification with a technician.

## 4. Quality assurance

If you can run code, always validate before delivering:

```bash
node build.js
# render to images and inspect every slide for overflow/clipping:
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

Check: no text overflow outside cards, no clipped bullets, consistent card heights, correct colors. If a card overflows, shorten bullets — do not shrink fonts below 10pt.

If you cannot run code, state that the script is unvalidated and recommend the user runs the QA steps above.

## 5. Documents (Word)

For Word deliverables use `templates/doc-template.js` (docx npm package). Same brand language: dark-green top bar + title, coral-underlined H1s, coral bullets, light-green callout box with coral top border, branded footer with page number. Keep source content verbatim unless asked to rewrite.

## 6. When unsure

Ask, don't invent: missing roadmap details, pricing, dates, and endpoint specifics must come from the user. Placeholder text is allowed if clearly marked `[TBD]`.
