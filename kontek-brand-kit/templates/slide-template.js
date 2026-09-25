// Kontek slide template - pptxgenjs
// Usage: node slide-template.js [slides.json] [output.pptx]
// Slide object: { title, subtitle, c1title, c1[], c2title, c2[], c3title, c3[], noteLabel, note, notes }
// Bullet item: { text, bold?, color?, bullet?: false }  (bullet:false = label line, no bullet glyph)
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const BRAND = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "brand", "brand.json"), "utf8"));

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625

// Kontek brand
const DARK = BRAND.colors.darkGreen;
const MED = BRAND.colors.mediumGreen;
const CORAL = BRAND.colors.coral;
const LIGHT = BRAND.colors.lightBg;
const GREY = BRAND.colors.textMuted;
const FONT = BRAND.fonts.primary;

function mosaic(slide, x, y, s) {
  // small pixel cluster, brand decorative element
  const cells = [
    [0, 0, DARK], [1, 0, MED], [3, 0, CORAL],
    [0, 1, MED], [2, 1, DARK],
    [1, 2, CORAL], [3, 2, MED],
  ];
  cells.forEach(([cx, cy, c]) => {
    slide.addShape(pres.ShapeType.rect, { x: x + cx * s, y: y + cy * s, w: s * 0.85, h: s * 0.85, fill: { color: c } });
  });
}

function card(slide, x, y, w, h, title, items, opts = {}) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.dark ? DARK : "FFFFFF" },
    line: { color: opts.dark ? DARK : "D8E2DC", width: 1 },
    shadow: { type: "outer", color: "9AA8A0", opacity: 0.25, blur: 6, offset: 2, angle: 90 },
  });
  slide.addText(title, {
    x: x + 0.16, y: y + 0.10, w: w - 0.32, h: 0.32,
    fontFace: FONT, fontSize: 13, bold: true,
    color: opts.dark ? "FFFFFF" : DARK, margin: 0, isTextBox: true,
  });
  slide.addText(items.map((t, i) => ({
    text: t.text, options: {
      bullet: t.bullet === false ? false : { code: "2022", indent: 10 },
      color: t.color || (opts.dark ? "E7EFEA" : "333B36"),
      bold: !!t.bold,
      breakLine: i < items.length - 1,
      paraSpaceAfter: 4,
    }
  })), {
    x: x + 0.16, y: y + 0.46, w: w - 0.30, h: h - 0.58,
    fontFace: FONT, fontSize: 10.5, margin: 0, isTextBox: true, valign: "top",
  });
}

function buildSlide(L) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  // Header
  slide.addText(L.title, {
    x: 0.5, y: 0.28, w: 7.6, h: 0.55, fontFace: FONT, fontSize: 28, bold: true,
    color: DARK, margin: 0, isTextBox: true,
  });
  slide.addText(L.subtitle, {
    x: 0.5, y: 0.82, w: 7.8, h: 0.35, fontFace: FONT, fontSize: 12.5,
    color: GREY, margin: 0, isTextBox: true,
  });
  mosaic(slide, 8.85, 0.32, 0.14);

  // Three cards
  const cy = 1.30, ch = 3.28;
  card(slide, 0.5, cy, 2.95, ch, L.c1title, L.c1);
  card(slide, 3.58, cy, 2.95, ch, L.c2title, L.c2);
  card(slide, 6.66, cy, 2.84, ch, L.c3title, L.c3, { dark: true });

  // Bottom note band
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.5, y: 4.72, w: 9.0, h: 0.52, rectRadius: 0.06,
    fill: { color: LIGHT }, line: { color: "D8E2DC", width: 0.75 },
  });
  slide.addText([
    { text: L.noteLabel + "  ", options: { bold: true, color: CORAL } },
    { text: L.note, options: { color: "333B36" } },
  ], {
    x: 0.68, y: 4.72, w: 8.7, h: 0.52, fontFace: FONT, fontSize: 10.5,
    margin: 0, isTextBox: true, valign: "middle",
  });

  // Footer
  slide.addText([
    { text: "kontek", options: { bold: true, color: DARK } },
    { text: "  |  Visma HRM Sverige AB", options: { color: GREY } },
  ], {
    x: 0.5, y: 5.30, w: 4.5, h: 0.25, fontFace: FONT, fontSize: 9,
    margin: 0, isTextBox: true,
  });

  slide.addNotes(L.notes);
}


const LOGO = path.join(__dirname, "..", "brand", "logo_0.png");
const slidesFile = process.argv[2] || path.join(__dirname, "..", "examples", "example-slides.json");
const outFile = process.argv[3] || "output.pptx";
const slides = JSON.parse(fs.readFileSync(slidesFile, "utf8"));

slides.forEach((s) => {
  buildSlide(s);
  if (fs.existsSync(LOGO)) {
    const sl = pres.slides[pres.slides.length - 1];
    sl.addImage({ path: LOGO, x: 8.9, y: 5.18, w: 0.9, h: 0.32 });
  }
});

pres.writeFile({ fileName: outFile }).then(() => console.log("Wrote " + outFile));
