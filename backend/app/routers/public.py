from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Cabang, Dokumentasi, Faq, Fasilitas, Kamar, KontenHalaman, PengaturanSitus
from app.schemas import (
    CabangOut,
    DokumentasiOut,
    FaqOut,
    FasilitasOut,
    KamarOut,
    KontenOut,
    PengaturanOut,
)


router = APIRouter(tags=["publik"])


@router.get("/kamar", response_model=list[KamarOut])
def kamar(db: Annotated[Session, Depends(get_db)], cabang_id: int | None = Query(default=None, ge=1)):
    query = (
        select(Kamar)
        .join(Kamar.cabang)
        .options(joinedload(Kamar.cabang))
        .where(Kamar.aktif.is_(True), Cabang.aktif.is_(True))
    )
    if cabang_id:
        query = query.where(Kamar.cabang_id == cabang_id)
    return db.scalars(query.order_by(Kamar.urutan, Kamar.id)).unique().all()


@router.get("/kamar/{slug}", response_model=KamarOut)
def detail_kamar(slug: str, db: Annotated[Session, Depends(get_db)]):
    item = db.scalar(
        select(Kamar)
        .join(Kamar.cabang)
        .options(joinedload(Kamar.cabang))
        .where(Kamar.slug == slug, Kamar.aktif.is_(True), Cabang.aktif.is_(True))
    )
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kamar tidak ditemukan.")
    return item


@router.get("/cabang", response_model=list[CabangOut])
def cabang(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Cabang).where(Cabang.aktif.is_(True)).order_by(Cabang.urutan, Cabang.id)).all()


@router.get("/fasilitas", response_model=list[FasilitasOut])
def fasilitas(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(
        select(Fasilitas).where(Fasilitas.aktif.is_(True)).order_by(Fasilitas.urutan, Fasilitas.id)
    ).all()


@router.get("/dokumentasi", response_model=list[DokumentasiOut])
def dokumentasi(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(
        select(Dokumentasi).where(Dokumentasi.aktif.is_(True)).order_by(Dokumentasi.urutan, Dokumentasi.id)
    ).all()


@router.get("/faq", response_model=list[FaqOut])
def faq(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Faq).where(Faq.aktif.is_(True)).order_by(Faq.urutan, Faq.id)).all()


@router.get("/konten", response_model=list[KontenOut])
def konten(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(KontenHalaman).order_by(KontenHalaman.id)).all()


@router.get("/pengaturan", response_model=PengaturanOut)
def pengaturan(db: Annotated[Session, Depends(get_db)]):
    item = db.scalar(select(PengaturanSitus).limit(1))
    if item is None:
        raise HTTPException(status_code=404, detail="Pengaturan situs belum tersedia.")
    return item
