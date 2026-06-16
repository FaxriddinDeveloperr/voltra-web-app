import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCart } from './store';

export function Logo({ size = 40, wordmark, onDark }: { size?: number; wordmark?: boolean; onDark?: boolean }) {
  const tile = (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.28, flex: '0 0 auto',
        background: onDark ? 'rgba(255,255,255,.10)' : 'var(--card)',
        border: `1.4px solid ${onDark ? 'rgba(255,255,255,.25)' : 'var(--accent-border)'}`,
        boxShadow: onDark ? 'none' : 'var(--shadow-soft)',
        display: 'grid', placeItems: 'center',
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 100 100">
        {/* chap diagonal */}
        <polygon points="4,6 30,6 58,94 40,94" fill="var(--accent)" />
        {/* o'ng yuqori diagonal */}
        <polygon points="96,6 72,6 54,60 68,60" fill="var(--accent)" />
        {/* chaqmoq */}
        <polygon points="62,56 80,56 56,96" fill="var(--accent-deep)" />
      </svg>
    </div>
  );
  if (!wordmark) return tile;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      {tile}
      <span style={{ fontSize: size * 0.5, fontWeight: 800, letterSpacing: 0.5, color: onDark ? '#fff' : 'var(--text)' }}>VOLTRA</span>
    </div>
  );
}

const TABS = [
  { path: '/home', icon: Home, label: 'Asosiy' },
  { path: '/catalog', icon: LayoutGrid, label: 'Katalog' },
  { path: '/cart', icon: ShoppingCart, label: 'Savat' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const loc = useLocation();
  const nav = useNavigate();
  const count = useCart((s) => s.cart?.count ?? 0);
  return (
    <nav
      style={{
        position: 'sticky', bottom: 0, display: 'flex', justifyContent: 'space-around',
        alignItems: 'center', height: 64, background: 'var(--bg)',
        borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map((t) => {
        const active = loc.pathname.startsWith(t.path);
        const Ic = t.icon;
        return (
          <button
            key={t.path}
            onClick={() => nav(t.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: active ? '8px 16px' : '8px 12px',
              borderRadius: 'var(--r-pill)', background: active ? 'var(--accent-tint)' : 'transparent',
              transition: 'all .2s ease-out',
            }}
          >
            <span style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
              <Ic size={22} color={active ? 'var(--text)' : 'var(--text-2)'} fill={active ? 'var(--accent)' : 'none'} strokeWidth={active ? 2 : 1.8} />
              {t.path === '/cart' && count > 0 && (
                <span style={{ position: 'absolute', top: -7, right: -8, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{count}</span>
              )}
            </span>
            {active && <span style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

export function TopBar({ title, back, right }: { title?: string; back?: boolean; right?: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, height: 56, padding: '0 12px', background: 'var(--bg)' }}>
      {back && (
        <button onClick={() => nav(-1)} className="press" style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <h2 style={{ flex: 1, fontSize: 18, fontWeight: 700, textAlign: 'center', paddingRight: right ? 0 : back ? 40 : 0 }}>{title ?? ''}</h2>
      {right}
    </header>
  );
}
