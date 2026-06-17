import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { Api } from '../api';
import { useQuery } from '../useQuery';
import { TopBar } from '../shell';
import { ProductGrid, GridSkeleton, Empty } from '../components';

type Sort = 'default' | 'cheap' | 'expensive';
const SORTS: { v: Sort; l: string }[] = [
  { v: 'default', l: 'Mashhur' },
  { v: 'cheap', l: 'Arzon' },
  { v: 'expensive', l: 'Qimmat' },
];

export default function Products() {
  const [sp] = useSearchParams();
  const title = sp.get('title') || 'Mahsulotlar';
  const filter = sp.get('filter');
  const category = sp.get('category');
  const brand = sp.get('brand');
  const [sort, setSort] = useState<Sort>('default');

  const key = `products:${filter ?? ''}:${category ?? ''}:${brand ?? ''}`;
  const { data: items } = useQuery(key, () => {
    if (filter === 'hot') return Api.hot();
    if (filter === 'new') return Api.newest();
    if (filter === 'best') return Api.best();
    const p: Record<string, string | number> = { limit: 50 };
    if (category) p.category = category;
    if (brand) p.brand = brand;
    return Api.products(p).then((r) => r.items);
  });

  const sorted = useMemo(() => {
    if (!items || sort === 'default') return items;
    const num = (v?: string) => Number(v ?? 0);
    return [...items].sort((a, b) =>
      sort === 'cheap' ? num(a.priceUsd) - num(b.priceUsd) : num(b.priceUsd) - num(a.priceUsd),
    );
  }, [items, sort]);

  return (
    <div>
      <TopBar title={title} back />
      {items && items.length > 1 && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SORTS.map((s) => (
            <button key={s.v} onClick={() => setSort(s.v)}
              style={{
                flex: '0 0 auto', padding: '7px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: '1px solid transparent', transition: 'all .15s',
                background: sort === s.v ? 'var(--accent-tint)' : 'var(--surface)',
                color: sort === s.v ? 'var(--accent-deep)' : 'var(--text-2)',
                borderColor: sort === s.v ? 'var(--accent-border)' : 'transparent',
              }}>
              {s.l}
            </button>
          ))}
        </div>
      )}
      {!sorted ? <GridSkeleton /> : sorted.length === 0 ? (
        <Empty icon={<PackageOpen size={64} />} title="Mahsulot topilmadi" />
      ) : <ProductGrid items={sorted} />}
    </div>
  );
}
