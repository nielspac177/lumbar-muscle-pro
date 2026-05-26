# Study & Analysis Plan
**Working title:** *Iliopsoas and paraspinal muscle volume and quality predict physical-function recovery — but not leg-pain relief — after lumbar decompression*

**Target:** CNS abstract (300 words) → full manuscript (STROBE).
**Design:** Retrospective, single-cohort, observational. Imaging (CT/MRI volumetric segmentation) + longitudinal PROs.
**Status:** PLANNING. No analysis run yet.

---

## 1. Research question & hypotheses

**Question.** In patients undergoing lumbar decompression, does preoperative
volumetric muscle morphology (iliopsoas, deep back, gluteus medius) — both *size*
(volume) and *quality* (intensity) — predict patient-reported functional recovery?

| ID | Hypothesis | Outcome | Model |
|----|-----------|---------|-------|
| **H1** (primary) | Greater preop muscle volume & quality → greater improvement in PROMIS-PF at 1Y | ΔPROMIS-PF (baseline→1Y) | Linear, baseline-adjusted |
| **H2** | Same association at the early 6-week timepoint | ΔPROMIS-PF (baseline→6W) | Linear, baseline-adjusted |
| **H3** | Better muscle → higher odds of achieving MCID on PROMIS-PF | MCID achieved (yes/no) @1Y | Logistic |
| **H4** (negative control) | Muscle metrics do **NOT** predict leg-pain improvement (radicular, decompression-driven) | ΔLeg-pain NRS @1Y | Linear, baseline-adjusted |

**The story:** muscle health gates *functional* recovery (H1–H3) that decompression
alone cannot deliver, but is irrelevant to *radicular leg pain* (H4) — the surgical
target. The H4 dissociation is the mechanistic differentiator and guards against the
"sicker-patient" confound (a global frailty marker would degrade *all* outcomes equally).

---

## 2. Conceptual model (causal DAG)

```mermaid
flowchart LR
    subgraph Confounders
        AGE[Age]
        SEX[Sex]
        BMI[BMI]
        LVL[#levels / diagnosis]
    end
    MUSCLE[Preop muscle<br/>volume + quality] -->|H1-H3 +| FUNC[PROMIS-PF recovery<br/>ODI, back pain]
    MUSCLE -.->|H4 null| LEG[Leg-pain relief<br/>radicular]
    DECOMP[Decompression] --> LEG
    DECOMP --> FUNC
    AGE --> MUSCLE
    AGE --> FUNC
    SEX --> MUSCLE
    SEX --> FUNC
    BMI --> MUSCLE
    BMI --> FUNC
    LVL --> FUNC
    BASE[Baseline PRO] --> FUNC

    classDef exposure fill:#cfe8ff,stroke:#1b6ec2;
    classDef outcome fill:#d7f5d7,stroke:#2e7d32;
    classDef nullpath fill:#f5f0d7,stroke:#b8860b;
    class MUSCLE exposure;
    class FUNC outcome;
    class LEG nullpath;
```

---

## 3. Study population & patient flow (STROBE)

```mermaid
flowchart TD
    A["All lumbar decompression patients<br/>in registry (n ≈ 2,300 rows)"] --> B{"Has volumetric<br/>muscle segmentation?"}
    B -- No --> X1[Excluded: no imaging segmentation]
    B -- Yes --> C["Segmented cohort<br/>iliopsoas n≈386 · deep back n≈388 · glut med n≈252"]
    C --> D{"Has ≥1 PROMIS-PF<br/>follow-up timepoint?"}
    D -- No --> X2[Excluded: no PRO follow-up]
    D -- Yes --> E["Segmentation ∩ PROs<br/>n ≈ 160–170 per timepoint"]
    E --> F{"Complete covariates<br/>(age, sex, baseline PF)?"}
    F -- No --> X3[Excluded / multiply imputed - sensitivity]
    F -- Yes --> G["Primary analytic cohort<br/>n ≈ 124 (baseline-adjusted PF@1Y)"]

    classDef excl fill:#ffe0e0,stroke:#c62828;
    class X1,X2,X3 excl;
```

**Realistic N ≈ 120–170.** Adequate for a multivariable model with ~4–5 covariates
(rule of thumb ≥10 events/observations per predictor). Gluteus maximus (n≈60) is
**dropped** for insufficient segmentation coverage.

---

## 4. Variables

### Exposures (per-muscle, bilateral L+R summed)
- **Volume:** `Volume ( LM) cm3` — total muscle volume.
- **Quality:** `mean` intensity within the muscle mask (fat-infiltration proxy).
- **Spine-normalized volume index:** muscle volume ÷ vertebral-body volume
  (leverages the unique vertebra/disc segmentation; dimensionless sarcopenia index).
- Each exposure **z-scored within cohort** → effects reported **per 1 SD**
  (sidesteps unclear intensity units; see §7).

