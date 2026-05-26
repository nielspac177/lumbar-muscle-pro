// Build the CNS abstract submission package (.docx) with embedded figures.
// Usage: node scripts/build_docx.js   (run from repo root; figures in figures/)
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel,
  PageOrientation,
} = require("docx");

const ROOT = path.resolve(__dirname, "..");
const FIG = (name) => fs.readFileSync(path.join(ROOT, "figures", name));

// content width ~6.5 in = 624 px at 96 dpi
const CW = 624;
const img = (file, aspect, caption, width = CW) =>
  [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      children: [
        new ImageRun({
          type: "png",
          data: FIG(file),
          transformation: { width, height: Math.round(width / aspect) },
          altText: { title: caption, description: caption, name: file },
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: caption, size: 18, italics: true })],
    }),
  ];

const sectionPara = (label, text) =>
  new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({ text: label + "  ", bold: true }),
      new TextRun({ text }),
    ],
  });

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 30, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // ---- Title block ----
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "Scanner-Normalized Paraspinal and Iliopsoas Muscle T2 Signal Predicts Functional Recovery After Lumbar Decompression: A Covariate-Adjusted Analysis",
          bold: true, size: 30,
        })],
      }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Track: ", bold: true }), new TextRun("Spine")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun({ text: "Authors: ", bold: true }),
          new TextRun("Jimena Gonzalez-Salido; Niels Pacheco-Barrios; [co-authors]; Ziev B. Moses; Martina Stippler")] }),

      // ---- Structured abstract ----
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Abstract")] }),
      sectionPara("Introduction.",
        "Paraspinal and iliopsoas muscle quality on MRI may predict recovery after lumbar decompression, but prior analyses used raw, scanner-dependent T2 intensity and unadjusted correlations, conflating muscle biology with acquisition."),
      sectionPara("Objective.",
        "To test whether scanner-normalized T2 signal and T2 heterogeneity of the paraspinal and iliopsoas muscles predict functional recovery after lumbar decompression."),
      sectionPara("Methods.",
        "In a retrospective cohort (n=385; mean age 62.8±13.4 years; 47% female), preoperative T2-weighted MRI underwent 3D segmentation of the iliopsoas and deep back muscles. Mean muscle T2 was normalized to spinal-cord signal (scanner-robust), and intramuscular heterogeneity indexed by the coefficient of variation; exposures were standardized. Multivariable regression modeled change in PROMIS Global Physical Health and Oswestry Disability Index (ODI) from 6 weeks to 1 year, adjusting for age, sex, and baseline (per 1 SD). Logistic regression modeled attainment of a minimal clinically important difference (MCID; ODI ≥12.8, PROMIS Physical Function ≥4.5). Radicular leg pain was a prespecified negative control."),
      sectionPara("Results.",
        "Higher cord-normalized iliopsoas T2 predicted greater improvement in PROMIS Global Physical Health (PH) at 3 months (β=+1.11; 95% CI 0.54 to 1.69; p<0.001) and greater ODI reduction at 3 months (β=−3.05; −5.19 to −0.90; p=0.005) and 1 year (β=−2.40; −4.48 to −0.32; p=0.023); the deep back muscle showed concordant 3-month effects (PH p=0.027; ODI p=0.050). Greater iliopsoas T2 heterogeneity predicted lower odds of ODI MCID (OR 0.60; 0.40 to 0.91; p=0.015) and PROMIS-PF MCID (OR 0.70; 0.48 to 1.02; p=0.06), independent of volume. Volume and back/leg pain showed no associations."),
      sectionPara("Conclusion.",
        "Scanner-normalized paraspinal and iliopsoas T2 signal independently predicted early functional and disability improvement after lumbar decompression, including a durable 1-year disability effect not evident in unadjusted raw-signal analyses, whereas greater T2 heterogeneity predicted lower odds of clinically meaningful improvement. Higher T2 tracking better recovery suggests reversible edema or inflammation rather than chronic fat; quantitative fat-water imaging is warranted."),

      // ---- Figures ----
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Figures")] }),
      ...img("forest_t2_timecourse.png", 1.0,
        "Figure 1. Primary analysis. Adjusted per-SD effect of cord-normalized paraspinal and iliopsoas T2 signal on change in PROMIS Global Physical Health and the Oswestry Disability Index across postoperative timepoints (age-, sex-, and baseline-adjusted; HC3 robust SE). For PH, positive values indicate improvement; for ODI, negative values indicate improvement. Reference line at 0.", 540),
      ...img("graphical_abstract.png", 2.02,
        "Figure 2. Visual summary of the secondary heterogeneity analysis. (A) Achievement of ODI MCID at one year by tertile of preoperative iliopsoas T2 heterogeneity. (B) PROMIS Physical Function recovery by low versus high heterogeneity. Error bars, 95% CI."),
      ...img("forest_mcid.png", 1.28,
        "Figure 3. Secondary analysis. Adjusted odds ratios (per 1 SD) for achieving MCID at one year, contrasting muscle size (spine-normalized volume) with quality (T2 heterogeneity) for each muscle; reference line at OR=1.", 560),
      ...img("mcid_by_tertile.png", 1.79,
        "Figure 4. Percentage achieving ODI and PROMIS Physical Function MCID at one year across iliopsoas T2-heterogeneity tertiles. Error bars, Wilson 95% CI; n per bar.", 540),
      ...img("forest_pf_legpain.png", 1.12,
        "Figure 5. Per-SD associations of each muscle exposure with one-year PROMIS Physical Function (continuous) and the leg-pain negative control; reference line at 0.", 540),

      new Paragraph({ spacing: { before: 240 },
        children: [new TextRun({ size: 16, italics: true, color: "777777",
          text: "Conventional T2 signal is a proxy pending validation against quantitative fat-water imaging; the heterogeneity result is hypothesis-generating. Generated from the analysis pipeline in this repository (code only; no patient data)." })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(ROOT, "docs", "Abstract_with_figures.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote " + out + " (" + buf.length + " bytes)");
});
