export type Cabang = {
  id: number;
  nama: string;
  kota: string;
  alamat: string;
  deskripsi: string | null;
  patokan: string | null;
  nomor_whatsapp: string | null;
  url_maps: string | null;
  url_gambar: string | null;
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
  cabang: Cabang | null;
};

export type Dokumentasi = {
  id: number;
  path_foto: string;
  caption: string | null;
  teks_alt: string;
  urutan: number;
  aktif: boolean;
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

export type Pengaturan = {
  id: number;
  nama_kos: string;
  nomor_whatsapp: string | null;
  alamat: string | null;
  google_maps_url: string | null;
  instagram_url: string | null;

  hero_image: string | null;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  cta_heading: string;
  cta_description: string;
};