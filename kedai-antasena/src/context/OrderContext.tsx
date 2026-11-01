'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ITEMS_BY_ID, type MenuItem } from '@/lib/menu';
import { DEFAULT_METHOD_ID, getMethod, getPaymentWindowMs } from '@/lib/payment';

type Cart = Record<string, number>;

interface PersistedOrder {
  table: string;
  cart: Cart;
  note: string;
  methodId: string;
  orderNo: string | null;
  /** Waktu batas pembayaran (epoch ms), null jika tanpa batas. */
  deadline: number | null;
}

export interface OrderLine {
  item: MenuItem;
  qty: number;
  subtotal: number;
}

interface OrderContextValue extends PersistedOrder {
  /** false sampai data tersimpan selesai dibaca di browser. */
  ready: boolean;
  lines: OrderLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setNote: (note: string) => void;
  /** Ganti nomor meja (huruf/angka, maks 6 karakter). */
  setTable: (table: string) => void;
  setMethod: (id: string) => void;
  /** Dipanggil saat menekan "Bayar Sekarang": membuat nomor pesanan dan batas waktu. */
  startPayment: () => void;
  /** Kosongkan pesanan (meja tetap). */
  reset: () => void;
}

const STORAGE_KEY = 'kedai-antasena-order-v1';
const DEFAULT_TABLE = '09';

const initialOrder: PersistedOrder = {
  table: DEFAULT_TABLE,
  cart: {},
  note: '',
  methodId: DEFAULT_METHOD_ID,
  orderNo: null,
  deadline: null,
};

const OrderContext = createContext<OrderContextValue | null>(null);

function readStored(): PersistedOrder {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialOrder;
    const parsed = JSON.parse(raw) as Partial<PersistedOrder>;
    const cart: Cart = {};
    for (const [id, qty] of Object.entries(parsed.cart ?? {})) {
      // Buang item yang sudah tidak ada di menu atau jumlah yang tidak valid.
      if (ITEMS_BY_ID[id] && Number.isInteger(qty) && qty > 0) cart[id] = qty;
    }
    return {
      table: typeof parsed.table === 'string' && parsed.table ? parsed.table : DEFAULT_TABLE,
      cart,
      note: typeof parsed.note === 'string' ? parsed.note : '',
      methodId: getMethod(parsed.methodId ?? DEFAULT_METHOD_ID).id,
      orderNo: typeof parsed.orderNo === 'string' ? parsed.orderNo : null,
      deadline: typeof parsed.deadline === 'number' ? parsed.deadline : null,
    };
  } catch {
    return initialOrder;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<PersistedOrder>(initialOrder);
  const [ready, setReady] = useState(false);

  // Baca data tersimpan + nomor meja dari URL (?meja=09) setelah halaman tampil di browser.
  useEffect(() => {
    const stored = readStored();
    const fromUrl = new URLSearchParams(window.location.search).get('meja');
    const table = fromUrl && /^[0-9A-Za-z-]{1,6}$/.test(fromUrl) ? fromUrl : stored.table;
    setOrder({ ...stored, table });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch {
      // Penyimpanan penuh atau diblokir: aplikasi tetap jalan tanpa penyimpanan.
    }
  }, [order, ready]);

  const setQty = useCallback((id: string, qty: number) => {
    if (!ITEMS_BY_ID[id]) return;
    setOrder((prev) => {
      const cart = { ...prev.cart };
      if (qty <= 0) delete cart[id];
      else cart[id] = Math.min(qty, 99);
      return { ...prev, cart };
    });
  }, []);

  const add = useCallback(
    (id: string) => {
      if (!ITEMS_BY_ID[id]) return;
      setOrder((prev) => ({
        ...prev,
        cart: { ...prev.cart, [id]: Math.min((prev.cart[id] ?? 0) + 1, 99) },
      }));
    },
    [],
  );

  const setTable = useCallback((table: string) => {
    const t = table.trim();
    if (/^[0-9A-Za-z-]{1,6}$/.test(t)) setOrder((prev) => ({ ...prev, table: t }));
  }, []);
  const setNote = useCallback((note: string) => setOrder((prev) => ({ ...prev, note })), []);
  const setMethod = useCallback(
    (id: string) => setOrder((prev) => ({ ...prev, methodId: getMethod(id).id })),
    [],
  );

  const startPayment = useCallback(() => {
    setOrder((prev) => {
      const windowMs = getPaymentWindowMs(getMethod(prev.methodId).kind);
      return {
        ...prev,
        orderNo: prev.orderNo ?? `ANT-${Math.floor(100 + Math.random() * 900)}`,
        deadline: windowMs === null ? null : Date.now() + windowMs,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setOrder((prev) => ({ ...initialOrder, table: prev.table }));
  }, []);

  const value = useMemo<OrderContextValue>(() => {
    const lines: OrderLine[] = Object.entries(order.cart)
      .map(([id, qty]) => {
        const item = ITEMS_BY_ID[id];
        return { item, qty, subtotal: item.price * qty };
      })
      .sort((a, b) => a.item.name.localeCompare(b.item.name, 'id'));
    return {
      ...order,
      ready,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      total: lines.reduce((sum, line) => sum + line.subtotal, 0),
      qtyOf: (id) => order.cart[id] ?? 0,
      add,
      setQty,
      setNote,
      setTable,
      setMethod,
      startPayment,
      reset,
    };
  }, [order, ready, add, setQty, setNote, setTable, setMethod, startPayment, reset]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder harus dipakai di dalam <OrderProvider>');
  return ctx;
}
