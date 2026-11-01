import { formatRupiah } from '@/lib/format';
import type { MenuItem } from '@/lib/menu';
import { Photo } from './Photo';
import { QtyControl } from './QtyControl';

export function RecommendCard({ item }: { item: MenuItem }) {
  return (
    <article className="rec-card">
      <Photo item={item} className="photo--square">
        {item.badge && <span className="rec-card__badge">{item.badge}</span>}
      </Photo>
      <div className="rec-card__info">
        <div className="rec-card__text">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price">{formatRupiah(item.price)}</p>
        </div>
        <QtyControl item={item} size="sm" />
      </div>
    </article>
  );
}
