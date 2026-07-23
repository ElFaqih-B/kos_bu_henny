from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import (
    Admin,
    Cabang,
    Dokumentasi,
    Faq,
    Fasilitas,
    Kamar,
    KontenHalaman,
    PengaturanSitus,
)
from app.security import hash_password


DEFAULT_CONTENT = [
    {
        "kunci": "tentang",
        "judul": "Tentang Kos Bu Henny",
        "isi": (
            "Data pada project ini masih berupa data dummy untuk kebutuhan pengembangan. "
            "Ganti dengan informasi hasil wawancara dan observasi asli melalui dashboard Owner."
        ),
    },
    {
        "kunci": "mengapa",
        "judul": "Fasilitas yang perlu kamu tahu sebelum memilih kamar.",
        "isi": "Lihat fasilitas kamar dan fasilitas bersama sebelum menanyakan ketersediaan.",
    },
    {
        "kunci": "kamar",
        "judul": "Pilih kamar yang paling pas untuk kebutuhanmu.",
        "isi": "Setiap tipe kamar memiliki harga, ukuran, fasilitas, dan jumlah kamar tersedia yang berbeda.",
    },
    {
        "kunci": "galeri",
        "judul": "Lihat suasana Kos Bu Henny.",
        "isi": "Foto saat ini masih placeholder. Ganti dengan dokumentasi asli dari lokasi kos melalui dashboard Owner.",
    },
]


DUMMY_BRANCHES = [
    {
        "nama": "Kos Bu Henny - Cabang Utama",
        "kota": "Yogyakarta",
        "alamat": "Alamat dummy Cabang Utama — ganti dengan alamat asli melalui dashboard Owner.",
        "deskripsi": "Cabang utama untuk contoh pengisian data selama proses pengembangan website.",
        "patokan": "Patokan dummy — ganti dengan landmark asli.",
        "nomor_whatsapp": "6280000000000",
        "url_maps": None,
        "url_gambar": "/media/seed/hero-kos-bu-henny.jpg",
        "urutan": 1,
        "aktif": True,
    },
    {
        "nama": "Kos Bu Henny - Cabang Utara",
        "kota": "Yogyakarta",
        "alamat": "Alamat dummy Cabang Utara — ganti dengan alamat asli melalui dashboard Owner.",
        "deskripsi": "Data dummy cabang kedua untuk menguji filter lokasi dan pilihan kamar.",
        "patokan": "Patokan dummy — ganti dengan landmark asli.",
        "nomor_whatsapp": "6280000000000",
        "url_maps": None,
        "url_gambar": "/media/seed/dokumentasi-1.jpg",
        "urutan": 2,
        "aktif": True,
    },
    {
        "nama": "Kos Bu Henny - Cabang Selatan",
        "kota": "Yogyakarta",
        "alamat": "Alamat dummy Cabang Selatan — ganti dengan alamat asli melalui dashboard Owner.",
        "deskripsi": "Data dummy cabang ketiga untuk memastikan landing page tidak kosong saat development.",
        "patokan": "Patokan dummy — ganti dengan landmark asli.",
        "nomor_whatsapp": "6280000000000",
        "url_maps": None,
        "url_gambar": "/media/seed/dokumentasi-2.jpg",
        "urutan": 3,
        "aktif": True,
    },
]


