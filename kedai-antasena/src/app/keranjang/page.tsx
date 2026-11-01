'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { MenuRow } from '@/components/MenuRow';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';

export default function KeranjangPage() {
  const { ready, lines, count, total, note, setNote } = useOrder();

  if (!ready) {
    return (
      <div className="page">
        <Header title="Keranjang" backHref="/" />
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="page">
        <Header title="Keranjang" backHref="/" />
        <main className="container narrow">
          <div className="empty-state">
            <strong>Keranjang masih kosong</strong>
            <p>Tekan + Add di menu untuk mulai memesan.</p>
            <Link href="/" className="btn btn-outline">
              Kembali ke Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page--with-bar">
      <Header title="Keranjang" backHref="/" />

      <main className="container narrow stack">
        <div className="menu-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
          {lines.map(({ item }) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </div>

        <div className="field">
          <label htmlFor="catatan">Catatan pesanan</label>
          <textarea
            id="catatan"
            className="textarea"
            rows={2}
            maxLength={200}
            placeholder="Contoh: tanpa sambal, es dipisah"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <section className="card" aria-label="Total pesanan">
          <div className="row row--between" style={{ fontSize: 12 }}>
            <span className="muted">Subtotal ({count} item)</span>
            <span>{formatRupiah(total)}</span>
          </div>
          <hr className="divider" />
          <div className="row row--between total-row">
            <span>Total</span>
            <span className="total-amount">{formatRupiah(total)}</span>
          </div>
        </section>

        <div className="actions-desktop">
          <Link href="/pembayaran" className="btn btn-primary btn-block">
            Lanjut ke Pembayaran
          </Link>
        </div>
      </main>

      <div className="bar">
        <div className="bar__total">
          <span className="muted tiny">{count} Items</span>
          <strong>{formatRupiah(total)}</strong>
        </div>
        <Link href="/pembayaran" className="btn btn-primary btn-grow">
          Lanjut ke Pembayaran
        </Link>
      </div>
    </div>
  );
}
