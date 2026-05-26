"""End-to-end analysis orchestration (PLAN.md §5, §6).

    config -> load -> tidy -> cohort -> models -> figures
"""
from __future__ import annotations
import os

from .data_loading import load_config, load_raw
from .cleaning import make_tidy
from .cohort import flow_counts, completers_vs_noncompleters, analytic_cohort
from .analysis import (run_all, mcid_table, quality_direction, t2_timecourse_table,
                       ph_mcid_threshold_sweep)
from .figures import (jama_forest, jama_forest_or, trajectory_plot,
                      mcid_by_tertile, graphical_abstract)


def prepare(config_path: str = "config.yaml"):
    """Load the workbook and build the tidy, analysis-ready per-patient frame."""
    cfg = load_config(config_path)
    data = load_raw(cfg)
    tidy = make_tidy(data, cfg)
    return cfg, tidy


def run(config_path: str = "config.yaml", outdir="results", figdir="figures"):
    """Run the full study pipeline and write result tables and figures."""
    os.makedirs(outdir, exist_ok=True)
    cfg, tidy = prepare(config_path)

    flow = flow_counts(tidy)
    # Segmented cohort; each model drops to its own outcome's complete cases so that
    # ODI and PROMIS-PF analyses each use their maximal available sample.
    seg = tidy[tidy["iliopsoas_vol"].notna()].copy()

    qdir = quality_direction(seg)
    t2tc = t2_timecourse_table(seg)        # PRIMARY: cord-normalized T2 -> recovery over time
    results = run_all(seg)                 # continuous ANCOVA (PF + leg-pain control)
    mcid = mcid_table(seg)                 # SECONDARY: size vs quality -> MCID odds
    ph_sweep = ph_mcid_threshold_sweep(seg)  # sensitivity: Global-PH MCID threshold

    ph_sweep.to_csv(f"{outdir}/ph_mcid_threshold_sweep.csv", index=False)
    t2tc.to_csv(f"{outdir}/t2_timecourse_results.csv", index=False)
    results.to_csv(f"{outdir}/forest_results.csv", index=False)
    mcid.to_csv(f"{outdir}/mcid_results.csv", index=False)
    qdir.to_csv(f"{outdir}/quality_direction.csv", index=False)
    completers_vs_noncompleters(tidy).to_csv(f"{outdir}/attrition.csv")

    # PRIMARY figure: cord-normalized T2 signal vs change in PH and ODI over time
    jama_forest(t2tc, out=f"{figdir}/forest_t2_timecourse.png",
                title="Cord-normalized paraspinal T2 signal and postoperative recovery",
                xlabel="← worse change      |      better change →   (ΔPH ↑ better; ΔODI ↓ better)",
                col_header="Muscle (per 1 SD higher T2)")
    jama_forest_or(mcid, out=f"{figdir}/forest_mcid.png")          # secondary
    jama_forest(results, out=f"{figdir}/forest_pf_legpain.png")    # neg control
    mcid_by_tertile(tidy, out=f"{figdir}/mcid_by_tertile.png")
    graphical_abstract(tidy, out=f"{figdir}/graphical_abstract.png")
    trajectory_plot(tidy, out=f"{figdir}/trajectory.png", strat="z_iliopsoas_texture")
    return {"flow": flow, "t2_timecourse": t2tc, "results": results,
            "mcid": mcid, "quality_direction": qdir}


if __name__ == "__main__":
    run()
