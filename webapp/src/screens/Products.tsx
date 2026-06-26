import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageOpen, Search as SearchIcon, X, SearchX } from 'lucide-react';
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

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function Products() {
  const [sp] = useSearchParams();
  const title = sp.get('title') || 'Mahsulotlar';
  const filter = sp.get('filter');
  const category = sp.get('category');
  const brand = sp.get('brand');
  const [sort, setSort] = useState<Sort>('default');
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = prefersReduced();

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

  // Qidiruv ochilganda inputga fokus
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const sorted = useMemo(() => {
    if (!items || sort === 'default') return items;
    const num = (v?: string) => Number(v ?? 0);
    return [...items].sort((a, b) =>
      sort === 'cheap' ? num(a.priceUsd) - num(b.priceUsd) : num(b.priceUsd) - num(a.priceUsd),
    );
  }, [items, sort]);

  // Joriy ro'yxat ichida mahalliy qidiruv (boshqa sahifa ochilmaydi)
  const term = q.trim().toLowerCase();
  const shown = useMemo(() => {
    if (!sorted || !term) return sorted;
    return sorted.filter((p) =>
      p.nameUz.toLowerCase().includes(term) ||
      (p.brand?.name?.toLowerCase().includes(term) ?? false) ||
      p.shortFeatures?.some((f) => f.toLowerCase().includes(term)),
    );
  }, [sorted, term]);

  const toggleSearch = () => {
    setSearchOpen((o) => {
      if (o) setQ('');
      return !o;
    });
  };

  return (
    <div>
      <TopBar
        title={title}
        back
        right={
          <button
            className="press"
            onClick={toggleSearch}
            aria-label={searchOpen ? 'Qidiruvni yopish' : 'Qidirish'}
            style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}
          >
            {searchOpen ? <X size={22} color="var(--text)" /> : <SearchIcon size={22} color="var(--text)" />}
          </button>
        }
      />

      {/* Inline qidiruv maydoni — o'sha sahifada ochiladi */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: searchOpen ? 60 : 0,
          opacity: searchOpen ? 1 : 0,
          transition: reduce ? 'none' : 'max-height .22s ease-out, opacity .22s ease-out',
        }}
      >
        <div style={{ padding: '4px 16px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', borderRadius: 'var(--r-input)', padding: '0 12px', height: 44 }}>
            <SearchIcon size={18} color="var(--text-2)" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Shu ro'yxatdan qidirish..."
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--text)' }}
            />
            {q && (
              <button onClick={() => { setQ(''); inputRef.current?.focus(); }} aria-label="Tozalash">
                <X size={18} color="var(--text-2)" />
              </button>
            )}
          </div>
        </div>
      </div>

      {items && items.length > 1 && !term && (
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

      {term && shown && (
        <div className="muted" style={{ padding: '8px 16px 0', fontSize: 13 }}>{shown.length} ta natija</div>
      )}

      {!shown ? <GridSkeleton /> : shown.length === 0 ? (
        term
          ? <Empty icon={<SearchX size={64} />} title={`"${q.trim()}" topilmadi`} subtitle="Boshqacha nom bilan urinib ko'ring" />
          : <Empty icon={<PackageOpen size={64} />} title="Mahsulot topilmadi" />
      ) : <ProductGrid items={shown} />}
    </div>
  );
}
