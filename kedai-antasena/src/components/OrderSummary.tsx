'use client';

import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';

/** Panel "Your Order Summary" di sisi kanan tampilan web. */
export function OrderSummary() {
  const { table, lines, count, total } = useOrder();

  return (
    <section className="card summary-panel" aria-label="Ringkasan pesanan">
      <div className="row row--between">
        <h2 className="card__title">Your Order Summary</h2>
        <span className="muted small">Table {table}</span>
      </div>

      {lines.length === 0 ? (
        <p className="empty-box">Belum ada item. Tekan + Add untuk memesan.</p>
      ) : (
        <ul className="lines">
          {lines.map(({ item, qty, subtotal }) => (
            <li key={item.id} className="row row--between">
              <span className="muted">
                {qty}× {item.name}
              </span>
              <span>{formatRupiah(subtotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="row row--between">
        <span className="muted small">{count} Items</span>
        <strong>{formatRupiah(total)}</strong>
      </div>

      {count > 0 ? (
        <Link href="/keranjang" className="btn btn-primary btn-block">
          View Cart
        </Link>
      ) : (
        <button type="button" className="btn btn-primary btn-block" disabled>
          View Cart
        </button>
      )}
    </section>
  );
}
