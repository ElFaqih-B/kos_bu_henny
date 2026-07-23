"""Tambah CMS Kos Bu Henny tanpa menghapus data existing.

Revision ID: 20260722_01
Revises: None
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

from app.database import Base
from app import models  # noqa: F401

revision = "20260722_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    # Membuat tabel yang belum ada. Existing akun_admin/cabang/kamar tidak disentuh.
    Base.metadata.create_all(bind=bind)

    inspector = inspect(bind)
    if "kamar" in inspector.get_table_names():
        columns = {column["name"] for column in inspector.get_columns("kamar")}
        if "slug" not in columns:
            op.add_column("kamar", sa.Column("slug", sa.String(length=180), nullable=True))
        if "periode_harga" not in columns:
            op.add_column("kamar", sa.Column("periode_harga", sa.String(length=50), nullable=False, server_default="bulan"))

        inspector = inspect(bind)
        indexes = {index["name"] for index in inspector.get_indexes("kamar")}
        uniques = {item.get("name") for item in inspector.get_unique_constraints("kamar")}
        if "ix_kamar_slug" not in indexes:
            op.create_index("ix_kamar_slug", "kamar", ["slug"], unique=False)
        if "uq_kamar_slug" not in indexes and "uq_kamar_slug" not in uniques:
            # Unique index aman untuk existing rows karena slug awal boleh NULL.
            op.create_index("uq_kamar_slug", "kamar", ["slug"], unique=True)

    # Nonaktifkan hanya seed demo lama yang dibuat project versi sebelumnya.
    # Datanya tidak dihapus sehingga Owner masih dapat meninjau/mengubahnya dari database bila perlu.
    if "cabang" in inspect(bind).get_table_names():
        bind.execute(sa.text("""
            UPDATE cabang SET aktif = 0
            WHERE nama IN ('Kharisma Sukmajaya', 'Kharisma Margonda', 'Kharisma Beji')
              AND kota = 'Depok'
        """))


def downgrade() -> None:
    # Downgrade hanya menghapus struktur CMS tambahan; tabel inti tidak dihapus.
    bind = op.get_bind()
    inspector = inspect(bind)
    tables = set(inspector.get_table_names())
    for table in ["faq", "dokumentasi", "fasilitas", "konten_halaman", "pengaturan_situs"]:
        if table in tables:
            op.drop_table(table)
    if "kamar" in tables:
        columns = {column["name"] for column in inspect(bind).get_columns("kamar")}
        indexes = {index["name"] for index in inspect(bind).get_indexes("kamar")}
        if "uq_kamar_slug" in indexes:
            op.drop_index("uq_kamar_slug", table_name="kamar")
        if "ix_kamar_slug" in indexes:
            op.drop_index("ix_kamar_slug", table_name="kamar")
        if "periode_harga" in columns:
            op.drop_column("kamar", "periode_harga")
        if "slug" in columns:
            op.drop_column("kamar", "slug")
