from __future__ import annotations

from datetime import datetime
from typing import Annotated, TypeVar

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import (
    Cabang,
    Dokumentasi,
    Faq,
    Fasilitas,
    Kamar,
    KontenHalaman,
    PengaturanSitus,
)
from app.schemas import (
    CabangCreate,
    CabangOut,
    CabangUpdate,
    DokumentasiCreate,
    DokumentasiOut,
    DokumentasiUpdate,
    FaqCreate,
    FaqOut,
    FaqUpdate,
    FasilitasCreate,
    FasilitasOut,
    FasilitasUpdate,
    KamarCreate,
    KamarOut,
    KamarUpdate,
    KontenCreate,
    KontenOut,
    KontenUpdate,
    PengaturanOut,
    PengaturanUpdate,
    RingkasanAdmin,
    UploadResponse,
)
from app.security import get_current_admin
from app.services.media import media_service
from app.services.slug import make_slug


router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin)],
)


def not_found(label: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} tidak ditemukan.")


def ensure_availability(total: int, available: int) -> None:
    if available > total:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Kamar tersedia tidak boleh melebihi jumlah kamar.",
        )


def ensure_unique_slug(db: Session, slug: str, exclude_id: int | None = None) -> str:
    base = make_slug(slug)
    candidate = base
    counter = 2
    while True:
        query = select(Kamar.id).where(Kamar.slug == candidate)
        if exclude_id is not None:
            query = query.where(Kamar.id != exclude_id)
        if db.scalar(query) is None:
            return candidate
        candidate = f"{base}-{counter}"
        counter += 1


@router.get("/ringkasan", response_model=RingkasanAdmin)
def ringkasan(db: Annotated[Session, Depends(get_db)]):
    room_count = (
        db.scalar(
            select(func.count(Kamar.id))
            .join(Kamar.cabang)
            .where(Kamar.aktif.is_(True), Cabang.aktif.is_(True))
        )
        or 0
    )
    available = (
        db.scalar(
            select(func.coalesce(func.sum(Kamar.kamar_tersedia), 0))
            .join(Kamar.cabang)
            .where(Kamar.aktif.is_(True), Cabang.aktif.is_(True))
        )
        or 0
    )
    docs = (
        db.scalar(select(func.count(Dokumentasi.id)).where(Dokumentasi.aktif.is_(True)))
        or 0
    )
    facilities = (
        db.scalar(select(func.count(Fasilitas.id)).where(Fasilitas.aktif.is_(True)))
        or 0
    )
    latest = db.scalar(select(func.max(KontenHalaman.diperbarui_pada)))
    return RingkasanAdmin(
        jumlah_tipe_kamar=int(room_count),
        jumlah_kamar_tersedia=int(available),
        jumlah_dokumentasi=int(docs),
        jumlah_fasilitas=int(facilities),
        konten_terakhir_diperbarui=latest.isoformat() if latest else None,
    )


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_gambar(file: UploadFile = File(...)):
    path, url = await media_service.save_image(file)
    return UploadResponse(path=path, url=url)


# ----------------------- CABANG -----------------------
@router.get("/cabang", response_model=list[CabangOut])
def daftar_cabang(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Cabang).order_by(Cabang.urutan, Cabang.id)).all()


