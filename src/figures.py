"""Figures for abstract/manuscript (see PLAN.md §9). Saved to figures/ (gitignored).

PLANNING SKELETON — interfaces only; not yet implemented.
"""
from __future__ import annotations
import pandas as pd


def forest_plot(results: pd.DataFrame, out="figures/forest.png"):
    """Per-SD adjusted effects of each muscle exposure on ΔPROMIS-PF@1Y, with the
    leg-pain negative control shown alongside to display the dissociation (H1 vs H4)."""
    raise NotImplementedError


def trajectory_plot(cohort: pd.DataFrame, out="figures/trajectory.png"):
    """PROMIS-PF over time (baseline→6W→1Y) stratified by low vs high muscle quality."""
    raise NotImplementedError


def strobe_diagram(flow: dict, out="figures/strobe.png"):
    """Render the patient-flow counts (alternative to the mermaid version in PLAN.md)."""
    raise NotImplementedError
