'use client';

import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';

/** Bar keranjang di bagian bawah layar mobile. Disembunyikan di layar lebar. */
export function CartBar() {
  const { count, total } = useOrder();

  return (
    <div className="bar">
      <div className="bar__total">
        <span className="muted tiny">{count} Items</span>
        <strong>{formatRupiah(total)}</strong>
      </div>
      {count > 0 ? (
        <Link href="/keranjang" className="btn btn-primary">
          View Cart
        </Link>
      ) : (
        <button type="button" className="btn btn-primary" disabled>
          View Cart
        </button>
      )}
    </div>
  );
}
