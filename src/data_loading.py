"""Load the lumbar-decompression workbook and flatten its two-row header.

The source Excel has a two-level header: row 0 = structure/group label
(e.g. "left iliopsoas muscle"), forward-filled across its metric block; row 1 =
metric (e.g. "Volume ( LM) cm3", "mean"). Data starts at row 2. This module turns
that into a tidy DataFrame with "group | metric" column names.

The data file lives OUTSIDE this repo; its path comes from config.yaml.
"""
from __future__ import annotations
import pandas as pd
import yaml


def load_config(path: str = "config.yaml") -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def load_raw(cfg: dict) -> pd.DataFrame:
    """Read the workbook and build flat 'group | metric' column names.

    Returns the data rows (header rows stripped) with readable columns.
    """
    raw = pd.read_excel(cfg["DATA_PATH"], sheet_name=cfg["SHEET"], header=None)
    g = raw.iloc[cfg["HEADER_GROUP_ROW"]].ffill()
    m = raw.iloc[cfg["HEADER_METRIC_ROW"]]
    cols = []
    for gi, mi in zip(g, m):
        gi = "" if pd.isna(gi) else str(gi).strip()
        mi = "" if pd.isna(mi) else str(mi).strip()
        cols.append((f"{gi} | {mi}").strip(" |"))
    data = raw.iloc[cfg["DATA_START_ROW"]:].reset_index(drop=True)
    data.columns = cols
    return data


def col(data: pd.DataFrame, substr: str) -> pd.Series | None:
    """Fetch the first column whose flattened name contains `substr` (case-insensitive)."""
    hits = [c for c in data.columns if substr.lower() in c.lower()]
    return data[hits[0]] if hits else None
