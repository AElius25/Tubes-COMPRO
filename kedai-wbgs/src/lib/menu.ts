export const CATEGORIES = ['MAKANAN', 'DIMSUM', 'MINUMAN', 'JAJANAN'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Badge = 'Terlaris' | 'Baru' | 'Promo';

export interface MenuItem {
  id: string;
  name: string;
  /** Harga dalam rupiah (angka bulat). */
  price: number;
  category: Category;
  /** Jika diisi, item tampil di bagian "Rekomendasi Item" dengan label ini. */
  badge?: Badge;
  /** Ganti dengan URL foto asli. Jika kosong, tampil placeholder "Foto". */
  image?: string;
}

export const DEFAULT_CATEGORY: Category = 'DIMSUM';

// Data contoh. Sambungkan ke API/CMS bila sudah ada backend.
export const ITEMS: MenuItem[] = [
  { id: 'siomay-ayam', name: 'Siomay Ayam', price: 12000, category: 'DIMSUM', badge: 'Terlaris' },
  { id: 'hakau-udang', name: 'Hakau Udang', price: 15000, category: 'DIMSUM', badge: 'Terlaris' },
  { id: 'lumpia-tahu', name: 'Lumpia Tahu', price: 12000, category: 'DIMSUM', badge: 'Baru' },
  { id: 'bakpao-isi', name: 'Bakpao Isi', price: 10000, category: 'DIMSUM', badge: 'Promo' },
  { id: 'pangsit-goreng', name: 'Pangsit Goreng', price: 11000, category: 'JAJANAN' },
  { id: 'mie-ayam-kecil', name: 'Mie Ayam Kecil', price: 14000, category: 'MAKANAN' },
  { id: 'es-teh-manis', name: 'Es Teh Manis', price: 5000, category: 'MINUMAN' },
  { id: 'jeruk-hangat', name: 'Jeruk Hangat', price: 6000, category: 'MINUMAN' },
];

export const ITEMS_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  ITEMS.map((item) => [item.id, item]),
);

/**
 * Rekomendasi saat ini sederhana: item yang diberi label (badge).
 * Ganti fungsi ini jika nanti rekomendasi dihitung dari data pesanan,
 * misalnya terlaris minggu ini atau "sering dipesan bersama".
 */
export function getRecommended(): MenuItem[] {
  return ITEMS.filter((item) => item.badge);
}

export function getItemsByCategory(category: Category): MenuItem[] {
  return ITEMS.filter((item) => item.category === category);
}
