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
          text: "Iliopsoas Fatty Infiltration, Not Muscle Volume, Predicts Failure to Achieve a Minimal Clinically Important Difference After Lumbar Decompression",
          bold: true, size: 30,
        })],
      }),
      new Paragraph({ spacing: { after: 60 },
        children: [new TextRun({ text: "Track: ", bold: true }), new TextRun("Spine")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun({ text: "Authors: ", bold: true }),
          new TextRun("Jimena Gonzales; [co-authors]; Niels Pacheco-Barrios")] }),

      // ---- Structured abstract ----
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Abstract")] }),
      sectionPara("Introduction.",
        "Paraspinal muscle status has been associated with outcomes after spine surgery, but most evidence comes from fusion cohorts or single-slice cross-sectional area, and its prognostic value after decompression is unclear, particularly whether muscle quantity or quality matters."),
      sectionPara("Objective.",
        "To determine whether preoperative volumetric size or fatty infiltration of the iliopsoas and paraspinal muscles predicts achievement of a minimal clinically important difference (MCID) one year after lumbar decompression."),
      sectionPara("Methods.",
        "In a retrospective cohort undergoing lumbar decompression, preoperative MRI underwent volumetric segmentation of the iliopsoas, deep back, and gluteus medius muscles (n=385; mean age 62.8±13.3 years; 47% female). For each muscle we computed bilateral volume (normalized to vertebral-body volume) and fatty infiltration, indexed by intramuscular signal heterogeneity (coefficient of variation and normalized interpercentile spread); all exposures were standardized. Multivariable logistic regression modeled MCID attainment on the Oswestry Disability Index (≥12.8) and PROMIS Physical Function (≥4.5) at one year, adjusting for age, sex, and baseline score, yielding odds ratios per standard deviation. Radicular leg pain served as a prespecified negative control."),
      sectionPara("Results.",
        "161 and 169 patients had one-year ODI and PROMIS-PF; 61% and 67% achieved MCID (mean ODI 48.6→27.4; PROMIS-PF 33.7→41.6). Muscle volume was not associated with MCID for any muscle (all p>0.40). Greater iliopsoas fatty infiltration was associated with lower odds of achieving ODI MCID (OR 0.60 per SD; 95% CI 0.40–0.91; p=0.015) and PROMIS-PF MCID (OR 0.70; 0.48–1.02; p=0.06), independent of volume (OR 0.66; p=0.033). Associations were specific to the iliopsoas; the deep back, gluteus medius, and the leg-pain negative control were null."),
      sectionPara("Conclusion.",
        "After lumbar decompression, muscle quality (iliopsoas fatty infiltration), rather than muscle volume, predicted failure to achieve clinically meaningful improvement in disability and physical function. The iliopsoas may inform preoperative risk stratification and prehabilitation. These exploratory findings should be confirmed with quantitative fat-fraction imaging."),

      // ---- Figures ----
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Figures")] }),
      ...img("graphical_abstract.png", 2.02,
        "Figure 1. Visual summary. (A) Achievement of Oswestry Disability Index (ODI) MCID at one year declines across tertiles of preoperative iliopsoas fatty infiltration. (B) PROMIS Physical Function recovery over 24 months by low versus high iliopsoas fatty infiltration (median split). Error bars, 95% CI."),
      ...img("forest_mcid.png", 1.28,
        "Figure 2. Adjusted odds ratios (per 1 SD) for achieving MCID at one year, contrasting muscle size (spine-normalized volume) with quality (fatty-infiltration texture) for each muscle. Logistic regression adjusted for age, sex, and baseline score; reference line at OR=1.", 560),
      ...img("mcid_by_tertile.png", 1.79,
        "Figure 3. Percentage achieving ODI and PROMIS Physical Function MCID at one year across iliopsoas fatty-infiltration tertiles. Error bars, Wilson 95% CI; n shown per bar.", 540),
      ...img("trajectory.png", 1.43,
        "Figure 4. PROMIS Physical Function (T-score) over time, stratified by low versus high iliopsoas fatty infiltration (median split). Error bars, 95% CI; dotted line, US population norm (T=50).", 470),
      ...img("forest_pf_legpain.png", 1.12,
        "Figure 5. Adjusted per-SD associations (ANCOVA) of each muscle exposure with one-year PROMIS Physical Function (continuous) and the leg-pain negative control; reference line at 0.", 540),

      new Paragraph({ spacing: { before: 240 },
        children: [new TextRun({ size: 16, italics: true, color: "777777",
          text: "Exploratory analysis; the fatty-infiltration index is an imaging proxy pending validation against a quantitative fat fraction. Generated from the analysis pipeline in this repository (code only; no patient data)." })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(ROOT, "docs", "Abstract_with_figures.docx");
  fs.writeFileSync(out, buf);
  console.log("wrote " + out + " (" + buf.length + " bytes)");
});
