"""Delete old uploaded files that are no longer referenced by the database.

Run from backend directory after loading .env:
    python -m app.scripts.cleanup_orphan_media --hours 24

Files newer than the threshold are left alone, which prevents an in-progress form upload
from being removed before the Owner has had time to save it.
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

from sqlalchemy import select

from app.config import settings
from app.database import SessionLocal
from app.models import Cabang, Dokumentasi, Kamar, PengaturanSitus


def normalize_path(value: str | None) -> str | None:
    if not value or "/media/" not in value:
        return None
    return value.split("/media/", 1)[1].lstrip("/")


def referenced_paths() -> set[str]:
    references: set[str] = set()

    with SessionLocal() as db:
        values = [
            *db.scalars(select(Cabang.url_gambar).where(Cabang.url_gambar.is_not(None))).all(),
            *db.scalars(select(Kamar.url_gambar).where(Kamar.url_gambar.is_not(None))).all(),
            *db.scalars(select(Dokumentasi.path_foto)).all(),
            *db.scalars(
                select(PengaturanSitus.hero_image).where(PengaturanSitus.hero_image.is_not(None))
            ).all(),
        ]

    for value in values:
        normalized = normalize_path(value)
        if normalized:
            references.add(normalized)

    return references


def cleanup(hours: float) -> tuple[int, int]:
    root = settings.upload_path
    references = referenced_paths()
    cutoff = time.time() - max(hours, 0) * 3600
    removed = 0
    kept = 0

    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        if relative in references or path.stat().st_mtime > cutoff:
            kept += 1
            continue
        path.unlink(missing_ok=True)
        removed += 1

    return removed, kept


def main() -> None:
    parser = argparse.ArgumentParser(description="Bersihkan media upload yang tidak lagi dipakai.")
    parser.add_argument(
        "--hours",
        type=float,
        default=24,
        help="Hanya hapus file orphan yang lebih tua dari jumlah jam ini (default: 24).",
    )
    args = parser.parse_args()

    removed, kept = cleanup(args.hours)
    print(f"Media orphan dihapus: {removed}; file dipertahankan: {kept}")


if __name__ == "__main__":
    main()
