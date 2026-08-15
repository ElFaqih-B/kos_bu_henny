export type Admin = {
  id: number;
  username: string;
  aktif: boolean;
};

export type Cabang = {
  id: number;
  nama: string;
  kota: string;
  alamat: string;
  deskripsi: string | null;
  patokan: string | null;
  nomor_whatsapp: string | null;

  /**
   * URL Google Maps yang dimasukkan oleh admin.
   * Field ini tetap menjadi sumber untuk tombol
   * "Buka Google Maps".
   */
  url_maps: string | null;

  /**
   * Koordinat hasil resolusi backend dari url_maps.
   * Admin tidak mengisi kedua field ini secara manual.
   */
  latitude: number | null;
  longitude: number | null;

  url_gambar: string | null;
  urutan: number;
  aktif: boolean;
};

export type KamarFoto = {
  id: number;
  kamar_id: number;
  path_foto: string;
  caption: string | null;
  teks_alt: string;
  urutan: number;
  aktif: boolean;
};

export type Kamar = {
  id: number;
  cabang_id: number;
  nama: string;
  slug: string | null;
  tipe: string;
  deskripsi: string | null;
  harga_bulanan: number;
  periode_harga: string;
  jumlah_kamar: number;
  kamar_tersedia: number;
  ukuran: string | null;
  url_gambar: string | null;
  fasilitas: string[];
  urutan: number;
  aktif: boolean;

  cabang?: Cabang | null;
  foto?: KamarFoto[];
};

export type Fasilitas = {
  id: number;
  nama: string;
  ikon: string | null;
  kategori: string;
  deskripsi: string | null;
  urutan: number;
  aktif: boolean;
};

export type Dokumentasi = {
  id: number;
  cabang_id: number | null;
  path_foto: string;
  caption: string | null;
  teks_alt: string;
  urutan: number;
  aktif: boolean;
};

export type KontenHalaman = {
  id: number;
  kunci: string;
  judul: string | null;
  isi: string | null;
  aktif: boolean;
  urutan: number;
};

export type Pengaturan = {
  id: number;
  nama_kos: string;
  nomor_whatsapp: string | null;
  tiktok_url: string | null;

  hero_image: string | null;

  hero_headline: string;
  hero_subheadline: string;

  hero_cta_primary: string;
  hero_cta_secondary: string;

  cta_heading: string | null;
  cta_description: string | null;
};

export type RingkasanAdmin = {
  jumlah_tipe_kamar: number;
  jumlah_kamar_tersedia: number;
  jumlah_dokumentasi: number;
  jumlah_fasilitas: number;
  konten_terakhir_diperbarui: string | null;
};

export type UploadResponse = {
  path: string;
  url: string;
};