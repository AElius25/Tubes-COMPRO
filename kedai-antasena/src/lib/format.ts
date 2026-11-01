/** 12000 -> "Rp 12.000" */
export function formatRupiah(amount: number): string {
  return 'Rp ' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Milidetik -> "14:59" atau "23:59:59" */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
