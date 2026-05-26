"""Models for H1-H4 (see PLAN.md §1, §5). Effects reported per 1 SD of exposure.

PLANNING SKELETON — interfaces only; not yet implemented.
"""
from __future__ import annotations
import pandas as pd

COVARIATES = ["age", "sex", "bmi", "num_level"]  # + baseline outcome added per-model


def linear_change_model(df, exposure, delta_outcome, baseline_outcome):
    """H1/H2/H4: OLS Δoutcome ~ exposure + covariates + baseline, HC3 robust SE.
    Returns beta (per SD), 95% CI, p."""
    raise NotImplementedError


def mcid_logistic(df, exposure, mcid_flag):
    """H3: logistic MCID-achieved ~ exposure + covariates. Returns OR, 95% CI, p."""
    raise NotImplementedError


def run_all(cohort: pd.DataFrame) -> pd.DataFrame:
    """Run H1-H4 across the three muscles × (volume, quality), assemble a tidy
    results table (estimate, CI, p, model) for the forest plot and abstract."""
    raise NotImplementedError


def sensitivity(cohort: pd.DataFrame) -> dict:
    """MCID-threshold sweep, raw vs spine-normalized exposure, complete-case vs
    multiple imputation, with/without outlier exclusion."""
    raise NotImplementedError
