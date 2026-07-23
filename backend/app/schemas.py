from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ApiSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


def normalize_whatsapp(value: str | None) -> str | None:
    if value is None or value == "":
        return value
    cleaned = "".join(char for char in value if char.isdigit())
    if len(cleaned) < 8:
        raise ValueError("Nomor WhatsApp terlalu pendek.")
    return cleaned


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=200)


class LoginResponse(BaseModel):
    username: str


class AdminOut(ApiSchema):
    id: int
    username: str
    aktif: bool


class CabangBase(ApiSchema):
    nama: str = Field(min_length=1, max_length=150)
    kota: str = Field(min_length=1, max_length=100)
    alamat: str = Field(min_length=1)
    deskripsi: str | None = None
    patokan: str | None = Field(default=None, max_length=255)
    nomor_whatsapp: str | None = Field(default=None, max_length=30)
    url_maps: str | None = None
    url_gambar: str | None = None
    urutan: int = 0
    aktif: bool = True


class CabangCreate(CabangBase):
    @field_validator("nomor_whatsapp")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_whatsapp(value)


class CabangUpdate(BaseModel):
    nama: str | None = Field(default=None, min_length=1, max_length=150)
    kota: str | None = Field(default=None, min_length=1, max_length=100)
    alamat: str | None = None
    deskripsi: str | None = None
    patokan: str | None = Field(default=None, max_length=255)
    nomor_whatsapp: str | None = Field(default=None, max_length=30)
    url_maps: str | None = None
    url_gambar: str | None = None
    urutan: int | None = None
    aktif: bool | None = None


    @field_validator("nomor_whatsapp")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_whatsapp(value)


class CabangOut(CabangBase):
    id: int


class KamarBase(ApiSchema):
    cabang_id: int
    nama: str = Field(min_length=1, max_length=150)
    slug: str | None = Field(default=None, max_length=180)
    tipe: str = Field(default="Standar", max_length=100)
    deskripsi: str | None = None
    harga_bulanan: int = Field(gt=0)
    periode_harga: str = Field(default="bulan", min_length=1, max_length=50)
    jumlah_kamar: int = Field(default=1, ge=0)
    kamar_tersedia: int = Field(default=0, ge=0)
    ukuran: str | None = Field(default=None, max_length=100)
    url_gambar: str | None = None
    fasilitas: list[str] = Field(default_factory=list)
    urutan: int = 0
    aktif: bool = True

    @model_validator(mode="after")
    def validasi_ketersediaan(self):
        if self.kamar_tersedia > self.jumlah_kamar:
            raise ValueError("Kamar tersedia tidak boleh melebihi jumlah kamar.")
        return self


class KamarCreate(KamarBase):
    pass


class KamarUpdate(BaseModel):
    cabang_id: int | None = None
    nama: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, max_length=180)
    tipe: str | None = Field(default=None, max_length=100)
    deskripsi: str | None = None
    harga_bulanan: int | None = Field(default=None, gt=0)
    periode_harga: str | None = Field(default=None, min_length=1, max_length=50)
    jumlah_kamar: int | None = Field(default=None, ge=0)
    kamar_tersedia: int | None = Field(default=None, ge=0)
    ukuran: str | None = Field(default=None, max_length=100)
    url_gambar: str | None = None
    fasilitas: list[str] | None = None
    urutan: int | None = None
    aktif: bool | None = None


class KamarOut(KamarBase):
    id: int
    cabang: CabangOut | None = None


class FasilitasBase(ApiSchema):
    nama: str = Field(min_length=1, max_length=120)
    ikon: str | None = Field(default=None, max_length=80)
    kategori: str = Field(default="umum", max_length=50)
    deskripsi: str | None = None
    urutan: int = 0
    aktif: bool = True


class FasilitasCreate(FasilitasBase):
    pass


class FasilitasUpdate(BaseModel):
    nama: str | None = Field(default=None, min_length=1, max_length=120)
    ikon: str | None = Field(default=None, max_length=80)
    kategori: str | None = Field(default=None, max_length=50)
    deskripsi: str | None = None
    urutan: int | None = None
    aktif: bool | None = None


class FasilitasOut(FasilitasBase):
    id: int


class DokumentasiBase(ApiSchema):
    path_foto: str
    caption: str | None = Field(default=None, max_length=255)
    teks_alt: str = Field(min_length=1, max_length=255)
    urutan: int = 0
    aktif: bool = True


class DokumentasiCreate(DokumentasiBase):
    pass


class DokumentasiUpdate(BaseModel):
    path_foto: str | None = None
    caption: str | None = Field(default=None, max_length=255)
    teks_alt: str | None = Field(default=None, min_length=1, max_length=255)
    urutan: int | None = None
    aktif: bool | None = None


class DokumentasiOut(DokumentasiBase):
    id: int


class FaqBase(ApiSchema):
    pertanyaan: str = Field(min_length=1, max_length=255)
    jawaban: str = Field(min_length=1)
    urutan: int = 0
    aktif: bool = True


class FaqCreate(FaqBase):
    pass


class FaqUpdate(BaseModel):
    pertanyaan: str | None = Field(default=None, min_length=1, max_length=255)
    jawaban: str | None = Field(default=None, min_length=1)
    urutan: int | None = None
    aktif: bool | None = None


class FaqOut(FaqBase):
    id: int


class KontenBase(ApiSchema):
    kunci: str = Field(min_length=1, max_length=100)
    judul: str | None = Field(default=None, max_length=255)
    isi: str | None = None


class KontenCreate(KontenBase):
    pass


class KontenUpdate(BaseModel):
    judul: str | None = Field(default=None, max_length=255)
    isi: str | None = None


class KontenOut(KontenBase):
    id: int


class PengaturanOut(ApiSchema):
    id: int
    nama_kos: str
    nomor_whatsapp: str | None
    alamat: str | None
    google_maps_url: str | None
    instagram_url: str | None
    hero_image: str | None
    hero_headline: str
    hero_subheadline: str
    hero_cta_primary: str
    hero_cta_secondary: str
    cta_heading: str
    cta_description: str


class PengaturanUpdate(BaseModel):
    nama_kos: str | None = Field(default=None, min_length=1, max_length=150)
    nomor_whatsapp: str | None = Field(default=None, max_length=30)
    alamat: str | None = None
    google_maps_url: str | None = None
    instagram_url: str | None = None
    hero_image: str | None = None
    hero_headline: str | None = Field(default=None, min_length=1, max_length=255)
    hero_subheadline: str | None = None
    hero_cta_primary: str | None = Field(default=None, min_length=1, max_length=80)
    hero_cta_secondary: str | None = Field(default=None, min_length=1, max_length=80)
    cta_heading: str | None = Field(default=None, min_length=1, max_length=255)
    cta_description: str | None = None

    @field_validator("nomor_whatsapp")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        return normalize_whatsapp(value)


class RingkasanAdmin(BaseModel):
    jumlah_tipe_kamar: int
    jumlah_kamar_tersedia: int
    jumlah_dokumentasi: int
    jumlah_fasilitas: int
    konten_terakhir_diperbarui: str | None


class UploadResponse(BaseModel):
    path: str
    url: str
