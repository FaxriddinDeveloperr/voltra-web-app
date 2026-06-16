import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Api, type Category } from '../api';
import { TopBar } from '../shell';
import { Img, GridSkeleton } from '../components';

export default function Catalog() {
  const nav = useNavigate();
  const [cats, setCats] = useState<Category[] | null>(null);
  useEffect(() => { Api.categories().then(setCats).catch(() => setCats([])); }, []);
  return (
    <div>
      <TopBar title="Katalog" />
      {!cats ? <GridSkeleton /> : (
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {cats.map((c) => (
            <button key={c.id} className="press card" onClick={() => nav(`/products?category=${c.id}&title=${encodeURIComponent(c.nameUz)}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left' }}>
              <span style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flex: '0 0 auto' }}><Img url={c.imageUrl} /></span>
              <span style={{ flex: 1, fontWeight: 600 }}>{c.nameUz}</span>
              <ChevronRight size={20} color="var(--text-2)" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
