"""End-to-end analysis orchestration (see PLAN.md §5, §6).

This module defines the call order of the pipeline. Leaf functions are
implemented in their respective modules; running `run()` executes the full
analysis once those are implemented and `config.yaml` points to the dataset.

    config -> load -> clean -> cohort -> models -> figures

PLANNING SPINE — the call structure is real; the leaf computations are pending.
"""
from __future__ import annotations

from .data_loading import load_config, load_raw
from .cleaning import (
    derive_demographics,
    winsorize_volumes,
    build_muscle_exposures,
    build_outcomes,
)
from .cohort import build_analytic_cohort, flow_counts
from .analysis import run_all, sensitivity
from .figures import forest_plot, trajectory_plot, strobe_diagram


def prepare(config_path: str = "config.yaml"):
    """Load and transform the source data into a tidy, analysis-ready frame."""
    cfg = load_config(config_path)
    data = load_raw(cfg)
    data = derive_demographics(data)
    data = winsorize_volumes(data, tuple(cfg["WINSOR_LIMITS"]))
    data = build_muscle_exposures(data)
    data = build_outcomes(data)
    return cfg, data


def run(config_path: str = "config.yaml"):
    """Run the full study pipeline and write figures and result tables."""
    cfg, data = prepare(config_path)
    flow = flow_counts(data)
    cohort = build_analytic_cohort(data, timepoint="1Y Post")

    results = run_all(cohort)
    sens = sensitivity(cohort)

    forest_plot(results)
    trajectory_plot(cohort)
    strobe_diagram(flow)
    return results, sens


if __name__ == "__main__":
    run()
