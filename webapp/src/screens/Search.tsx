import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, SearchX } from 'lucide-react';
import { Api, type Product } from '../api';
import { ProductGrid, GridSkeleton, Empty } from '../components';

export default function Search() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 2) { setItems(null); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try { setItems(await Api.search(q.trim())); } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg)' }}>
        <button onClick={() => nav(-1)} className="press" style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', borderRadius: 'var(--r-input)', padding: '0 12px', height: 44 }}>
          <SearchIcon size={18} color="var(--text-2)" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mahsulot qidirish..."
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--text)' }} />
          {q && <button onClick={() => setQ('')}><X size={18} color="var(--text-2)" /></button>}
        </div>
      </header>
      {loading ? <GridSkeleton /> :
        q.trim().length < 2 ? <Empty icon={<SearchIcon size={64} />} title="Mahsulot qidiring" subtitle="Nomi bo'yicha yozishni boshlang" /> :
        !items || items.length === 0 ? <Empty icon={<SearchX size={64} />} title={`"${q}" topilmadi`} /> :
        <><div className="muted" style={{ padding: '8px 16px 0', fontSize: 13 }}>{items.length} ta natija</div><ProductGrid items={items} /></>}
    </div>
  );
}
