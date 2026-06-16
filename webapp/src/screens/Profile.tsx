import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, FileText, Headphones, Moon, Info, ScrollText, LogOut, ChevronRight, Sun, SunMoon, Check } from 'lucide-react';
import { phoneFmt } from '../lib';
import { useAuth, useTheme } from '../store';

export default function Profile() {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [sheet, setSheet] = useState(false);

  return (
    <div style={{ paddingBottom: 24 }}>
      <header style={{ padding: '16px', textAlign: 'center' }}><h2 style={{ fontSize: 18, fontWeight: 700 }}>Profil</h2></header>

      <button className="press" onClick={() => nav('/profile/edit')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px 12px', width: '100%', textAlign: 'left' }}>
        <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}><User size={28} color="var(--on-accent)" /></span>
        <span style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user ? phoneFmt(user.phone) : ''}</div>
          <div className="muted" style={{ fontSize: 13 }}>{user && (user.firstName || user.lastName) ? `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim() : "Profilni to'ldiring"}</div>
        </span>
        <ChevronRight color="var(--text-2)" />
      </button>

      <Item icon={<ShoppingBag size={22} color="var(--accent-deep)" />} label="Mening buyurtmalarim" onClick={() => nav('/orders')} />
      <Item icon={<FileText size={22} color="var(--accent-deep)" />} label="Mening arizalarim" onClick={() => nav('/applications')} />
      <Item icon={<Headphones size={22} color="var(--accent-deep)" />} label="Biz bilan bog'lanish" onClick={() => { location.href = 'tel:+998940196141'; }} />

      <Label text="Sozlamalar" />
      <Item icon={<Moon size={22} color="var(--accent-deep)" />} label="Ko'rinish" onClick={() => setSheet(true)} />
      <Item icon={<Info size={22} color="var(--accent-deep)" />} label="Ilova haqida" onClick={() => nav('/content/about')} />
      <Item icon={<ScrollText size={22} color="var(--accent-deep)" />} label="Oferta va shartlar" onClick={() => nav('/content/offer')} />

      <button onClick={() => { if (confirm('Hisobdan chiqasizmi?')) { logout(); nav('/'); } }} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '28px auto', color: 'var(--danger)', fontWeight: 600 }}>
        <LogOut size={20} /> Chiqish
      </button>

      {sheet && <ThemeSheet onClose={() => setSheet(false)} />}
    </div>
  );
}

function ThemeSheet({ onClose }: { onClose: () => void }) {
  const mode = useTheme((s) => s.mode);
  const setMode = useTheme((s) => s.setMode);
  const opts = [
    { v: 'light' as const, label: "Yorug'", icon: <Sun size={20} /> },
    { v: 'dark' as const, label: 'Tungi', icon: <Moon size={20} /> },
    { v: 'system' as const, label: 'Tizim bo\'yicha', icon: <SunMoon size={20} /> },
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 40, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ko'rinish</div>
        {opts.map((o) => (
          <button key={o.v} onClick={() => { setMode(o.v); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 0', color: o.v === mode ? 'var(--accent-deep)' : 'var(--text)' }}>
            {o.icon}<span style={{ flex: 1, textAlign: 'left' }}>{o.label}</span>
            {o.v === mode && <Check size={20} color="var(--accent-deep)" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Item({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '14px 16px', textAlign: 'left' }}>
      {icon}<span style={{ flex: 1 }}>{label}</span><ChevronRight size={20} color="var(--text-2)" />
    </button>
  );
}
function Label({ text }: { text: string }) {
  return <div className="muted" style={{ padding: '16px 16px 6px', fontWeight: 600 }}>{text}</div>;
}
