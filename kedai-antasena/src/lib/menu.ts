export const CATEGORIES = [
  'COFFEE',
  'MILKY',
  'TEA',
  'SQUASH',
  'CIRCLE SIZE',
  'SIGNATURE',
  'SNACKS',
  'HEAVY MEAL',
  'LAINNYA',
] as const;
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

export const DEFAULT_CATEGORY: Category = 'COFFEE';

// Menu Kedai Antasena. Harga di menu cetak ditulis dalam ribuan (10 = Rp 10.000).
const k = (ribu: number) => ribu * 1000;
const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function make(
  category: Category,
  rows: Array<[name: string, ribu: number, badge?: Badge]>,
): MenuItem[] {
  return rows.map(([name, ribu, badge]) => ({
    id: `${slug(category)}-${slug(name)}`,
    name,
    price: k(ribu),
    category,
    ...(badge ? { badge } : {}),
  }));
}

const ROPANG_SCOOP_VARIANTS = ['Redvelvet', 'Caramel', 'Choco', 'Matcha', 'Cheese'];

// Catatan: label (badge) di bawah hanya contoh untuk bagian "Rekomendasi Item".
// Ganti sesuai menu yang benar-benar terlaris / baru / promo.
export const ITEMS: MenuItem[] = [
  ...make('COFFEE', [
    ['Americano', 10],
    ['Palm Sugar Latte', 15, 'Terlaris'],
    ['Hazelnut Latte', 15],
    ['Pistachio Latte', 15, 'Baru'],
    ['Butterscotch Latte', 15],
    ['Salted Caramel', 15],
  ]),
  ...make('MILKY', [
    ['Vanilla Cheese', 13],
    ['Clasic Choco', 13],
    ['Redvelvet', 13],
    ['Matcha', 13],
    ['Cookies', 13],
  ]),
  ...make('TEA', [
    ['Jasmine Tea', 5],
    ['Lemon Tea', 7],
    ['Strawberry Tea', 7],
    ['Mango Tea', 7],
    ['Thai Tea', 10, 'Terlaris'],
    ['Milk Tea', 10],
  ]),
  ...make('SQUASH', [
    ['Strawberry', 12],
    ['Mango', 12],
  ]),
  ...make('CIRCLE SIZE', [
    ['Jasmine Tea (3-4 pax)', 15],
    ['Lemon Tea (3-4 pax)', 20],
    ['Strawberry Tea (3-4 pax)', 20],
    ['Mango Tea (3-4 pax)', 20],
  ]),
  ...make(
    'SIGNATURE',
    ROPANG_SCOOP_VARIANTS.map((v): [string, number] => [`Ropang ${v}`, 12]),
  ),
  ...make(
    'SIGNATURE',
    ROPANG_SCOOP_VARIANTS.map((v): [string, number] => [`Scoop ${v}`, 13]),
  ),
  ...make('SNACKS', [
    ['Donat Mochi', 12],
    // Menu cetak menulis "3-5". Dipakai 3 ribu; sesuaikan per jenis sate.
    ['Sate-satean', 3],
    ['Dimsum Ori', 13],
    ['Dimsum Mentai', 15, 'Promo'],
    ['French Fries', 15],
    ['Mix Platter', 18],
  ]),
  ...make('HEAVY MEAL', [
    ['Sambal Matah - Nasi Kulit', 15],
    ['Sambal Matah - Nasi Ayam Bakar', 15],
    ['Sambal Matah - Nasi Ayam Goreng', 15],
    ['Sop Rempah - Sop Kulit', 15],
    ['Sop Rempah - Sop Ayam', 15],
  ]),
  ...make('LAINNYA', [
    ['Sambal Matah', 2],
    ['Nasi Putih', 4],
    ['Air Mineral', 5],
  ]),
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
