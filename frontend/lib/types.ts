export type PengaturanSitus = {
  id: number;
  nama_kos: string;
  nomor_whatsapp: string | null;

  hero_image: string | null;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  alamat: string | null;
  google_maps_url: string | null;
};


export type Cabang = {
  id: number;
  nama: string;
  kota: string;
  alamat: string;

  deskripsi: string | null;
  patokan: string | null;

  nomor_whatsapp: string;
  url_maps: string | null;
  url_gambar: string | null;

  aktif: boolean;
  urutan: number;
};


export type Kamar = {
  id: number;
  cabang_id: number;

  nama: string;
  slug: string;
  tipe: string;

  deskripsi: string | null;

  harga_bulanan: number;
  periode_harga: string;

  jumlah_kamar: number;
  kamar_tersedia: number;

  ukuran: string | null;

  url_gambar: string | null;

  fasilitas: string[];

  aktif: boolean;
  urutan: number;
};


export type Fasilitas = {
  id: number;
  nama: string;
  ikon: string | null;
  kategori: string | null;

  deskripsi: string | null;

  aktif: boolean;
  urutan: number;
};


export type Dokumentasi = {
  id: number;

  path_foto: string;

  caption: string | null;
  teks_alt: string | null;

  aktif: boolean;
  urutan: number;
};