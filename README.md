# Preoperative muscle morphology and functional recovery after lumbar decompression

This repository contains the analysis code for an observational study examining
whether the **volume and quality of the iliopsoas, deep back, and gluteus medius
muscles**, measured on preoperative volumetric imaging, predict patient-reported
functional recovery after lumbar decompression. The primary endpoint is the change
in the Patient-Reported Outcomes Measurement Information System (PROMIS) Physical
Function score. We further test whether muscle morphology predicts improvement in
disability (Oswestry Disability Index) and back pain, but **not** radicular leg pain,
which is governed by neural decompression and therefore serves as a prespecified
negative control.

## Aim and hypotheses

We hypothesise that greater preoperative muscle volume and quality are associated with
greater improvement in physical function and higher odds of achieving a minimal
clinically important difference (MCID) at one year, and that these associations are
absent for radicular leg pain. The full set of hypotheses, the assumed causal
structure, and the statistical analysis plan are documented in [`PLAN.md`](PLAN.md).

## Data availability and ethics

The patient dataset comprises imaging-derived muscle segmentations linked to
longitudinal patient-reported outcomes and therefore contains protected health
information. **No patient data are stored in this repository.** Analyses read the
source workbook from a local path defined in `config.yaml`, which is excluded from
version control. The `.gitignore` additionally blocks all tabular, spreadsheet, and
imaging file formats as a second safeguard. Investigators with appropriate approvals
should obtain the dataset through the study's data-governance process.

## Repository structure

| Path | Contents |
| --- | --- |
| `PLAN.md` | Study and analysis plan: hypotheses, causal model, STROBE flow, statistics |
| `docs/ABSTRACT.md` | CNS abstract draft (300 words, structured) |
| `docs/Abstract_with_figures.docx` / `.pdf` | Submission package: abstract + embedded figures |
| `docs/figures/` | Result figures (forest plots, responder gradient, trajectory, graphical abstract) |
| `docs/LITERATURE_REVIEW.md` | Assessment of novelty relative to prior literature |
| `docs/CODE_WALKTHROUGH.pdf` | Line-by-line explanation of the analysis code |
| `docs/callgraph.*` | Function call graph of the analysis pipeline |
| `docs/study_design_schematic.*` | Conceptual study-design figure |
| `src/data_loading.py` | Read the workbook and flatten its two-row header |
| `src/cleaning.py` | Derive analysis variables; handle outliers and units |
| `src/cohort.py` | Assemble the analytic cohort (segmentation ∩ outcomes) |
| `src/analysis.py` | Regression, MCID, and negative-control models |
| `src/figures.py` | Forest, trajectory, and patient-flow figures |
| `src/make_schematic.py` | Generate the study-design schematic |
| `src/callgraph.py` | Generate the function call graph |

Generated analysis outputs are written to `figures/` and `results/`, which are not
tracked; all such outputs are reproducible from the source data and the code.

## Reproducing the environment

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp config.example.yaml config.yaml   # set DATA_PATH to the local dataset
```

## Statistical approach

Exposures are standardised within the cohort, and associations are reported per
standard deviation with 95% confidence intervals. Change scores are modelled by
multivariable linear regression with robust standard errors and adjustment for the
baseline value; MCID attainment is modelled by logistic regression. Prespecified
sensitivity analyses address the MCID threshold, raw versus spine-normalised exposures,
and complete-case versus multiply imputed data. Details are in [`PLAN.md`](PLAN.md).

## Status

Planning phase. The analysis modules are specified but not yet executed against the
data.
