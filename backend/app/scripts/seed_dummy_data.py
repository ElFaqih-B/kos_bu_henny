"""Isi data development pada tabel yang masih kosong.

Jalankan dari folder backend:
    python -m app.scripts.seed_dummy_data

Seed mengikuti SEED_DUMMY_DATA pada .env dan tidak menghapus data existing.
"""

from app.database import Base, SessionLocal, engine
from app.seed import seed_database


def main() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database(db)
    print("Seed selesai. Data existing tidak dihapus atau ditimpa.")


if __name__ == "__main__":
    main()
