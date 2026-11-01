'use client';

import { useEffect, useState } from 'react';

/**
 * Sisa waktu (ms) sampai `deadline`. Mengembalikan null jika tidak ada batas
 * waktu atau belum dihitung (sebelum halaman tampil di browser).
 */
export function useCountdown(deadline: number | null): number | null {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) {
      setRemaining(null);
      return;
    }
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  return remaining;
}
