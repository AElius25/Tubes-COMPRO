# Kedai Antasena - Self Order (Next.js)

Front end pemesanan mandiri dari meja: menu, keranjang, pembayaran, instruksi bayar, dan halaman berhasil.
Satu codebase responsif: mobile (bar bawah) dan web (>= 1024px, dua kolom dengan ringkasan di samping).

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
# produksi:
npm run build && npm start
```

Nomor meja lewat URL: `http://localhost:3000/?meja=09` (cocok untuk QR di tiap meja).

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Kategori, rekomendasi (label Terlaris/Baru/Promo), full menu, + Add / stepper |
| `/keranjang` | Daftar pesanan, catatan, total |
| `/pembayaran` | Pilih metode: QRIS, e-wallet, Virtual Account, bayar di kasir |
| `/pembayaran/bayar` | Instruksi per metode + hitung mundur |
| `/berhasil` | Struk dan status pesanan |

## Struktur

- `src/lib/menu.ts` - data menu dan kategori (ganti dengan API/database)
- `src/lib/payment.ts` - metode bayar, batas waktu, langkah cara bayar
- `src/context/OrderContext.tsx` - state keranjang (disimpan di localStorage)
- `src/components/` - komponen UI
- `src/app/globals.css` - token desain (warna, ukuran) dan semua gaya

## Yang masih placeholder

- Foto menu: isi `image` di `src/lib/menu.ts`.
- QR QRIS, nomor Virtual Account, dan nomor pesanan dibuat palsu di sisi klien.
- Tombol "Saya Sudah Bayar" hanya simulasi. Di produksi, status bayar harus dari
  payment gateway (webhook/polling) dan pesanan dikirim ke backend/kasir.
- Harga dihitung di klien. Backend wajib menghitung ulang total dari ID item.
