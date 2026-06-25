import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Zap, SunMedium } from 'lucide-react';
import type { Product } from './api';
import { priceUsd, priceUzs } from './lib';
import { useFav } from './store';

export function Img({ url, style, fit = 'cover' }: { url?: string; style?: React.CSSProperties; fit?: 'cover' | 'contain' }) {
  const [err, setErr] = useState(false);
  if (!url || err) {
    return (
      <div style={{ background: 'var(--surface-2)', display: 'grid', placeItems: 'center', width: '100%', height: '100%', ...style }}>
        <SunMedium size={32} color="var(--text-3)" />
      </div>
    );
  }
  return <img src={url} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: fit, ...style }} />;
}

export function HeartBtn({ id }: { id: string }) {
  const fav = useFav((s) => s.ids.has(id));
  const toggle = useFav((s) => s.toggle);
  const [pop, setPop] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!fav) { setPop(true); setTimeout(() => setPop(false), 240); } toggle(id); }}
      style={{
        width: 30, height: 30, borderRadius: '50%', background: 'var(--card)',
        display: 'grid', placeItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,.25)',
        transform: pop ? 'scale(1.3)' : 'scale(1)', transition: 'transform .2s ease-out',
      }}
    >
      <Heart size={17} fill={fav ? 'var(--danger)' : 'none'} color={fav ? 'var(--danger)' : 'var(--text-3)'} />
    </button>
  );
}

export function ProductCard({ p, horizontal }: { p: Product; horizontal?: boolean }) {
  const nav = useNavigate();
  return (
    <div
      className="press"
      onClick={() => nav(`/product/${p.id}`)}
      style={{ width: horizontal ? 160 : 'auto', flex: horizontal ? '0 0 auto' : undefined }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--r-card)', background: '#fff', boxShadow: 'var(--shadow-float)', overflow: 'hidden' }}>
        <Img url={p.images?.[0]?.url} fit="contain" />
        {p.isXit && (
          <span className="badge badge-xit" style={{ position: 'absolute', top: 10, left: 10 }}>
            <Zap size={12} /> Xit
          </span>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8 }}><HeartBtn id={p.id} /></div>
      </div>
      <div style={{ height: 38, marginTop: 12, fontSize: 14, fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {p.nameUz}
      </div>
      <div className="price" style={{ fontSize: 16, marginTop: 4 }}>{priceUsd(p.priceUsd)}</div>
    </div>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: 16 }}>
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}

export function PriceRow({ p }: { p: Product }) {
  return (
    <div>
      <div className="price-lg" style={{ color: 'var(--accent-deep)' }}>{priceUsd(p.priceUsd)}</div>
      <div className="muted" style={{ fontSize: 13 }}>≈ {priceUzs(p.price)}</div>
    </div>
  );
}

export function Spinner({ center }: { center?: boolean }) {
  const s = <div className="spinner" />;
  return center ? <div style={{ display: 'grid', placeItems: 'center', padding: 40 }}>{s}</div> : s;
}

export function GridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: 1, borderRadius: 'var(--r-card)' }} />
          <div className="skeleton" style={{ height: 14, marginTop: 10 }} />
          <div className="skeleton" style={{ height: 14, marginTop: 6, width: '60%' }} />
        </div>
      ))}
    </div>
  );
}

export function Empty({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: 40, textAlign: 'center', gap: 8 }}>
      <div style={{ color: 'var(--accent-deep)' }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{title}</div>
      {subtitle && <div className="muted" style={{ fontSize: 14 }}>{subtitle}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
