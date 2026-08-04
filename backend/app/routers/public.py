from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    joinedload,
    selectinload,
    with_loader_criteria,
)

from app.database import get_db
from app.models import (
    Cabang,
    Dokumentasi,
    Fasilitas,
    Kamar,
    KamarFoto,
    KontenHalaman,
    PengaturanSitus,
)
from app.schemas import (
    CabangOut,
    DokumentasiOut,
    FasilitasOut,
    KamarDetailOut,
    KamarOut,
    KontenOut,
    PengaturanOut,
)


router = APIRouter(
    tags=["publik"],
)


# =========================================================
# Kamar
# =========================================================

@router.get(
    "/kamar",
    response_model=list[KamarOut],
)
def kamar(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
    cabang_id: int | None = Query(
        default=None,
        ge=1,
    ),
):
    query = (
        select(Kamar)
        .join(Kamar.cabang)
        .options(
            joinedload(Kamar.cabang),
            selectinload(Kamar.fasilitas),
        )
        .where(
            Kamar.aktif.is_(True),
            Cabang.aktif.is_(True),
        )
    )

    if cabang_id is not None:
        query = query.where(
            Kamar.cabang_id == cabang_id
        )

    query = query.order_by(
        Kamar.urutan,
        Kamar.id,
    )

    return (
        db.scalars(query)
        .unique()
        .all()
    )


@router.get(
    "/kamar/{slug}",
    response_model=KamarDetailOut,
)
def detail_kamar(
    slug: str,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(Kamar)
        .join(Kamar.cabang)
        .options(
            joinedload(Kamar.cabang),
            selectinload(Kamar.fasilitas),
            selectinload(Kamar.foto),
            with_loader_criteria(
                KamarFoto,
                KamarFoto.aktif.is_(True),
                include_aliases=True,
            ),
        )
        .where(
            Kamar.slug == slug,
            Kamar.aktif.is_(True),
            Cabang.aktif.is_(True),
        )
    )

    item = db.scalar(query)

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kamar tidak ditemukan.",
        )

    return item


# =========================================================
# Cabang
# =========================================================

@router.get(
    "/cabang",
    response_model=list[CabangOut],
)
def cabang(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(Cabang)
        .where(
            Cabang.aktif.is_(True)
        )
        .order_by(
            Cabang.urutan,
            Cabang.id,
        )
    )

    return db.scalars(query).all()


# =========================================================
# Fasilitas
# =========================================================

@router.get(
    "/fasilitas",
    response_model=list[FasilitasOut],
)
def fasilitas(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(Fasilitas)
        .where(
            Fasilitas.aktif.is_(True)
        )
        .order_by(
            Fasilitas.urutan,
            Fasilitas.id,
        )
    )

    return db.scalars(query).all()


# =========================================================
# Dokumentasi
# =========================================================

@router.get(
    "/dokumentasi",
    response_model=list[DokumentasiOut],
)
def dokumentasi(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(Dokumentasi)
        .where(
            Dokumentasi.aktif.is_(True)
        )
        .order_by(
            Dokumentasi.urutan,
            Dokumentasi.id,
        )
    )

    return db.scalars(query).all()


# =========================================================
# Konten Landing Page
# =========================================================

@router.get(
    "/konten",
    response_model=list[KontenOut],
)
def konten(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(KontenHalaman)
        .where(
            KontenHalaman.aktif.is_(True)
        )
        .order_by(
            KontenHalaman.urutan,
            KontenHalaman.id,
        )
    )

    return db.scalars(query).all()


# =========================================================
# Pengaturan Situs
# =========================================================

@router.get(
    "/pengaturan",
    response_model=PengaturanOut,
)
def pengaturan(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.scalar(
        select(PengaturanSitus)
        .order_by(PengaturanSitus.id)
        .limit(1)
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengaturan situs belum tersedia.",
        )

    return item