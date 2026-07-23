from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TimestampMixin:
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    diperbarui_pada: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class Admin(TimestampMixin, Base):
    __tablename__ = "akun_admin"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Cabang(TimestampMixin, Base):
    __tablename__ = "cabang"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nama: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    kota: Mapped[str] = mapped_column(String(100), nullable=False)
    alamat: Mapped[str] = mapped_column(Text, nullable=False)
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    patokan: Mapped[str | None] = mapped_column(String(255), nullable=True)
    nomor_whatsapp: Mapped[str | None] = mapped_column(String(30), nullable=True)
    url_maps: Mapped[str | None] = mapped_column(Text, nullable=True)
    url_gambar: Mapped[str | None] = mapped_column(Text, nullable=True)
    urutan: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    kamar: Mapped[list["Kamar"]] = relationship(
        "Kamar",
        back_populates="cabang",
        cascade="all, delete-orphan",
        order_by="Kamar.urutan, Kamar.id",
    )


class Kamar(TimestampMixin, Base):
    __tablename__ = "kamar"
    __table_args__ = (UniqueConstraint("slug", name="uq_kamar_slug"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    cabang_id: Mapped[int] = mapped_column(
        ForeignKey("cabang.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nama: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str | None] = mapped_column(String(180), nullable=True, index=True)
    tipe: Mapped[str] = mapped_column(String(100), nullable=False)
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    harga_bulanan: Mapped[int] = mapped_column(Integer, nullable=False)
    periode_harga: Mapped[str] = mapped_column(String(50), nullable=False, default="bulan")
    jumlah_kamar: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    kamar_tersedia: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ukuran: Mapped[str | None] = mapped_column(String(100), nullable=True)
    url_gambar: Mapped[str | None] = mapped_column(Text, nullable=True)
    fasilitas: Mapped[list[Any]] = mapped_column(JSON, nullable=False, default=list)
    urutan: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    cabang: Mapped["Cabang"] = relationship("Cabang", back_populates="kamar")


class Fasilitas(TimestampMixin, Base):
    __tablename__ = "fasilitas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nama: Mapped[str] = mapped_column(String(120), nullable=False)
    ikon: Mapped[str | None] = mapped_column(String(80), nullable=True)
    kategori: Mapped[str] = mapped_column(String(50), nullable=False, default="umum")
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    urutan: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Dokumentasi(TimestampMixin, Base):
    __tablename__ = "dokumentasi"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    path_foto: Mapped[str] = mapped_column(Text, nullable=False)
    caption: Mapped[str | None] = mapped_column(String(255), nullable=True)
    teks_alt: Mapped[str] = mapped_column(String(255), nullable=False)
    urutan: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class Faq(TimestampMixin, Base):
    __tablename__ = "faq"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pertanyaan: Mapped[str] = mapped_column(String(255), nullable=False)
    jawaban: Mapped[str] = mapped_column(Text, nullable=False)
    urutan: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    aktif: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class KontenHalaman(TimestampMixin, Base):
    __tablename__ = "konten_halaman"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kunci: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    judul: Mapped[str | None] = mapped_column(String(255), nullable=True)
    isi: Mapped[str | None] = mapped_column(Text, nullable=True)


class PengaturanSitus(TimestampMixin, Base):
    __tablename__ = "pengaturan_situs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nama_kos: Mapped[str] = mapped_column(String(150), nullable=False, default="Kos Bu Henny")
    nomor_whatsapp: Mapped[str | None] = mapped_column(String(30), nullable=True)
    alamat: Mapped[str | None] = mapped_column(Text, nullable=True)
    google_maps_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    instagram_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    hero_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_headline: Mapped[str] = mapped_column(
        String(255), nullable=False, default="Kamar yang nyaman, tanpa proses cari kos yang ribet."
    )
    hero_subheadline: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="Lihat pilihan kamar, cek fasilitas dan harganya, lalu tanyakan ketersediaannya langsung ke Bu Henny lewat WhatsApp.",
    )
    hero_cta_primary: Mapped[str] = mapped_column(String(80), nullable=False, default="Lihat Pilihan Kamar")
    hero_cta_secondary: Mapped[str] = mapped_column(String(80), nullable=False, default="Tanya via WhatsApp")
    cta_heading: Mapped[str] = mapped_column(
        String(255), nullable=False, default="Sudah menemukan kamar yang cocok?"
    )
    cta_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="Tanyakan ketersediaannya langsung ke Bu Henny. Tidak ada checkout atau proses pemesanan yang rumit.",
    )