### Outcomes (baseline + 6W, 1Y; secondary 3M/6M/2Y)
- **Primary:** PROMIS Physical Function (T-score).
- **Secondary:** ODI; Back-pain NRS; PROMIS Pain Interference.
- **Negative control:** Leg-pain NRS.
- Modeled as **change from baseline** and as **MCID achieved** (binary).

### Covariates (a priori, from DAG)
Age, sex, BMI, number of levels, baseline value of the outcome.
Sensitivity: + ASA, diabetes, diagnosis, surgical approach.

---

## 5. Statistical analysis plan

```mermaid
flowchart TD
    L[Load Excel<br/>2-row header] --> C[Clean: winsorize volume,<br/>derive age/BMI/indices]
    C --> T[Tidy analytic frame<br/>z-score exposures]
    T --> T1[Table 1<br/>cohort description]
    T --> M1[H1/H2: OLS ΔPF ~ muscle<br/>+ age+sex+BMI+levels+baseline]
    T --> M2[H3: Logistic MCID ~ muscle + covars]
    T --> M3[H4: OLS Δleg-pain ~ muscle + covars]
    M1 --> S[Sensitivity:<br/>complete-case vs imputation,<br/>MCID threshold sweep,<br/>raw vs spine-normalized]
    M2 --> S
    M3 --> S
    S --> F[Forest plot + trajectory plot]
    F --> AB[CNS abstract draft]
```

- **Models:** multivariable OLS (continuous Δ outcomes) with robust (HC3) SE;
  logistic regression (MCID). Effects per 1 SD of exposure with 95% CI.
- **Primary estimand:** adjusted association of each muscle exposure with ΔPROMIS-PF@1Y.
- **Multiplicity:** primary = iliopsoas × PF@1Y. Others are secondary/exploratory;
  report CIs, flag as hypothesis-generating (note for abstract honesty).
- **Missing data:** primary = complete-case; sensitivity = multiple imputation.
- **MCID:** PROMIS-PF ≈ 4.5 (sweep 3.0–8.0); ODI ≈ 12.8-point / 30% change.
- **Software:** Python (pandas, statsmodels). Fully scripted & reproducible.

---

## 6. Code architecture

```mermaid
flowchart LR
    CFG[config.yaml<br/>DATA_PATH] --> DL[data_loading.py]
    DATA[(Excel data<br/>OUTSIDE repo)] -.read-only.-> DL
    DL --> CL[cleaning.py]
    CL --> CO[cohort.py]
    CO --> AN[analysis.py]
    AN --> RES[(results/ — gitignored)]
    AN --> FIG[figures.py]
    FIG --> FIGS[(figures/ — gitignored)]

    classDef ext fill:#ffe0e0,stroke:#c62828;
    class DATA ext;
```

Each module is import-safe and CLI-runnable. No hard-coded paths; everything via `config.yaml`.

---

## 7. Data-quality issues & handling
1. **Volume outliers** (iliopsoas max 170,583 cm³ vs median 88) → winsorize top 1% +
   flag physiologically implausible values; sensitivity analysis excluding them.
2. **Intensity units unclear** (range 10–953, no negatives → not CT Hounsfield;
   likely MRI signal) → never interpret as absolute HU; use **z-scored** values and/or
   **ratio to a reference tissue**; report as "relative muscle quality."
3. **Two volume methods** (LM vs sv) → use LM primary, report agreement as QC.
4. **Laterality** → sum L+R primary; explore L–R asymmetry as exploratory only.

---

## 8. Novelty positioning
See `docs/LITERATURE_REVIEW.md`. The field (paraspinal sarcopenia → spine-surgery PROs)
is active, so novelty is **incremental but defensible**, resting on the combination of:
(a) **iliopsoas + multi-muscle volumetric 3D** segmentation (vs single-slice CSA);
(b) **decompression-only** cohort with **PROMIS-PF + MCID**; (c) the **leg-pain
negative-control dissociation**; (d) a **spine-normalized** index.

---

## 9. Deliverables & sequence
1. ✅ Literature/novelty review
2. ✅ This plan + repo scaffold + mermaid diagrams
3. ⬜ Scientific schematic (study-design figure, Nano Banana) — *pending approval*
4. ⬜ Implement `src/` modules
5. ⬜ Run analysis → Table 1, models, figures
6. ⬜ Draft 300-word CNS abstract (Intro / Objective / Methods / Results / Conclusion)
7. ⬜ (Optional) interactive results dashboard

---

## 10. Limitations (anticipated, for abstract/manuscript honesty)
- Retrospective, single-cohort; associations ≠ causation.
- Moderate N (~120–170); secondary outcomes underpowered.
- Imaging modality/intensity units require careful normalization.
- Loss to follow-up at 1Y (selection bias) → compare completers vs non-completers.
- Segmentation extent may differ from anatomical totals (relative comparison valid).
