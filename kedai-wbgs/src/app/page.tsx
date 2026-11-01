'use client';

import { useState } from 'react';
import { CartBar } from '@/components/CartBar';
import { CategoryPills } from '@/components/CategoryPills';
import { Header } from '@/components/Header';
import { MenuRow } from '@/components/MenuRow';
import { OrderSummary } from '@/components/OrderSummary';
import { RecommendCard } from '@/components/RecommendCard';
import {
  DEFAULT_CATEGORY,
  getItemsByCategory,
  getRecommended,
  type Category,
} from '@/lib/menu';

export default function MenuPage() {
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const recommended = getRecommended();
  const items = getItemsByCategory(category);

  return (
    <div className="page page--with-bar">
      <Header />

      <main className="container menu-layout">
        <div className="menu-main">
          <section className="band band--white" aria-labelledby="h-kategori">
            <div className="row row--between">
              <h2 id="h-kategori" className="section-title">
                Kategori Menu
              </h2>
              <span className="hint">Geser untuk explore →</span>
            </div>
            <CategoryPills active={category} onChange={setCategory} />
          </section>

          <section className="band band--cream" aria-labelledby="h-rekomendasi">
            <h2 id="h-rekomendasi" className="section-title">
              Rekomendasi Item
            </h2>
            <div className="rec-grid">
              {recommended.map((item) => (
                <RecommendCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="band band--white" aria-labelledby="h-full">
            <h2 id="h-full" className="section-title">
              Full Menu
            </h2>
            {items.length === 0 ? (
              <p className="empty-box">Belum ada item di kategori ini.</p>
            ) : (
              <div className="menu-grid">
                {items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="menu-aside">
          <OrderSummary />
        </aside>
      </main>

      <CartBar />
    </div>
  );
}
