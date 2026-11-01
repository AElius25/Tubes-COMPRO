'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { ChevronLeft } from './Icons';

interface HeaderProps {
  /** Judul halaman. Kosong = tampilan merek (logo + "Kedai Antasena"). */
  title?: string;
  /** Jika diisi, header menampilkan tombol kembali ke alamat ini. */
  backHref?: string;
}

export function Header({ title, backHref }: HeaderProps) {
  const { table, setTable } = useOrder();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  // Nomor meja hanya bisa diubah manual di halaman menu (tanpa tombol kembali).
  const canEdit = !backHref;

  const save = () => {
    setTable(draft);
    setEditing(false);
  };

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
          <span className="overline">{backHref ? 'Kedai Antasena' : 'Order At'}</span>
          <span className="app-header__title">{title ?? 'Kedai Antasena'}</span>
        </div>
        {editing ? (
          <form
            className="table-edit"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <input
              className="table-edit__input"
              aria-label="Nomor meja"
              value={draft}
              maxLength={6}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onBlur={save}
            />
          </form>
        ) : canEdit ? (
          <button
            type="button"
            className="table-badge table-badge--btn"
            aria-label={`Meja ${table}, ketuk untuk ganti`}
            onClick={() => {
              setDraft(table);
              setEditing(true);
            }}
          >
            Table {table} ✎
          </button>
        ) : (
          <span className="table-badge">Table {table}</span>
        )}
      </div>
    </header>
  );
}
