"""Assemble the analytic cohort: segmentation ∩ PROs ∩ covariates (see PLAN.md §3).

PLANNING SKELETON — interfaces only; not yet implemented.
"""
from __future__ import annotations
import pandas as pd


def build_analytic_cohort(data: pd.DataFrame, timepoint: str = "1Y Post") -> pd.DataFrame:
    """Filter to patients with muscle segmentation AND the requested PRO timepoint.
    Returns the cohort plus a flow-count dict for the STROBE diagram."""
    raise NotImplementedError


def flow_counts(data: pd.DataFrame) -> dict:
    """Return n at each STROBE step (registry → segmented → +PROs → complete-case)."""
    raise NotImplementedError
