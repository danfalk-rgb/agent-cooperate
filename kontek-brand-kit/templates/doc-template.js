const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, convertInchesToTwip, ShadingType, BorderStyle, Footer,
  PageNumber, Table, TableRow, TableCell, WidthType, VerticalAlign,
} = require("docx");
const fs = require("fs");

// Kontek document template - docx (npm)
// Reference implementation of the Kontek Word style.
// Edit the content section; keep styles, numbering, footer and callout as-is.
const path = require("path");
const BRAND = JSON.parse(require("fs").readFileSync(path.join(__dirname, "..", "brand", "brand.json"), "utf8"));
const DARK = BRAND.colors.darkGreen;
const MED = BRAND.colors.mediumGreen;
const CORAL = BRAND.colors.coral;
const LIGHT = BRAND.colors.lightBg;
const GREY = BRAND.colors.textMuted;

const bullet = (children) => new Paragraph({
  numbering: { reference: "kontek-bullets", level: 0 },
  spacing: { after: 120 },
  children,
});
const t = (text, opts = {}) => new TextRun({ text, font: "Calibri", size: 21, color: "333B36", ...opts });

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 21, color: "333B36" } },
    },
    paragraphStyles: [
      {
        id: "KTitle", name: "K Title", basedOn: "Normal",
        run: { font: "Calibri", size: 52, bold: true, color: DARK },
        paragraph: { spacing: { after: 80 } },
      },
      {
        id: "KSub", name: "K Subtitle", basedOn: "Normal",
        run: { font: "Calibri", size: 22, italics: true, color: GREY },
        paragraph: { spacing: { after: 60 } },
      },
      {
        id: "KH1", name: "K Heading 1", basedOn: "Normal", next: "Normal",
        run: { font: "Calibri", size: 28, bold: true, color: DARK },
        paragraph: {
          spacing: { before: 320, after: 160 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: CORAL, space: 4 } },
          outlineLevel: 0,
        },
      },
    ],
  },
  numbering: {
    config: [{
      reference: "kontek-bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: {
          run: { color: CORAL, bold: true },
          paragraph: { indent: { left: convertInchesToTwip(0.30), hanging: convertInchesToTwip(0.18) } },
        },
      }],
    }],
  },
  sections: [{
    properties: {
      page: { margin: { top: 1080, bottom: 1080, left: 1180, right: 1180 } },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D8E2DC", space: 4 } },
          tabStops: [{ type: "right", position: 9880 }],
          children: [
            new TextRun({ text: "kontek", font: "Calibri", size: 18, bold: true, color: DARK }),
            new TextRun({ text: "  |  Visma HRM Sverige AB", font: "Calibri", size: 18, color: GREY }),
            new TextRun({ text: "\t", font: "Calibri", size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 18, color: GREY }),
          ],
        })],
      }),
    },
    children: [
      // Top accent bar
      new Paragraph({
        spacing: { after: 240 },
        shading: { type: ShadingType.CLEAR, fill: DARK },
        children: [new TextRun({ text: " ", size: 8 })],
      }),
      new Paragraph({ style: "KTitle", children: [new TextRun({ text: "Kontek Lön — Employee Record Update Logic", font: "Calibri", size: 52, bold: true, color: DARK })] }),
      new Paragraph({ style: "KSub", children: [new TextRun({ text: "Quick reference: startDate correction vs. staff category change", font: "Calibri", size: 22, italics: true, color: GREY })] }),

      new Paragraph({ style: "KH1", children: [new TextRun({ text: "1. Correcting an Employment Period's startDate", font: "Calibri", size: 28, bold: true, color: DARK })] }),
      bullet([
        t("Include the record's "), t("id", { bold: true }), t(" → updates it in place. Omit "), t("id", { bold: true }),
        t(" → creates a new record. Omit the record entirely → "), t("deletes it.", { bold: true, color: CORAL }),
      ]),
      bullet([
        t("The list is fully replaced on PUT", { bold: true }), t(" — resend "), t("all", { bold: true }),
        t(" employment periods, including unchanged ones with their original ids."),
      ]),
      bullet([
        t("Change only "), t("startDate", { bold: true }),
        t(" on the target record — keep its id, employmentType, endDate, and quitReason as-is."),
      ]),
      bullet([
        t("Check for overlaps: ", { bold: true }), t("moving startDate "), t("earlier", { bold: true }),
        t(" may overlap the previous period's endDate (adjust it); moving it "), t("later", { bold: true }),
        t(" may leave an unintended gap."),
      ]),
      bullet([
        t("Never change "), t("employmentType", { bold: true }),
        t(" in the same operation — close the old period and create a new one instead."),
      ]),

      new Paragraph({ style: "KH1", children: [new TextRun({ text: "2. Staff Category Change (Re-Creation Workflow)", font: "Calibri", size: 28, bold: true, color: DARK })] }),
      bullet([
        t("Old record renamed with "), t("XXX_", { bold: true }), t(" prefix, freeing up the original employee ID."),
      ]),
      bullet([
        t("Active employment period on the old record is closed the day before the new category's start date."),
      ]),
      bullet([
        t("A new employee record is created on the original ID, assigned to the new category."),
      ]),
      bullet([
        t("Repeated or reverted category changes repeat this same workflow every time."),
      ]),
      bullet([
        t("Salary balance variables invalid in the target category are dropped automatically; each change logs a warning for manual review."),
      ]),

      new Paragraph({ spacing: { before: 320 }, children: [] }),

      // Key difference callout
      new Table({
        width: { size: 9880, type: WidthType.DXA },
        columnWidths: [9880],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 24, color: CORAL },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "D8E2DC" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "D8E2DC" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "D8E2DC" },
        },
        rows: [new TableRow({
          children: [new TableCell({
            width: { size: 9880, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: LIGHT },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [new TextRun({ text: "Key Difference", font: "Calibri", size: 24, bold: true, color: DARK })],
              }),
              new Paragraph({
                children: [
                  t("Part 1 edits a single date field "), t("in place", { bold: true }),
                  t(" on the existing record. Part 2 "), t("closes and re-creates", { bold: true }),
                  t(" the entire employee record. A simple date fix never requires the "),
                  t("XXX_", { bold: true }), t(" rename/re-creation workflow."),
                ],
              }),
            ],
          })],
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("output.docx", buf);
  console.log("done");
});
