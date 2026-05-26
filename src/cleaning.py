"""Derive analysis variables and handle data-quality issues (see PLAN.md §7).

PLANNING SKELETON — interfaces only; not yet implemented.
"""
from __future__ import annotations
import pandas as pd


def derive_demographics(data: pd.DataFrame) -> pd.DataFrame:
    """Add age (dos - dob, years) and BMI (weight_kg / (height_cm/100)**2)."""
    raise NotImplementedError


def winsorize_volumes(data: pd.DataFrame, limits=(0.0, 0.01)) -> pd.DataFrame:
    """Cap physiologically implausible muscle-volume outliers (top 1% by default).

    Iliopsoas max was 170,583 cm3 vs median ~88 — segmentation/entry errors.
    """
    raise NotImplementedError


def build_muscle_exposures(data: pd.DataFrame) -> pd.DataFrame:
    """Bilateral (L+R) volume and mean-intensity for iliopsoas, deep back, glut medius;
    spine-normalized volume = muscle volume / vertebral-body volume; z-score each."""
    raise NotImplementedError


def build_outcomes(data: pd.DataFrame) -> pd.DataFrame:
    """Extract baseline/6W/1Y PROMIS-PF, ODI, back & leg NRS; compute change scores
    and MCID-achieved flags."""
    raise NotImplementedError
