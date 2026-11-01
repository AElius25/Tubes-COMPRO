'use client';

import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';

/** Daftar "2× Siomay Ayam ... Rp 24.000" untuk ringkasan dan struk. */
export function OrderLines() {
  const { lines } = useOrder();

  return (
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
  );
}
