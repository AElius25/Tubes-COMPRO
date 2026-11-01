export type MethodKind = 'qris' | 'ewallet' | 'va' | 'kasir';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  kind: MethodKind;
}

export interface MethodGroup {
  title: string;
  methods: PaymentMethod[];
}

export const METHOD_GROUPS: MethodGroup[] = [
  {
    title: 'Pembayaran instan',
    methods: [
      { id: 'qris', name: 'QRIS', description: 'Scan dengan e-wallet atau m-banking apa pun', kind: 'qris' },
    ],
  },
  {
    title: 'E-Wallet',
    methods: [
      { id: 'gopay', name: 'GoPay', description: 'Bayar lewat aplikasi', kind: 'ewallet' },
      { id: 'ovo', name: 'OVO', description: 'Bayar lewat aplikasi', kind: 'ewallet' },
      { id: 'dana', name: 'DANA', description: 'Bayar lewat aplikasi', kind: 'ewallet' },
      { id: 'shopeepay', name: 'ShopeePay', description: 'Bayar lewat aplikasi', kind: 'ewallet' },
    ],
  },
  {
    title: 'Transfer bank',
    methods: [
      { id: 'bca', name: 'BCA Virtual Account', description: 'Transfer lewat ATM atau m-banking', kind: 'va' },
      { id: 'bri', name: 'BRI Virtual Account', description: 'Transfer lewat ATM atau m-banking', kind: 'va' },
      { id: 'mandiri', name: 'Mandiri Virtual Account', description: 'Transfer lewat ATM atau m-banking', kind: 'va' },
    ],
  },
  {
    title: 'Lainnya',
    methods: [
      { id: 'kasir', name: 'Bayar di Kasir', description: 'Tunai atau kartu langsung di kasir', kind: 'kasir' },
    ],
  },
];

export const DEFAULT_METHOD_ID = 'qris';

const ALL_METHODS = METHOD_GROUPS.flatMap((group) => group.methods);

export function getMethod(id: string): PaymentMethod {
  return ALL_METHODS.find((m) => m.id === id) ?? ALL_METHODS[0];
}

/** Batas waktu bayar dalam milidetik; null berarti tanpa batas waktu. */
export function getPaymentWindowMs(kind: MethodKind): number | null {
  if (kind === 'kasir') return null;
  if (kind === 'va') return 24 * 60 * 60 * 1000;
  return 15 * 60 * 1000;
}

export function getInstructionTitle(method: PaymentMethod): string {
  switch (method.kind) {
    case 'qris':
      return 'Pembayaran QRIS';
    case 'ewallet':
      return `Bayar dengan ${method.name}`;
    case 'va':
      return method.name;
    case 'kasir':
      return 'Bayar di Kasir';
  }
}

export function getHowToTitle(kind: MethodKind): string {
  return kind === 'va' ? 'Cara membayar lewat ATM atau m-banking' : 'Cara membayar';
}

export function getHowToSteps(method: PaymentMethod, totalText: string): string[] {
  switch (method.kind) {
    case 'qris':
      return [
        'Buka aplikasi e-wallet atau m-banking kamu',
        'Pilih menu Scan QR dan arahkan ke kode di atas',
        'Cek nominal, lalu konfirmasi pembayaran',
      ];
    case 'ewallet':
      return [
        `Masukkan nomor HP yang terdaftar di ${method.name}`,
        `Buka aplikasi ${method.name} dan cek notifikasi pembayaran`,
        'Cek nominal, lalu konfirmasi pembayaran di aplikasi',
      ];
    case 'va':
      return [
        'Pilih menu Transfer, lalu Virtual Account',
        'Masukkan nomor Virtual Account di atas',
        `Cek nominal ${totalText}, lalu konfirmasi pembayaran`,
      ];
    case 'kasir':
      return [
        'Datangi kasir',
        'Sebutkan atau tunjukkan kode pesanan di atas',
        'Bayar tunai atau dengan kartu, lalu pesananmu diproses',
      ];
  }
}
