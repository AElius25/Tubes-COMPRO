import { formatRupiah } from '@/lib/format';
import type { MenuItem } from '@/lib/menu';
import { Photo } from './Photo';
import { QtyControl } from './QtyControl';

export function MenuRow({ item }: { item: MenuItem }) {
  return (
    <article className="menu-row">
      <Photo item={item} className="photo--row" />
      <div className="menu-row__text">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">{formatRupiah(item.price)}</p>
      </div>
      <QtyControl item={item} size="md" />
    </article>
  );
}
