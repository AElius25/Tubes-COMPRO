import type { MenuItem } from '@/lib/menu';

interface PhotoProps {
  item: MenuItem;
  className?: string;
  children?: React.ReactNode;
}

/** Foto item. Tanpa gambar, tampil kotak placeholder "Foto". */
export function Photo({ item, className = '', children }: PhotoProps) {
  return (
    <div className={`photo ${className}`.trim()}>
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.name} className="photo__img" />
      ) : (
        <span className="photo__label" aria-hidden="true">
          Foto
        </span>
      )}
      {children}
    </div>
  );
}
