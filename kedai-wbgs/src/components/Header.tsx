'use client';

import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { ChevronLeft } from './Icons';

interface HeaderProps {
  /** Judul halaman. Kosong = tampilan merek (logo + "Kedai WBGS"). */
  title?: string;
  /** Jika diisi, header menampilkan tombol kembali ke alamat ini. */
  backHref?: string;
}

export function Header({ title, backHref }: HeaderProps) {
  const { table } = useOrder();

  return (
    <header className="app-header">
      <div className="app-header__inner container">
        {backHref ? (
          <Link href={backHref} className="back-btn" aria-label="Kembali">
            <ChevronLeft />
          </Link>
        ) : (
          <div className="logo" aria-hidden="true">
            LOGO
          </div>
        )}
        <div className="app-header__text">
          <span className="overline">{backHref ? 'Kedai WBGS' : 'Order At'}</span>
          <span className="app-header__title">{title ?? 'Kedai WBGS'}</span>
        </div>
        <span className="table-badge">Table {table}</span>
      </div>
    </header>
  );
}
