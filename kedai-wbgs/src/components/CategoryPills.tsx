'use client';

import { CATEGORIES, type Category } from '@/lib/menu';

interface CategoryPillsProps {
  active: Category;
  onChange: (category: Category) => void;
}

export function CategoryPills({ active, onChange }: CategoryPillsProps) {
  return (
    <div className="pills" role="group" aria-label="Kategori menu">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`pill${category === active ? ' pill--active' : ''}`}
          aria-pressed={category === active}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
