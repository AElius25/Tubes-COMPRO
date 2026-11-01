'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useOrder } from '@/context/OrderContext';
import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown, formatRupiah } from '@/lib/format';
import {
  getHowToSteps,
  getHowToTitle,
  getInstructionTitle,
  getMethod,
} from '@/lib/payment';

// Placeholder: ganti dengan data dari payment gateway (QR string, nomor VA, dst.).
const VA_PLACEHOLDER = '[NOMOR VIRTUAL ACCOUNT]';

export default function BayarPage() {
  const router = useRouter();
  const { ready, count, total, methodId, orderNo, deadline } = useOrder();
  const method = getMethod(methodId);
  const remaining = useCountdown(deadline);
  const expired = remaining === 0;

  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (count === 0) router.replace('/');
    else if (!orderNo) router.replace('/pembayaran');
  }, [ready, count, orderNo, router]);

  if (!ready || count === 0 || !orderNo) {
    return (
      <div className="page">
        <Header title="Pembayaran" backHref="/pembayaran" />
      </div>
    );
  }

  const totalText = formatRupiah(total);
  const steps = getHowToSteps(method, totalText);

  const copyVa = async () => {
    try {
      await navigator.clipboard.writeText(VA_PLACEHOLDER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard tidak tersedia: abaikan.
    }
  };

  const paidLabel = method.kind === 'kasir' ? 'Sudah Dibayar di Kasir' : 'Saya Sudah Bayar';
  // Catatan: di aplikasi sungguhan, status "sudah bayar" harus datang dari
  // payment gateway (webhook/polling), bukan dari tombol ini.
  const goPaid = () => router.push('/berhasil');

  const actions = (
    <>
      <button type="button" className="btn btn-primary btn-block btn-grow" onClick={goPaid} disabled={expired}>
        {paidLabel}
      </button>
      <Link href="/pembayaran" className="btn btn-outline btn-block">
        Ganti Metode Pembayaran
      </Link>
    </>
  );

  return (
    <div className="page page--with-bar" style={{ paddingBottom: undefined }}>
      <Header title={getInstructionTitle(method)} backHref="/pembayaran" />

      <main className="container narrow pay-flow">
        <div className="chip">
          <span className="chip__dot" aria-hidden="true" />
          {method.kind === 'kasir' ? 'Menunggu pembayaran di kasir' : 'Menunggu pembayaran'}
        </div>

        {remaining !== null && (
          <p className="timer" role="timer">
            {expired ? (
              'Waktu pembayaran habis. Pilih metode lagi untuk memulai ulang.'
            ) : (
              <>
                Selesaikan pembayaran dalam <strong>{formatCountdown(remaining)}</strong>
              </>
            )}
          </p>
        )}

        <section className="card pay-card" aria-label="Detail pembayaran">
          {method.kind === 'qris' && (
            <div className="qr-box" role="img" aria-label="Tempat QR code QRIS">
              QR Code QRIS
              <br />
              (placeholder)
            </div>
          )}

          {method.kind === 'ewallet' && (
            <div className="field field--compact">
              <label htmlFor="hp">Nomor HP yang terdaftar di {method.name}</label>
              <input
                id="hp"
                className="input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
              />
              <span className="hint-text">Permintaan pembayaran akan dikirim ke aplikasi e-wallet kamu.</span>
            </div>
          )}

          {method.kind === 'va' && (
            <div className="field field--compact">
              <span className="hint-text">Nomor {method.name}</span>
              <div className="va-box">
                <span className="va-box__num">{VA_PLACEHOLDER}</span>
                <button type="button" className="btn btn-outline btn-small" onClick={copyVa}>
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>
          )}

          {method.kind === 'kasir' && (
            <div className="order-code">
              <span>Tunjukkan kode pesanan ini ke kasir</span>
              <strong>#{orderNo}</strong>
            </div>
          )}

          <div className="total-block">
            <span>Total pembayaran</span>
            <strong>{totalText}</strong>
          </div>
          <hr className="divider" style={{ width: '100%' }} />
          <div className="row row--between small">
            <span className="muted">No. Pesanan</span>
            <strong>#{orderNo}</strong>
          </div>
        </section>

        <section className="card howto" aria-label={getHowToTitle(method.kind)}>
          <h2 className="card__title" style={{ fontSize: 13 }}>
            {getHowToTitle(method.kind)}
          </h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="actions-desktop">{actions}</div>
      </main>

      <div className="bar bar--stack">{actions}</div>
    </div>
  );
}