DUMMY_ROOMS = [
    # branch index, room data
    (0, {
        "nama": "Kamar Standard",
        "slug": "kamar-standard-cabang-utama",
        "tipe": "Standard",
        "deskripsi": "Kamar dummy untuk menampilkan contoh layout, harga, ukuran, dan fasilitas pada landing page.",
        "harga_bulanan": 850_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 8,
        "kamar_tersedia": 3,
        "ukuran": "3 x 3 m",
        "url_gambar": "/media/seed/kamar-standard-a.jpg",
        "fasilitas": ["WiFi", "Kasur", "Lemari", "Meja belajar", "Kamar mandi dalam"],
        "urutan": 1,
        "aktif": True,
    }),
    (0, {
        "nama": "Kamar AC",
        "slug": "kamar-ac-cabang-utama",
        "tipe": "AC",
        "deskripsi": "Contoh tipe kamar ber-AC dengan fasilitas lebih lengkap untuk kebutuhan pengembangan.",
        "harga_bulanan": 1_200_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 6,
        "kamar_tersedia": 2,
        "ukuran": "3 x 4 m",
        "url_gambar": "/media/seed/kamar-ac-a.jpg",
        "fasilitas": ["AC", "WiFi", "Kasur", "Lemari", "Meja belajar", "Kamar mandi dalam"],
        "urutan": 2,
        "aktif": True,
    }),
    (1, {
        "nama": "Kamar Standard Utara",
        "slug": "kamar-standard-cabang-utara",
        "tipe": "Standard",
        "deskripsi": "Data kamar dummy untuk cabang kedua. Semua detail dapat diedit dari dashboard Owner.",
        "harga_bulanan": 900_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 7,
        "kamar_tersedia": 4,
        "ukuran": "3 x 3 m",
        "url_gambar": "/media/seed/kamar-standard-b.jpg",
        "fasilitas": ["WiFi", "Kasur", "Lemari", "Meja belajar"],
        "urutan": 3,
        "aktif": True,
    }),
    (1, {
        "nama": "Kamar AC Utara",
        "slug": "kamar-ac-cabang-utara",
        "tipe": "AC",
        "deskripsi": "Contoh kamar AC cabang kedua untuk menguji filter dan CTA WhatsApp per kamar.",
        "harga_bulanan": 1_300_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 5,
        "kamar_tersedia": 1,
        "ukuran": "3.5 x 4 m",
        "url_gambar": "/media/seed/kamar-ac-b.jpg",
        "fasilitas": ["AC", "WiFi", "Kasur", "Lemari", "Meja belajar", "Kamar mandi dalam"],
        "urutan": 4,
        "aktif": True,
    }),
    (2, {
        "nama": "Kamar Hemat",
        "slug": "kamar-hemat-cabang-selatan",
        "tipe": "Non-AC",
        "deskripsi": "Contoh pilihan kamar dengan harga lebih ekonomis. Data ini bukan harga resmi Kos Bu Henny.",
        "harga_bulanan": 750_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 10,
        "kamar_tersedia": 5,
        "ukuran": "2.8 x 3 m",
        "url_gambar": "/media/seed/kamar-standard-c.jpg",
        "fasilitas": ["WiFi", "Kasur", "Lemari"],
        "urutan": 5,
        "aktif": True,
    }),
    (2, {
        "nama": "Kamar Nyaman Selatan",
        "slug": "kamar-nyaman-cabang-selatan",
        "tipe": "AC",
        "deskripsi": "Contoh kamar yang lebih luas untuk membantu menguji variasi harga dan ukuran pada UI.",
        "harga_bulanan": 1_150_000,
        "periode_harga": "bulan",
        "jumlah_kamar": 6,
        "kamar_tersedia": 2,
        "ukuran": "3 x 4 m",
        "url_gambar": "/media/seed/kamar-ac-c.jpg",
        "fasilitas": ["AC", "WiFi", "Kasur", "Lemari", "Meja belajar"],
        "urutan": 6,
        "aktif": True,
    }),
]


