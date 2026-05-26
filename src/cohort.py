"""Assemble the analytic cohort and report patient-flow counts (PLAN.md §3)."""
from __future__ import annotations
import pandas as pd

SEG_KEY = "iliopsoas_vol"      # presence of iliopsoas segmentation defines the imaged cohort


def flow_counts(tidy: pd.DataFrame) -> dict:
    """Counts at each STROBE step for the primary (PROMIS-PF at 1 year) analysis."""
    seg = tidy[SEG_KEY].notna()
    has_base = seg & tidy["pf_base"].notna()
    has_1y = has_base & tidy["pf_1y"].notna()
    cc = has_1y & tidy["age"].notna() & tidy["sex"].notna()
    return {
        "registry_rows": int(len(tidy)),
        "segmented": int(seg.sum()),
        "segmented_with_baseline_PF": int(has_base.sum()),
        "segmented_with_1Y_PF": int(has_1y.sum()),
        "primary_complete_case": int(cc.sum()),
    }


def completers_vs_noncompleters(tidy: pd.DataFrame) -> pd.DataFrame:
    """Compare baseline characteristics of 1Y completers vs non-completers
    among the segmented cohort, to assess attrition bias."""
    seg = tidy[tidy[SEG_KEY].notna()].copy()
    seg["completer_1y"] = seg["pf_1y"].notna()
    cols = ["age", "pf_base", "odi_base", "leg_base", "iliopsoas_vol", "iliopsoas_qual"]
    return seg.groupby("completer_1y")[cols].agg(["mean", "count"]).T


def analytic_cohort(tidy: pd.DataFrame, outcome="pf", timepoint="1y") -> pd.DataFrame:
    """Rows with imaging plus baseline and the requested follow-up of `outcome`."""
    need = [SEG_KEY, f"{outcome}_base", f"{outcome}_{timepoint}", "age", "sex"]
    return tidy[tidy[need].notna().all(axis=1)].copy()
