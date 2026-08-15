from __future__ import annotations

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.orm import (
    Session,
    joinedload,
    selectinload,
)

from app.services.maps import (
    MapsResolutionError,
    resolve_google_maps_coordinates,
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
    CabangCreate,
    CabangOut,
    CabangUpdate,
    DokumentasiCreate,
    DokumentasiOut,
    DokumentasiUpdate,
    FasilitasCreate,
    FasilitasOut,
    FasilitasUpdate,
    KamarCreate,
    KamarFotoCreate,
    KamarFotoOut,
    KamarFotoUpdate,
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


# =========================================================
# Helpers
# =========================================================

def not_found(label: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{label} tidak ditemukan.",
    )


def conflict(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=message,
    )


def ensure_availability(
    total: int,
    available: int,
) -> None:
    if available > total:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Kamar tersedia tidak boleh "
                "melebihi jumlah kamar."
            ),
        )


def ensure_unique_slug(
    db: Session,
    value: str,
    exclude_id: int | None = None,
) -> str:
    base = make_slug(value)
    candidate = base
    counter = 2

    while True:
        query = select(Kamar.id).where(
            Kamar.slug == candidate
        )

        if exclude_id is not None:
            query = query.where(
                Kamar.id != exclude_id
            )

        if db.scalar(query) is None:
            return candidate

        candidate = f"{base}-{counter}"
        counter += 1


def get_room(
    db: Session,
    room_id: int,
) -> Kamar | None:
    query = (
        select(Kamar)
        .options(
            joinedload(Kamar.cabang),
            selectinload(Kamar.fasilitas),
        )
        .where(Kamar.id == room_id)
    )

    return db.scalar(query)


def resolve_facilities(
    db: Session,
    names: list[str],
) -> list[Fasilitas]:
    cleaned: list[str] = []
    seen: set[str] = set()

    for raw_name in names:
        name = raw_name.strip()

        if not name:
            continue

        key = name.casefold()

        if key in seen:
            continue

        seen.add(key)
        cleaned.append(name)

    if not cleaned:
        return []

    facilities = db.scalars(
        select(Fasilitas).where(
            Fasilitas.nama.in_(cleaned)
        )
    ).all()

    by_name = {
        facility.nama.casefold(): facility
        for facility in facilities
    }

    missing = [
        name
        for name in cleaned
        if name.casefold() not in by_name
    ]

    if missing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Fasilitas berikut belum terdaftar: "
                + ", ".join(missing)
            ),
        )

    return [
        by_name[name.casefold()]
        for name in cleaned
    ]


def ensure_documentation_branch(
    db: Session,
    branch_id: int | None,
) -> None:
    if branch_id is None:
        return

    if db.get(Cabang, branch_id) is None:
        raise not_found("Cabang")


def default_settings() -> PengaturanSitus:
    return PengaturanSitus(
        nama_kos="Kos Bu Henny",
        hero_headline="Temukan kamar yang sesuai kebutuhanmu.",
        hero_subheadline=(
            "Lihat pilihan kamar, harga, fasilitas, "
            "dan ketersediaannya."
        ),
        hero_cta_primary="Lihat Pilihan Kamar",
        hero_cta_secondary="Tanya via WhatsApp",
        cta_heading="Sudah menemukan kamar yang cocok?",
        cta_description=(
            "Hubungi pemilik untuk menanyakan "
            "ketersediaan kamar."
        ),
    )


# =========================================================
# Ringkasan
# =========================================================