DUMMY_FACILITIES = [
    {"nama": "WiFi", "ikon": "Wifi", "kategori": "umum", "deskripsi": "Contoh fasilitas internet untuk kebutuhan tampilan development.", "urutan": 1, "aktif": True},
    {"nama": "Parkir motor", "ikon": "CarFront", "kategori": "bersama", "deskripsi": "Area parkir dummy. Verifikasi kapasitas sebenarnya sebelum dipublikasikan.", "urutan": 2, "aktif": True},
    {"nama": "Kamar mandi dalam", "ikon": "Bath", "kategori": "kamar", "deskripsi": "Contoh fasilitas kamar mandi dalam pada tipe kamar tertentu.", "urutan": 3, "aktif": True},
    {"nama": "Dapur bersama", "ikon": "CookingPot", "kategori": "bersama", "deskripsi": "Contoh fasilitas bersama untuk menguji layout fasilitas.", "urutan": 4, "aktif": True},
    {"nama": "Lemari", "ikon": "DoorOpen", "kategori": "kamar", "deskripsi": "Lemari penyimpanan pada contoh tipe kamar.", "urutan": 5, "aktif": True},
    {"nama": "Meja belajar", "ikon": "LampDesk", "kategori": "kamar", "deskripsi": "Contoh meja belajar/kerja di dalam kamar.", "urutan": 6, "aktif": True},
    {"nama": "CCTV", "ikon": "Cctv", "kategori": "keamanan", "deskripsi": "Data dummy untuk contoh fasilitas keamanan. Ganti sesuai kondisi asli.", "urutan": 7, "aktif": True},
    {"nama": "Area jemur", "ikon": "Shirt", "kategori": "bersama", "deskripsi": "Contoh area jemur bersama.", "urutan": 8, "aktif": True},
]


DUMMY_DOCUMENTATION = [
    {"path_foto": "/media/seed/hero-kos-bu-henny.jpg", "caption": "Tampak area Kos Bu Henny — foto dummy", "teks_alt": "Placeholder dokumentasi Kos Bu Henny", "urutan": 1, "aktif": True},
    {"path_foto": "/media/seed/kamar-standard-a.jpg", "caption": "Contoh kamar standard — foto dummy", "teks_alt": "Placeholder kamar standard", "urutan": 2, "aktif": True},
    {"path_foto": "/media/seed/kamar-ac-a.jpg", "caption": "Contoh kamar AC — foto dummy", "teks_alt": "Placeholder kamar AC", "urutan": 3, "aktif": True},
    {"path_foto": "/media/seed/dokumentasi-1.jpg", "caption": "Contoh area bersama — foto dummy", "teks_alt": "Placeholder area bersama", "urutan": 4, "aktif": True},
    {"path_foto": "/media/seed/dokumentasi-2.jpg", "caption": "Contoh sudut bangunan — foto dummy", "teks_alt": "Placeholder sudut bangunan", "urutan": 5, "aktif": True},
    {"path_foto": "/media/seed/kamar-standard-b.jpg", "caption": "Contoh dokumentasi kamar cabang kedua", "teks_alt": "Placeholder kamar cabang kedua", "urutan": 6, "aktif": True},
    {"path_foto": "/media/seed/kamar-ac-b.jpg", "caption": "Contoh dokumentasi tipe AC cabang kedua", "teks_alt": "Placeholder AC cabang kedua", "urutan": 7, "aktif": True},
    {"path_foto": "/media/seed/kamar-ac-c.jpg", "caption": "Contoh dokumentasi kamar cabang ketiga", "teks_alt": "Placeholder kamar cabang ketiga", "urutan": 8, "aktif": True},
]


DUMMY_FAQ = [
    {"pertanyaan": "Bagaimana cara menanyakan ketersediaan kamar?", "jawaban": "Pilih kamar yang kamu minati lalu gunakan tombol WhatsApp. Pesan akan terisi otomatis dengan nama dan harga kamar.", "urutan": 1, "aktif": True},
    {"pertanyaan": "Apakah harga yang tampil sudah final?", "jawaban": "Untuk saat ini data harga masih dummy. Ganti dengan harga resmi hasil konfirmasi Bu Henny sebelum website dipublikasikan.", "urutan": 2, "aktif": True},
    {"pertanyaan": "Apakah semua cabang memiliki fasilitas yang sama?", "jawaban": "Belum tentu. Informasi fasilitas pada data dummy hanya digunakan untuk menguji tampilan. Sesuaikan dengan kondisi masing-masing cabang.", "urutan": 3, "aktif": True},
    {"pertanyaan": "Apakah pemesanan dilakukan melalui website?", "jawaban": "Tidak. Website hanya membantu melihat informasi kamar. Konfirmasi ketersediaan dan detail masuk kos dilakukan langsung melalui WhatsApp.", "urutan": 4, "aktif": True},
    {"pertanyaan": "Apakah foto yang tampil merupakan foto asli?", "jawaban": "Belum. Foto bawaan seed diberi label DUMMY dan harus diganti dengan dokumentasi asli Kos Bu Henny.", "urutan": 5, "aktif": True},
]


