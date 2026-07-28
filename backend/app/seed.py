from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.security import hash_password


def seed_database(db: Session) -> None:
    """
    Membuat akun admin awal apabila credential seed tersedia.

    Seeder tidak memasukkan data kamar, cabang, fasilitas,
    dokumentasi, atau pengaturan situs karena data tersebut
    dikelola melalui database/migration dan dashboard admin.
    """

    username = settings.seed_admin_username
    password = settings.seed_admin_password

    # Seed admin tidak diaktifkan
    if not username or not password:
        print("[seed] Admin seed dilewati.")
        return

    try:
        # Cek admin existing
        existing_admin = db.execute(
            text(
                """
                SELECT id
                FROM akun_admin
                WHERE username = :username
                LIMIT 1
                """
            ),
            {
                "username": username,
            },
        ).first()

        if existing_admin:
            print(
                f"[seed] Admin '{username}' sudah ada. "
                "Tidak membuat akun baru."
            )
            return

        # Buat admin baru
        password_hash = hash_password(password)

        db.execute(
            text(
                """
                INSERT INTO akun_admin (
                    username,
                    password_hash,
                    aktif
                )
                VALUES (
                    :username,
                    :password_hash,
                    1
                )
                """
            ),
            {
                "username": username,
                "password_hash": password_hash,
            },
        )

        db.commit()

        print(
            f"[seed] Admin '{username}' berhasil dibuat."
        )

    except SQLAlchemyError:
        db.rollback()
        raise