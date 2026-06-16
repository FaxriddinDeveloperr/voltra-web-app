import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Grid2x2, Wrench, Handshake, Info } from 'lucide-react';
import { Api, type Banner, type Brand, type Product } from '../api';
import { Logo } from '../shell';
import { Img, ProductCard } from '../components';

function Section({ title, items, filter }: { title: string; items: Product[]; filter: string }) {
  const nav = useNavigate();
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
        <h3 className="section-title">{title}</h3>
        <button onClick={() => nav(`/products?filter=${filter}&title=${encodeURIComponent(title)}`)} style={{ color: 'var(--accent-deep)', fontWeight: 600, fontSize: 14 }}>Hammasi ›</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
        {items.map((p) => <ProductCard key={p.id} p={p} horizontal />)}
      </div>
    </div>
  );
}

const QA = [
  { icon: Grid2x2, label: 'Katalog', to: '/catalog' },
  { icon: Wrench, label: 'Xizmatlar', to: '/services' },
  { icon: Handshake, label: 'Hamkorlik', to: '/partnership' },
  { icon: Info, label: 'Foydali', to: '/content/about' },
];

export default function Home() {
  const nav = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [hot, setHot] = useState<Product[]>([]);
  const [fresh, setFresh] = useState<Product[]>([]);
  const [best, setBest] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [bi, setBi] = useState(0);

  useEffect(() => {
    Api.banners().then(setBanners).catch(() => {});
    Api.hot().then(setHot).catch(() => {});
    Api.newest().then(setFresh).catch(() => {});
    Api.best().then(setBest).catch(() => {});
    Api.brands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setBi((i) => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <div style={{ paddingBottom: 16 }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg)' }}>
        <Logo size={32} wordmark />
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ Ic: Search, to: '/search' }, { Ic: Heart, to: '/favorites' }].map(({ Ic, to }) => (
            <button key={to} onClick={() => nav(to)} className="press" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center' }}>
              <Ic size={20} color="var(--text)" />
            </button>
          ))}
        </div>
      </header>

      {/* Banner */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ position: 'relative', aspectRatio: '2.4', borderRadius: 'var(--r-card)', overflow: 'hidden', background: 'var(--surface)' }}>
          {banners.map((b, i) => (
            <div key={b.id} style={{ position: 'absolute', inset: 0, opacity: i === bi ? 1 : 0, transition: 'opacity .5s' }}>
              <Img url={b.imageUrl} />
            </div>
          ))}
        </div>
        {banners.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            {banners.map((_, i) => <span key={i} style={{ width: i === bi ? 18 : 7, height: 7, borderRadius: 4, background: i === bi ? 'var(--accent)' : 'var(--border)', transition: 'all .25s' }} />)}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 16px 32px' }}>
        {QA.map((q) => {
          const Ic = q.icon;
          return (
            <button key={q.label} onClick={() => nav(q.to)} className="press" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 76 }}>
              <span style={{ width: 64, height: 64, borderRadius: 'var(--r-card)', background: 'var(--accent-tint-soft)', display: 'grid', placeItems: 'center' }}>
                <Ic size={28} color="var(--accent-deep)" />
              </span>
              <span style={{ fontSize: 12 }}>{q.label}</span>
            </button>
          );
        })}
      </div>

      <Section title="Qaynoq narxlar!!" items={hot} filter="hot" />
      <Section title="Yangi mahsulotlar" items={fresh} filter="new" />
      <Section title="Ko'p sotilgan" items={best} filter="best" />

      {brands.length > 0 && (
        <div>
          <h3 className="section-title" style={{ padding: '0 16px' }}>Brendlar</h3>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
            {brands.map((b) => (
              <button key={b.id} onClick={() => nav(`/products?brand=${b.id}&title=${encodeURIComponent(b.name)}`)} className="press card" style={{ flex: '0 0 auto', padding: '10px 16px', fontWeight: 600, fontSize: 13 }}>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
