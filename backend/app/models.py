from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database import Base


# =========================================================
# Association Tables
# =========================================================

kamar_fasilitas = Table(
    "kamar_fasilitas",
    Base.metadata,
    Column(
        "kamar_id",
        Integer,
        ForeignKey(
            "kamar.id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        primary_key=True,
    ),
    Column(
        "fasilitas_id",
        Integer,
        ForeignKey(
            "fasilitas.id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        primary_key=True,
    ),
)


# =========================================================
# Mixins
# =========================================================

class TimestampMixin:
    dibuat_pada: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    diperbarui_pada: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


# =========================================================
# Admin
# =========================================================

class Admin(TimestampMixin, Base):
    __tablename__ = "akun_admin"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )


# =========================================================
# Cabang
# =========================================================

class Cabang(TimestampMixin, Base):
    __tablename__ = "cabang"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    nama: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )

    kota: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    alamat: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    deskripsi: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    patokan: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    nomor_whatsapp: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # -----------------------------------------------------
    # Google Maps
    # -----------------------------------------------------

    # URL Google Maps yang dimasukkan oleh admin.
    # Contoh:
    # https://maps.app.goo.gl/xxxxxxxx
    url_maps: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Koordinat hasil resolusi backend dari url_maps.
    #
    # Admin TIDAK mengisi field ini secara manual.
    # Backend yang akan mengisinya ketika url_maps
    # dibuat atau diperbarui.
    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # -----------------------------------------------------
    # Media
    # -----------------------------------------------------

    url_gambar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # -----------------------------------------------------
    # Display
    # -----------------------------------------------------

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    # -----------------------------------------------------
    # Relationships
    # -----------------------------------------------------

    kamar: Mapped[list["Kamar"]] = relationship(
        "Kamar",
        back_populates="cabang",
        order_by="Kamar.urutan, Kamar.id",
        passive_deletes=True,
    )

    dokumentasi: Mapped[list["Dokumentasi"]] = relationship(
        "Dokumentasi",
        back_populates="cabang",
        order_by="Dokumentasi.urutan, Dokumentasi.id",
        passive_deletes=True,
    )


# =========================================================
# Kamar
# =========================================================

class Kamar(TimestampMixin, Base):
    __tablename__ = "kamar"

    __table_args__ = (
        UniqueConstraint(
            "slug",
            name="uq_kamar_slug",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    cabang_id: Mapped[int] = mapped_column(
        ForeignKey(
            "cabang.id",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    nama: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(180),
        nullable=False,
        index=True,
    )

    tipe: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    deskripsi: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    harga_bulanan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    periode_harga: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="bulan",
    )

    jumlah_kamar: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    kamar_tersedia: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    ukuran: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    url_gambar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    cabang: Mapped["Cabang"] = relationship(
        "Cabang",
        back_populates="kamar",
    )

    fasilitas: Mapped[list["Fasilitas"]] = relationship(
        "Fasilitas",
        secondary=kamar_fasilitas,
        back_populates="kamar",
        order_by="Fasilitas.urutan, Fasilitas.id",
    )

    foto: Mapped[list["KamarFoto"]] = relationship(
        "KamarFoto",
        back_populates="kamar",
        order_by="KamarFoto.urutan, KamarFoto.id",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


# =========================================================
# Foto Kamar
# =========================================================

class KamarFoto(TimestampMixin, Base):
    __tablename__ = "kamar_foto"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    kamar_id: Mapped[int] = mapped_column(
        ForeignKey(
            "kamar.id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    path_foto: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    caption: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    teks_alt: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    kamar: Mapped["Kamar"] = relationship(
        "Kamar",
        back_populates="foto",
    )


# =========================================================
# Fasilitas
# =========================================================

class Fasilitas(TimestampMixin, Base):
    __tablename__ = "fasilitas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    nama: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )

    ikon: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    kategori: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="umum",
    )

    deskripsi: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    kamar: Mapped[list["Kamar"]] = relationship(
        "Kamar",
        secondary=kamar_fasilitas,
        back_populates="fasilitas",
    )


# =========================================================
# Dokumentasi
# =========================================================

class Dokumentasi(TimestampMixin, Base):
    __tablename__ = "dokumentasi"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    cabang_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "cabang.id",
            ondelete="SET NULL",
            onupdate="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    path_foto: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    caption: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    teks_alt: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    cabang: Mapped["Cabang | None"] = relationship(
        "Cabang",
        back_populates="dokumentasi",
    )


# =========================================================
# Konten Halaman
# =========================================================

class KontenHalaman(TimestampMixin, Base):
    __tablename__ = "konten_halaman"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    kunci: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    judul: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    isi: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    aktif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    urutan: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )


# =========================================================
# Pengaturan
# =========================================================

class PengaturanSitus(TimestampMixin, Base):
    __tablename__ = "pengaturan_situs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    nama_kos: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    nomor_whatsapp: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    instagram_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    hero_image: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    hero_headline: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    hero_subheadline: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    hero_cta_primary: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    hero_cta_secondary: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    cta_heading: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    cta_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )