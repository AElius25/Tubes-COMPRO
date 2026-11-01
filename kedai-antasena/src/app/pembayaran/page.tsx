'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { OrderLines } from '@/components/OrderLines';
import { useOrder } from '@/context/OrderContext';
import { formatRupiah } from '@/lib/format';
import { METHOD_GROUPS } from '@/lib/payment';

export default function PembayaranPage() {
  const router = useRouter();
  const { ready, count, total, methodId, setMethod, startPayment } = useOrder();

  // Tidak ada pesanan: kembali ke menu.
  useEffect(() => {
    if (ready && count === 0) router.replace('/');
  }, [ready, count, router]);

  if (!ready || count === 0) {
    return (
      <div className="page">
        <Header title="Pembayaran" backHref="/keranjang" />
      </div>
    );
  }

  const pay = () => {
    startPayment();
    router.push('/pembayaran/bayar');
  };

  return (
    <div className="page page--with-bar">
      <Header title="Pembayaran" backHref="/keranjang" />

      <main className="container pay-layout">
        <aside className="pay-summary">
          <section className="card" aria-label="Ringkasan pesanan">
            <h2 className="card__title">Ringkasan Pesanan</h2>
            <OrderLines />
            <hr className="divider" />
            <div className="row row--between total-row">
              <span>Total</span>
              <span className="total-amount">{formatRupiah(total)}</span>
            </div>
          </section>
          <div className="actions-desktop">
            <button type="button" className="btn btn-primary btn-block" onClick={pay}>
              Bayar Sekarang
            </button>
          </div>
        </aside>

        <section className="pay-methods" aria-labelledby="h-metode">
          <h2 id="h-metode" className="section-title">
            Metode Pembayaran
          </h2>
          {METHOD_GROUPS.map((group) => (
            <div key={group.title} className="method-group" role="radiogroup" aria-label={group.title}>
              <h3 className="group-title">{group.title}</h3>
              <div className="method-grid">
                {group.methods.map((method) => (
                  <label key={method.id} className="method">
                    <input
                      type="radio"
                      name="metode"
                      value={method.id}
                      checked={methodId === method.id}
                      onChange={() => setMethod(method.id)}
                    />
                    <span className="method__text">
                      <span className="method__name">{method.name}</span>
                      <span className="method__desc">{method.description}</span>
                    </span>
                    <span className="method__dot" aria-hidden="true" />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="bar">
        <div className="bar__total">
          <span className="muted tiny">Total</span>
          <strong>{formatRupiah(total)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-grow" onClick={pay}>
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
