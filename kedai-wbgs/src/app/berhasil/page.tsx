'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Check } from '@/components/Icons';
import { OrderLines } from '@/components/OrderLines';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';
import { getMethod } from '@/lib/payment';

export default function BerhasilPage() {
  const router = useRouter();
  const { ready, count, total, table, methodId, orderNo, note, reset } = useOrder();

  useEffect(() => {
    if (ready && (count === 0 || !orderNo)) router.replace('/');
  }, [ready, count, orderNo, router]);

  if (!ready || count === 0 || !orderNo) {
    return (
      <div className="page">
        <Header />
      </div>
    );
  }

  const again = () => {
    reset();
    router.push('/');
  };

  const button = (
    <button type="button" className="btn btn-primary btn-block btn-grow" onClick={again}>
      Pesan Lagi
    </button>
  );

  return (
    <div className="page page--with-bar">
      <Header />

      <main className="container narrow pay-flow" style={{ paddingTop: 28 }}>
        <div className="check-circle">
          <Check size={36} />
        </div>
        <div className="center" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 className="success-title">Pembayaran Berhasil</h1>
          <p className="muted" style={{ fontSize: 12 }}>
            Pesanan kamu sedang disiapkan
          </p>
        </div>

        <section className="card receipt" aria-label="Struk pesanan">
          <div className="row row--between">
            <span className="muted">No. Pesanan</span>
            <strong>#{orderNo}</strong>
          </div>
          <div className="row row--between">
            <span className="muted">Meja</span>
            <strong>Table {table}</strong>
          </div>
          <div className="row row--between">
            <span className="muted">Metode pembayaran</span>
            <strong>{getMethod(methodId).name}</strong>
          </div>
          <hr className="divider" />
          <OrderLines />
          {note.trim() && <p className="note-line">Catatan: {note.trim()}</p>}
          <hr className="divider" />
          <div className="row row--between total-row">
            <span>Total dibayar</span>
            <span className="total-amount">{formatRupiah(total)}</span>
          </div>
        </section>

        <section className="card status-card" aria-label="Status pesanan">
          <h2 className="card__title" style={{ fontSize: 13 }}>
            Status pesanan
          </h2>
          <div className="status-step">
            <span className="indicator indicator--done">
              <Check size={12} strokeWidth={3} />
            </span>
            Pesanan diterima
          </div>
          <div className="status-step">
            <span className="indicator indicator--now" />
            Sedang disiapkan
          </div>
          <div className="status-step status-step--next">
            <span className="indicator" />
            Siap disajikan di meja
          </div>
        </section>

        <div className="actions-desktop">{button}</div>
      </main>

      <div className="bar">{button}</div>
    </div>
  );
}
