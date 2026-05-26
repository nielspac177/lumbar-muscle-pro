# Paraspinal & Iliopsoas Muscle Morphology and Patient-Reported Outcomes after Lumbar Decompression

Analysis code for a retrospective study testing whether **volume and quality of the
iliopsoas, deep back, and gluteus medius muscles** predict recovery in **PROMIS
Physical Function** (and other PROs) after lumbar decompression — and whether muscle
metrics predict *functional* recovery but **not** radicular leg-pain relief
(a mechanistic negative control).

> **Target output:** Congress of Neurological Surgeons (CNS) abstract.

## ⚠️ Data policy
This repository contains **code only**. The patient dataset (CT/MRI-derived muscle
segmentations + PROs) contains PHI and is **never** committed. The data file lives
*outside* this repo; point the code to it via `config.yaml` (see `config.example.yaml`).
`.gitignore` blocks all spreadsheet/DICOM/data formats as a second safeguard.

## Repository layout
```
lumbar-muscle-pro/
├── PLAN.md                 # Full study + analysis plan (read this first)
├── docs/LITERATURE_REVIEW.md  # Novelty assessment vs prior work
├── config.example.yaml     # Template — copy to config.yaml and set DATA_PATH
├── requirements.txt
├── src/
│   ├── data_loading.py     # Parse the 2-row Excel header → tidy frame
│   ├── cleaning.py         # Winsorize volume outliers, derive age/BMI/indices
│   ├── cohort.py           # Build the analytic cohort (segmentation ∩ PROs)
│   ├── analysis.py         # Regression + MCID logistic + negative-control models
│   └── figures.py          # Forest plot, trajectory plot, STROBE diagram
├── notebooks/              # Exploratory work
├── figures/                # Generated figures (gitignored)
└── results/                # Generated tables/model output (gitignored)
```

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp config.example.yaml config.yaml   # then edit DATA_PATH
```

## Status
Planning phase — see `PLAN.md`. No analysis has been run yet.