@router.get(
    "/ringkasan",
    response_model=RingkasanAdmin,
)
def ringkasan(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    room_count = (
        db.scalar(
            select(func.count(Kamar.id))
            .join(Kamar.cabang)
            .where(
                Kamar.aktif.is_(True),
                Cabang.aktif.is_(True),
            )
        )
        or 0
    )

    available = (
        db.scalar(
            select(
                func.coalesce(
                    func.sum(
                        Kamar.kamar_tersedia
                    ),
                    0,
                )
            )
            .join(Kamar.cabang)
            .where(
                Kamar.aktif.is_(True),
                Cabang.aktif.is_(True),
            )
        )
        or 0
    )

    docs = (
        db.scalar(
            select(
                func.count(Dokumentasi.id)
            ).where(
                Dokumentasi.aktif.is_(True)
            )
        )
        or 0
    )

    facilities = (
        db.scalar(
            select(
                func.count(Fasilitas.id)
            ).where(
                Fasilitas.aktif.is_(True)
            )
        )
        or 0
    )

    latest = db.scalar(
        select(
            func.max(
                KontenHalaman.diperbarui_pada
            )
        )
    )

    return RingkasanAdmin(
        jumlah_tipe_kamar=int(room_count),
        jumlah_kamar_tersedia=int(available),
        jumlah_dokumentasi=int(docs),
        jumlah_fasilitas=int(facilities),
        konten_terakhir_diperbarui=(
            latest.isoformat()
            if latest
            else None
        ),
    )


# =========================================================
# Upload
# =========================================================

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_gambar(
    file: UploadFile = File(...),
):
    path, url = await media_service.save_image(
        file
    )

    return UploadResponse(
        path=path,
        url=url,
    )


# =========================================================
# Cabang
# =========================================================

@router.get(
    "/cabang",
    response_model=list[CabangOut],
)
def daftar_cabang(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = select(Cabang).order_by(
        Cabang.urutan,
        Cabang.id,
    )

    return db.scalars(query).all()


@router.post(
    "/cabang",
    response_model=CabangOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_cabang(
    payload: CabangCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    duplicate = db.scalar(
        select(Cabang.id).where(
            Cabang.nama == payload.nama
        )
    )

    if duplicate:
        raise conflict(
            "Nama cabang sudah digunakan."
        )

    data = payload.model_dump()

    try:
        coordinates = (
            resolve_google_maps_coordinates(
                data.get("url_maps")
            )
        )
    except MapsResolutionError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    if coordinates is None:
        data["latitude"] = None
        data["longitude"] = None
    else:
        data["latitude"] = coordinates[0]
        data["longitude"] = coordinates[1]

    item = Cabang(**data)

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@router.patch(
    "/cabang/{item_id}",
    response_model=CabangOut,
)
def ubah_cabang(
    item_id: int,
    payload: CabangUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(Cabang, item_id)

    if item is None:
        raise not_found("Cabang")

    changes = payload.model_dump(
        exclude_unset=True
    )

    if "nama" in changes:
        duplicate = db.scalar(
            select(Cabang.id).where(
                Cabang.nama == changes["nama"],
                Cabang.id != item_id,
            )
        )

        if duplicate:
            raise conflict(
                "Nama cabang sudah digunakan."
            )

    # -----------------------------------------------------
    # Google Maps
    # -----------------------------------------------------

    if "url_maps" in changes:
        try:
            coordinates = (
                resolve_google_maps_coordinates(
                    changes["url_maps"]
                )
            )
        except MapsResolutionError as exc:
            raise HTTPException(
                status_code=(
                    status.HTTP_422_UNPROCESSABLE_ENTITY
                ),
                detail=str(exc),
            ) from exc

        if coordinates is None:
            changes["latitude"] = None
            changes["longitude"] = None
        else:
            changes["latitude"] = coordinates[0]
            changes["longitude"] = coordinates[1]

    # -----------------------------------------------------
    # Update
    # -----------------------------------------------------

    old_image = item.url_gambar

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    if (
        "url_gambar" in changes
        and old_image != changes["url_gambar"]
    ):
        media_service.delete_if_managed(
            old_image
        )

    return item

@router.delete(
    "/cabang/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def hapus_cabang(
    item_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(Cabang, item_id)

    if item is None:
        raise not_found("Cabang")

    room_count = (
        db.scalar(
            select(
                func.count(Kamar.id)
            ).where(
                Kamar.cabang_id == item_id
            )
        )
        or 0
    )

    if room_count > 0:
        raise conflict(
            "Cabang tidak dapat dihapus karena "
            "masih memiliki kamar. Pindahkan atau "
            "hapus kamar terlebih dahulu."
        )

    old_image = item.url_gambar

    db.delete(item)
    db.commit()

    media_service.delete_if_managed(
        old_image
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# =========================================================
# Kamar
# =========================================================

@router.get(
    "/kamar",
    response_model=list[KamarOut],
)
def daftar_kamar(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = (
        select(Kamar)
        .options(
            joinedload(Kamar.cabang),
            selectinload(Kamar.fasilitas),
        )
        .order_by(
            Kamar.cabang_id,
            Kamar.urutan,
            Kamar.id,
        )
    )

    return (
        db.scalars(query)
        .unique()
        .all()
    )


@router.post(
    "/kamar",
    response_model=KamarOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_kamar(
    payload: KamarCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    branch = db.get(
        Cabang,
        payload.cabang_id,
    )

    if branch is None:
        raise not_found("Cabang")

    ensure_availability(
        payload.jumlah_kamar,
        payload.kamar_tersedia,
    )

    data = payload.model_dump()

    facility_names = data.pop(
        "fasilitas",
        [],
    )

    data["slug"] = ensure_unique_slug(
        db,
        payload.slug or payload.nama,
    )

    item = Kamar(**data)

    item.fasilitas = resolve_facilities(
        db,
        facility_names,
    )

    db.add(item)
    db.commit()

    return get_room(
        db,
        item.id,
    )


@router.patch(
    "/kamar/{item_id}",
    response_model=KamarOut,
)
def ubah_kamar(
    item_id: int,
    payload: KamarUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = get_room(
        db,
        item_id,
    )

    if item is None:
        raise not_found("Kamar")

    changes = payload.model_dump(
        exclude_unset=True
    )

    facility_names = changes.pop(
        "fasilitas",
        None,
    )

    if "cabang_id" in changes:
        branch = db.get(
            Cabang,
            changes["cabang_id"],
        )

        if branch is None:
            raise not_found("Cabang")

    total = changes.get(
        "jumlah_kamar",
        item.jumlah_kamar,
    )

    available = changes.get(
        "kamar_tersedia",
        item.kamar_tersedia,
    )

    ensure_availability(
        total,
        available,
    )

    if (
        "slug" in changes
        or "nama" in changes
    ):
        source = (
            changes.get("slug")
            or changes.get("nama")
            or item.nama
        )

        changes["slug"] = (
            ensure_unique_slug(
                db,
                source,
                item_id,
            )
        )

    old_image = item.url_gambar

    for key, value in changes.items():
        setattr(item, key, value)

    if facility_names is not None:
        item.fasilitas = (
            resolve_facilities(
                db,
                facility_names,
            )
        )

    db.commit()

    if (
        "url_gambar" in changes
        and old_image
        != changes["url_gambar"]
    ):
        media_service.delete_if_managed(
            old_image
        )

    return get_room(
        db,
        item_id,
    )


@router.delete(
    "/kamar/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def hapus_kamar(
    item_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        Kamar,
        item_id,
    )

    if item is None:
        raise not_found("Kamar")

    old_image = item.url_gambar

    db.delete(item)
    db.commit()

    media_service.delete_if_managed(
        old_image
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )

# =========================================================
# Foto Kamar
# =========================================================

@router.get(
    "/kamar/{kamar_id}/foto",
    response_model=list[KamarFotoOut],
)
def daftar_foto_kamar(
    kamar_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    if db.get(Kamar, kamar_id) is None:
        raise not_found("Kamar")

    query = (
        select(KamarFoto)
        .where(
            KamarFoto.kamar_id == kamar_id,
        )
        .order_by(
            KamarFoto.urutan,
            KamarFoto.id,
        )
    )

    return db.scalars(query).all()


@router.post(
    "/kamar/{kamar_id}/foto",
    response_model=KamarFotoOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_foto_kamar(
    kamar_id: int,
    payload: KamarFotoCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    if db.get(Kamar, kamar_id) is None:
        raise not_found("Kamar")

    item = KamarFoto(
        kamar_id=kamar_id,
        **payload.model_dump(),
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/kamar/{kamar_id}/foto/{foto_id}",
    response_model=KamarFotoOut,
)
def ubah_foto_kamar(
    kamar_id: int,
    foto_id: int,
    payload: KamarFotoUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.scalar(
        select(KamarFoto).where(
            KamarFoto.id == foto_id,
            KamarFoto.kamar_id == kamar_id,
        )
    )

    if item is None:
        raise not_found("Foto kamar")

    changes = payload.model_dump(
        exclude_unset=True,
    )

    old_image = item.path_foto

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    if (
        "path_foto" in changes
        and old_image != changes["path_foto"]
    ):
        media_service.delete_if_managed(
            old_image
        )

    return item


@router.delete(
    "/kamar/{kamar_id}/foto/{foto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def hapus_foto_kamar(
    kamar_id: int,
    foto_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.scalar(
        select(KamarFoto).where(
            KamarFoto.id == foto_id,
            KamarFoto.kamar_id == kamar_id,
        )
    )

    if item is None:
        raise not_found("Foto kamar")

    old_image = item.path_foto

    db.delete(item)
    db.commit()

    media_service.delete_if_managed(
        old_image
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )

# =========================================================
# Fasilitas
# =========================================================

@router.get(
    "/fasilitas",
    response_model=list[FasilitasOut],
)
def daftar_fasilitas(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = select(
        Fasilitas
    ).order_by(
        Fasilitas.urutan,
        Fasilitas.id,
    )

    return db.scalars(query).all()


@router.post(
    "/fasilitas",
    response_model=FasilitasOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_fasilitas(
    payload: FasilitasCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    duplicate = db.scalar(
        select(Fasilitas.id).where(
            Fasilitas.nama == payload.nama
        )
    )

    if duplicate:
        raise conflict(
            "Nama fasilitas sudah digunakan."
        )

    item = Fasilitas(
        **payload.model_dump()
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/fasilitas/{item_id}",
    response_model=FasilitasOut,
)
def ubah_fasilitas(
    item_id: int,
    payload: FasilitasUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        Fasilitas,
        item_id,
    )

    if item is None:
        raise not_found("Fasilitas")

    changes = payload.model_dump(
        exclude_unset=True
    )

    if "nama" in changes:
        duplicate = db.scalar(
            select(Fasilitas.id).where(
                Fasilitas.nama
                == changes["nama"],
                Fasilitas.id != item_id,
            )
        )

        if duplicate:
            raise conflict(
                "Nama fasilitas sudah digunakan."
            )

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete(
    "/fasilitas/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def hapus_fasilitas(
    item_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        Fasilitas,
        item_id,
    )

    if item is None:
        raise not_found("Fasilitas")

    db.delete(item)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# =========================================================
# Dokumentasi
# =========================================================

@router.get(
    "/dokumentasi",
    response_model=list[DokumentasiOut],
)
def daftar_dokumentasi(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = select(
        Dokumentasi
    ).order_by(
        Dokumentasi.urutan,
        Dokumentasi.id,
    )

    return db.scalars(query).all()


@router.post(
    "/dokumentasi",
    response_model=DokumentasiOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_dokumentasi(
    payload: DokumentasiCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    ensure_documentation_branch(
        db,
        payload.cabang_id,
    )

    item = Dokumentasi(
        **payload.model_dump()
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/dokumentasi/{item_id}",
    response_model=DokumentasiOut,
)
def ubah_dokumentasi(
    item_id: int,
    payload: DokumentasiUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        Dokumentasi,
        item_id,
    )

    if item is None:
        raise not_found(
            "Dokumentasi"
        )

    changes = payload.model_dump(
        exclude_unset=True
    )

    if "cabang_id" in changes:
        ensure_documentation_branch(
            db,
            changes["cabang_id"],
        )

    old_image = item.path_foto

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    if (
        "path_foto" in changes
        and old_image
        != changes["path_foto"]
    ):
        media_service.delete_if_managed(
            old_image
        )

    return item


@router.delete(
    "/dokumentasi/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def hapus_dokumentasi(
    item_id: int,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        Dokumentasi,
        item_id,
    )

    if item is None:
        raise not_found(
            "Dokumentasi"
        )

    old_image = item.path_foto

    db.delete(item)
    db.commit()

    media_service.delete_if_managed(
        old_image
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# =========================================================
# Konten Halaman
# =========================================================

@router.get(
    "/konten",
    response_model=list[KontenOut],
)
def daftar_konten(
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    query = select(
        KontenHalaman
    ).order_by(
        KontenHalaman.urutan,
        KontenHalaman.id,
    )

    return db.scalars(query).all()


@router.post(
    "/konten",
    response_model=KontenOut,
    status_code=status.HTTP_201_CREATED,
)
def tambah_konten(
    payload: KontenCreate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    duplicate = db.scalar(
        select(
            KontenHalaman.id
        ).where(
            KontenHalaman.kunci
            == payload.kunci
        )
    )

    if duplicate:
        raise conflict(
            "Kunci konten sudah digunakan."
        )

    item = KontenHalaman(
        **payload.model_dump()
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/konten/{item_id}",
    response_model=KontenOut,
)
def ubah_konten(
    item_id: int,
    payload: KontenUpdate,
    db: Annotated[
        Session,
        Depends(get_db),
    ],
):
    item = db.get(
        KontenHalaman,
        item_id,
    )

    if item is None:
        raise not_found("Konten")

    changes = payload.model_dump(
        exclude_unset=True
    )

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


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
        item = default_settings()

        db.add(item)
        db.commit()
        db.refresh(item)

    return item


@router.patch(
    "/pengaturan",
    response_model=PengaturanOut,
)
def ubah_pengaturan(
    payload: PengaturanUpdate,
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
        item = default_settings()

        db.add(item)
        db.flush()

    changes = payload.model_dump(
        exclude_unset=True
    )

    old_hero = item.hero_image

    for key, value in changes.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    if (
        "hero_image" in changes
        and old_hero
        != changes["hero_image"]
    ):
        media_service.delete_if_managed(
            old_hero
        )

    return item