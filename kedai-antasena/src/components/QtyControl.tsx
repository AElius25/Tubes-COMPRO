'use client';

import { useOrder } from '@/context/OrderContext';
import type { MenuItem } from '@/lib/menu';

interface QtyControlProps {
  item: MenuItem;
  size?: 'sm' | 'md';
}

/** Tombol "+ Add" yang berubah menjadi stepper − n + setelah item masuk keranjang. */
export function QtyControl({ item, size = 'md' }: QtyControlProps) {
  const { qtyOf, add, setQty } = useOrder();
  const qty = qtyOf(item.id);

  if (qty === 0) {
    return (
      <button
        type="button"
        className={`btn-add btn-add--${size}`}
        aria-label={`Tambah ${item.name}`}
        onClick={() => add(item.id)}
      >
        + Add
      </button>
    );
  }

  return (
    <div className={`stepper stepper--${size}`}>
      <button
        type="button"
        className="stepper__btn"
        aria-label={`Kurangi ${item.name}`}
        onClick={() => setQty(item.id, qty - 1)}
      >
        −
      </button>
      <span className="stepper__qty" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className="stepper__btn stepper__btn--filled"
        aria-label={`Tambah ${item.name}`}
        onClick={() => add(item.id)}
      >
        +
      </button>
    </div>
  );
}
