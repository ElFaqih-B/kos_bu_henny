# Kos Omah Subardiman

Website resmi Kos Omah Subardiman yang digunakan untuk menampilkan informasi kos, kamar, fasilitas, cabang, dokumentasi, serta memudahkan calon penghuni mendapatkan informasi dan menghubungi pengelola.

Website dirancang dengan pendekatan modern, responsif, dan mobile-first sehingga informasi kamar dapat diakses dengan nyaman melalui desktop maupun perangkat mobile.

## Preview

Website:
[https://kos-omah-subardiman.vercel.app](https://omah-subardiman-kos.vercel.app/)


---

## Tentang Website

Kos Omah Subardiman menyediakan beberapa pilihan kamar dengan informasi yang dapat dilihat secara langsung melalui website.

Setiap kamar memiliki informasi seperti:

- Nama kamar
- Cabang
- Harga sewa
- Periode harga
- Ukuran kamar
- Tipe kamar
- Ketersediaan
- Fasilitas
- Foto kamar
- Deskripsi kamar

Pengunjung dapat melihat daftar kamar melalui Room Section dan membuka detail kamar melalui popup/modal tanpa harus berpindah halaman.

Jika kamar tersedia dan nomor WhatsApp telah dikonfigurasi, pengunjung juga dapat langsung menghubungi pengelola melalui WhatsApp.

---

## Fitur Utama

### Landing Page

Menampilkan informasi utama mengenai Kos Omah Subardiman dalam satu halaman.

Bagian utama website meliputi:

- Hero Section
- About Section
- Room Section
- Gallery Section
- Location Section
- Footer

### Informasi Kamar

Setiap Room Card menampilkan informasi penting mengenai kamar secara ringkas, seperti:

- Foto kamar
- Nama kamar
- Lokasi/cabang
- Harga
- Ukuran
- Tipe kamar
- Status ketersediaan

Status kamar ditampilkan secara langsung sehingga pengunjung dapat mengetahui apakah kamar masih tersedia atau sudah penuh.

### Detail Kamar

Pengunjung dapat membuka detail kamar melalui modal.

Detail kamar menampilkan:

- Gallery foto
- Nama kamar
- Cabang
- Harga
- Ketersediaan
- Ukuran
- Fasilitas
- Deskripsi kamar
- Tombol kontak WhatsApp

Gallery mendukung navigasi foto menggunakan tombol sebelumnya/berikutnya dan keyboard arrow pada desktop.

### WhatsApp

Website menyediakan integrasi WhatsApp untuk memudahkan calon penghuni menghubungi pengelola.

Pesan WhatsApp dibuat secara otomatis berdasarkan kamar yang dipilih sehingga informasi kamar sudah tercantum di dalam pesan.

### Responsive Design

Website dibuat responsive untuk berbagai ukuran layar:

- Desktop
- Tablet
- Mobile

Tampilan Room Card dan Room Detail Modal juga menyesuaikan ukuran layar agar tetap nyaman digunakan pada perangkat mobile.

### Animasi

Beberapa elemen website menggunakan animasi ringan untuk memberikan pengalaman yang lebih hidup tanpa mengganggu akses terhadap informasi.

Animasi digunakan pada:

- Page transition
- Room modal
- Gallery interaction
- Button interaction
- Hover state

Animasi tetap dibuat sederhana dan mempertimbangkan `prefers-reduced-motion`.

---

## Teknologi

Frontend website menggunakan:

| Teknologi | Penggunaan |
|---|---|
| Next.js | Framework frontend |
| React | UI component |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Lucide React | Icon |
| Next Image | Image optimization |
| REST API | Komunikasi dengan backend |
| Vercel | Deployment |

Backend dan API menyediakan data untuk kebutuhan website seperti kamar, cabang, fasilitas, dokumentasi, dan konten lainnya.

---

## Arsitektur

Website menggunakan pendekatan component-based architecture.

Struktur utama frontend:

```text
frontend/
├── app/
│   ├── admin/
│   ├── api/
│   ├── kamar/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── admin/
│   ├── landing/
│   │   ├── AboutSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LocationSection.tsx
│   │   ├── RoomCard.tsx
│   │   ├── RoomDetailModal.tsx
│   │   └── RoomSection.tsx
│   │
│   └── ui/
│
├── lib/
│   ├── admin-auth.ts
│   ├── admin-client.ts
│   ├── backend-urls.ts
│   ├── format.ts
│   ├── media.ts
│   └── types.ts
│
├── public/
│
├── next.config.ts
├── package.json
└── tsconfig.json