def _count(db: Session, model: type) -> int:
    return int(db.scalar(select(func.count()).select_from(model)) or 0)


def _seed_dummy_content(db: Session) -> None:
    if not settings.seed_dummy_data:
        return

    branches: list[Cabang]
    if _count(db, Cabang) == 0:
        branches = [Cabang(**item) for item in DUMMY_BRANCHES]
        db.add_all(branches)
        db.flush()
    else:
        branches = list(db.scalars(select(Cabang).order_by(Cabang.id)).all())

    # Kamar hanya dibuat bila tabel kamar memang kosong. Dengan demikian restart
    # aplikasi tidak menggandakan data dan tidak menimpa data yang sudah diedit Owner.
    if _count(db, Kamar) == 0 and len(branches) >= 3:
        for branch_index, room_data in DUMMY_ROOMS:
            db.add(Kamar(cabang_id=branches[branch_index].id, **room_data))

    if _count(db, Fasilitas) == 0:
        db.add_all(Fasilitas(**item) for item in DUMMY_FACILITIES)

    if _count(db, Dokumentasi) == 0:
        db.add_all(Dokumentasi(**item) for item in DUMMY_DOCUMENTATION)

    if _count(db, Faq) == 0:
        db.add_all(Faq(**item) for item in DUMMY_FAQ)


def seed_database(db: Session) -> None:
    admin = db.scalar(select(Admin).where(Admin.username == settings.seed_admin_username))
    if admin is None:
        db.add(
            Admin(
                username=settings.seed_admin_username,
                password_hash=hash_password(settings.seed_admin_password),
                aktif=True,
            )
        )

    settings_row = db.scalar(select(PengaturanSitus).limit(1))
    if settings_row is None:
        settings_row = PengaturanSitus(
            nama_kos="Kos Bu Henny",
            nomor_whatsapp="6280000000000" if settings.seed_dummy_data else None,
            alamat=(
                "Alamat dummy Kos Bu Henny — ganti dengan alamat asli melalui dashboard Owner."
                if settings.seed_dummy_data
                else None
            ),
            hero_image="/media/seed/hero-kos-bu-henny.jpg" if settings.seed_dummy_data else None,
            hero_headline="Kamar yang nyaman untuk pulang setelah kuliah atau kerja.",
            hero_subheadline=(
                "Lihat pilihan kamar, bandingkan harga dan fasilitasnya, lalu tanyakan "
                "ketersediaannya langsung ke Bu Henny melalui WhatsApp."
            ),
        )
        db.add(settings_row)
    elif settings.seed_dummy_data:
        # Hanya isi field kosong; jangan menimpa pengaturan yang sudah diubah Owner.
        if not settings_row.nomor_whatsapp:
            settings_row.nomor_whatsapp = "6280000000000"
        if not settings_row.alamat:
            settings_row.alamat = "Alamat dummy Kos Bu Henny — ganti dengan alamat asli melalui dashboard Owner."
        if not settings_row.hero_image:
            settings_row.hero_image = "/media/seed/hero-kos-bu-henny.jpg"

    existing_keys = set(db.scalars(select(KontenHalaman.kunci)).all())
    for item in DEFAULT_CONTENT:
        if item["kunci"] not in existing_keys:
            db.add(KontenHalaman(**item))

    _seed_dummy_content(db)
    db.commit()