@router.post("/cabang", response_model=CabangOut, status_code=status.HTTP_201_CREATED)
def tambah_cabang(payload: CabangCreate, db: Annotated[Session, Depends(get_db)]):
    if db.scalar(select(Cabang.id).where(Cabang.nama == payload.nama)):
        raise HTTPException(status_code=409, detail="Nama cabang sudah digunakan.")
    item = Cabang(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/cabang/{item_id}", response_model=CabangOut)
def ubah_cabang(item_id: int, payload: CabangUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Cabang, item_id)
    if item is None:
        raise not_found("Cabang")
    changes = payload.model_dump(exclude_unset=True)
    if "nama" in changes:
        duplicate = db.scalar(select(Cabang.id).where(Cabang.nama == changes["nama"], Cabang.id != item_id))
        if duplicate:
            raise HTTPException(status_code=409, detail="Nama cabang sudah digunakan.")
    for key, value in changes.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/cabang/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def hapus_cabang(item_id: int, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Cabang, item_id)
    if item is None:
        raise not_found("Cabang")
    room_images = [room.url_gambar for room in item.kamar]
    branch_image = item.url_gambar
    db.delete(item)
    db.commit()
    for path in [branch_image, *room_images]:
        media_service.delete_if_managed(path)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ----------------------- KAMAR -----------------------
@router.get("/kamar", response_model=list[KamarOut])
def daftar_kamar(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(
        select(Kamar).options(joinedload(Kamar.cabang)).order_by(Kamar.cabang_id, Kamar.urutan, Kamar.id)
    ).unique().all()


@router.post("/kamar", response_model=KamarOut, status_code=status.HTTP_201_CREATED)
def tambah_kamar(payload: KamarCreate, db: Annotated[Session, Depends(get_db)]):
    if db.get(Cabang, payload.cabang_id) is None:
        raise not_found("Cabang")
    ensure_availability(payload.jumlah_kamar, payload.kamar_tersedia)
    data = payload.model_dump()
    data["slug"] = ensure_unique_slug(db, payload.slug or payload.nama)
    item = Kamar(**data)
    db.add(item)
    db.commit()
    return db.scalar(select(Kamar).options(joinedload(Kamar.cabang)).where(Kamar.id == item.id))


@router.patch("/kamar/{item_id}", response_model=KamarOut)
def ubah_kamar(item_id: int, payload: KamarUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Kamar, item_id)
    if item is None:
        raise not_found("Kamar")
    changes = payload.model_dump(exclude_unset=True)
    if "cabang_id" in changes and db.get(Cabang, changes["cabang_id"]) is None:
        raise not_found("Cabang")
    ensure_availability(changes.get("jumlah_kamar", item.jumlah_kamar), changes.get("kamar_tersedia", item.kamar_tersedia))
    if "slug" in changes or "nama" in changes:
        changes["slug"] = ensure_unique_slug(db, changes.get("slug") or changes.get("nama") or item.nama, item_id)
    old_image = item.url_gambar
    for key, value in changes.items():
        setattr(item, key, value)
    db.commit()
    if "url_gambar" in changes and old_image != changes["url_gambar"]:
        media_service.delete_if_managed(old_image)
    return db.scalar(select(Kamar).options(joinedload(Kamar.cabang)).where(Kamar.id == item_id))


@router.delete("/kamar/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def hapus_kamar(item_id: int, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Kamar, item_id)
    if item is None:
        raise not_found("Kamar")
    old_image = item.url_gambar
    db.delete(item)
    db.commit()
    media_service.delete_if_managed(old_image)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ----------------------- FASILITAS -----------------------
@router.get("/fasilitas", response_model=list[FasilitasOut])
def daftar_fasilitas(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Fasilitas).order_by(Fasilitas.urutan, Fasilitas.id)).all()


@router.post("/fasilitas", response_model=FasilitasOut, status_code=201)
def tambah_fasilitas(payload: FasilitasCreate, db: Annotated[Session, Depends(get_db)]):
    item = Fasilitas(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/fasilitas/{item_id}", response_model=FasilitasOut)
def ubah_fasilitas(item_id: int, payload: FasilitasUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Fasilitas, item_id)
    if item is None:
        raise not_found("Fasilitas")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/fasilitas/{item_id}", status_code=204)
def hapus_fasilitas(item_id: int, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Fasilitas, item_id)
    if item is None:
        raise not_found("Fasilitas")
    db.delete(item)
    db.commit()
    return Response(status_code=204)


# ----------------------- DOKUMENTASI -----------------------
@router.get("/dokumentasi", response_model=list[DokumentasiOut])
def daftar_dokumentasi(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Dokumentasi).order_by(Dokumentasi.urutan, Dokumentasi.id)).all()


@router.post("/dokumentasi", response_model=DokumentasiOut, status_code=201)
def tambah_dokumentasi(payload: DokumentasiCreate, db: Annotated[Session, Depends(get_db)]):
    item = Dokumentasi(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/dokumentasi/{item_id}", response_model=DokumentasiOut)
def ubah_dokumentasi(item_id: int, payload: DokumentasiUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Dokumentasi, item_id)
    if item is None:
        raise not_found("Dokumentasi")
    changes = payload.model_dump(exclude_unset=True)
    old_image = item.path_foto
    for key, value in changes.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    if "path_foto" in changes and changes["path_foto"] != old_image:
        media_service.delete_if_managed(old_image)
    return item


@router.delete("/dokumentasi/{item_id}", status_code=204)
def hapus_dokumentasi(item_id: int, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Dokumentasi, item_id)
    if item is None:
        raise not_found("Dokumentasi")
    old_image = item.path_foto
    db.delete(item)
    db.commit()
    media_service.delete_if_managed(old_image)
    return Response(status_code=204)


# ----------------------- FAQ -----------------------
@router.get("/faq", response_model=list[FaqOut])
def daftar_faq(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(Faq).order_by(Faq.urutan, Faq.id)).all()


@router.post("/faq", response_model=FaqOut, status_code=201)
def tambah_faq(payload: FaqCreate, db: Annotated[Session, Depends(get_db)]):
    item = Faq(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/faq/{item_id}", response_model=FaqOut)
def ubah_faq(item_id: int, payload: FaqUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Faq, item_id)
    if item is None:
        raise not_found("FAQ")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/faq/{item_id}", status_code=204)
def hapus_faq(item_id: int, db: Annotated[Session, Depends(get_db)]):
    item = db.get(Faq, item_id)
    if item is None:
        raise not_found("FAQ")
    db.delete(item)
    db.commit()
    return Response(status_code=204)


# ----------------------- KONTEN -----------------------
@router.get("/konten", response_model=list[KontenOut])
def daftar_konten(db: Annotated[Session, Depends(get_db)]):
    return db.scalars(select(KontenHalaman).order_by(KontenHalaman.id)).all()


@router.post("/konten", response_model=KontenOut, status_code=201)
def tambah_konten(payload: KontenCreate, db: Annotated[Session, Depends(get_db)]):
    if db.scalar(select(KontenHalaman.id).where(KontenHalaman.kunci == payload.kunci)):
        raise HTTPException(status_code=409, detail="Kunci konten sudah digunakan.")
    item = KontenHalaman(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/konten/{item_id}", response_model=KontenOut)
def ubah_konten(item_id: int, payload: KontenUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.get(KontenHalaman, item_id)
    if item is None:
        raise not_found("Konten")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


# ----------------------- PENGATURAN -----------------------
@router.get("/pengaturan", response_model=PengaturanOut)
def pengaturan(db: Annotated[Session, Depends(get_db)]):
    item = db.scalar(select(PengaturanSitus).limit(1))
    if item is None:
        item = PengaturanSitus(nama_kos="Kos Bu Henny")
        db.add(item)
        db.commit()
        db.refresh(item)
    return item


@router.patch("/pengaturan", response_model=PengaturanOut)
def ubah_pengaturan(payload: PengaturanUpdate, db: Annotated[Session, Depends(get_db)]):
    item = db.scalar(select(PengaturanSitus).limit(1))
    if item is None:
        item = PengaturanSitus(nama_kos="Kos Bu Henny")
        db.add(item)
        db.flush()
    changes = payload.model_dump(exclude_unset=True)
    old_hero = item.hero_image
    for key, value in changes.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    if "hero_image" in changes and old_hero != changes["hero_image"]:
        media_service.delete_if_managed(old_hero)
    return item
