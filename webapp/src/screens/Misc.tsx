import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShoppingBag, FileText, Wrench, Check } from 'lucide-react';
import { Api, type Region, type City } from '../api';
import { useQuery, invalidate } from '../useQuery';
import { priceUzs, toE164, maskInput, phoneFmt } from '../lib';
import { TopBar } from '../shell';
import { Select } from '../Select';
import { GridSkeleton, Empty, Spinner } from '../components';
import { useAuth } from '../store';

// ── Buyurtmalar ─────────────────────────────────────────────
export function Orders() {
  const { data: list } = useQuery('orders', Api.orders);
  const labels: Record<string, string> = { NEW: 'Yangi', CONFIRMED: 'Tasdiqlangan', PROCESSING: 'Jarayonda', SHIPPED: "Yo'lda", DELIVERED: 'Yetkazilgan', CANCELLED: 'Bekor' };
  return (
    <div><TopBar title="Buyurtmalarim" back />
      {!list ? <GridSkeleton /> : list.length === 0 ? <Empty icon={<ShoppingBag size={64} />} title="Buyurtmalar yo'q" /> : (
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {list.map((o) => (
            <div key={o.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>№ {o.orderNumber}</b>
                <span className="badge" style={{ background: 'var(--accent-tint)', color: 'var(--accent-deep)' }}>{labels[o.status] ?? o.status}</span>
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{o.items.length} ta mahsulot • {new Date(o.createdAt).toLocaleDateString()}</div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="muted">Jami:</span><b>{priceUzs(o.grandTotal)}</b></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Arizalar ────────────────────────────────────────────────
export function Applications() {
  const { data: list } = useQuery('applications', Api.applications as () => Promise<{ id: string; type: string; status: string; createdAt: string }[]>);
  const t: Record<string, string> = { SERVICE: 'Xizmat arizasi', DEALER: 'Diler arizasi', SELLER: 'Savdo vakili', MASTER: 'Usta arizasi' };
  return (
    <div><TopBar title="Arizalarim" back />
      {!list ? <GridSkeleton /> : list.length === 0 ? <Empty icon={<FileText size={64} />} title="Arizalar yo'q :(" /> : (
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          {list.map((a) => (
            <div key={a.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-tint)', display: 'grid', placeItems: 'center' }}><FileText size={20} color="var(--accent-deep)" /></span>
              <div style={{ flex: 1 }}><b>{t[a.type] ?? 'Ariza'}</b><div className="muted" style={{ fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString()}</div></div>
              <span className="badge" style={{ background: 'var(--accent-tint)', color: 'var(--accent-deep)' }}>Yangi</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Xizmatlar ───────────────────────────────────────────────
export function Services() {
  const nav = useNavigate();
  const { data: list } = useQuery('services', Api.services);
  return (
    <div><TopBar title="Xizmatlar" back />
      {!list ? <GridSkeleton /> : (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {list.map((s) => {
            const on = s.isActive && !s.comingSoon;
            return (
              <button key={s.id} disabled={!on} onClick={() => nav(`/services/apply?id=${s.id}&name=${encodeURIComponent(s.nameUz)}&power=${s.hasPowerField ? 1 : 0}`)}
                className={on ? 'press card' : 'card'} style={{ padding: 16, aspectRatio: 1.1, position: 'relative', opacity: on ? 1 : 0.7, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                {s.comingSoon && <span className="badge badge-status" style={{ position: 'absolute', top: 10, left: 10 }}>Tez kunda</span>}
                <div>
                  {s.images?.[0]
                    ? <img src={s.images[0]} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 14, margin: '0 auto' }} />
                    : <Wrench size={36} color="var(--accent-deep)" />}
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>{s.nameUz}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Ariza formasi (xizmat) ──────────────────────────────────
export function ServiceForm() {
  const [sp] = useSearchParams();
  const name = sp.get('name') || 'Xizmat';
  const hasPower = sp.get('power') === '1';
  return <AppForm title={name} type="SERVICE" serviceId={sp.get('id') || undefined} powerField={hasPower} />;
}

// ── Hamkorlik chooser + forma ───────────────────────────────
export function PartnershipMenu() {
  const nav = useNavigate();
  const opts = [
    { t: 'dealer', l: 'Dilerlar uchun' },
    { t: 'seller', l: 'Savdo vakillari uchun' },
    { t: 'master', l: 'Ustalar uchun' },
  ];
  return (
    <div><TopBar title="Hamkorlik" back />
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        {opts.map((o) => (
          <button key={o.t} className="press card" onClick={() => nav(`/partnership/${o.t}`)} style={{ padding: 18, fontWeight: 600, textAlign: 'left' }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}
export function PartnershipForm() {
  const { type = 'dealer' } = useParams();
  const map: Record<string, string> = { dealer: 'Dilerlar uchun', seller: 'Savdo vakillari uchun', master: 'Ustalar uchun' };
  const at: Record<string, string> = { dealer: 'DEALER', seller: 'SELLER', master: 'MASTER' };
  return <AppForm title={map[type]} type={at[type]} priceField={type === 'master'} />;
}

function AppForm({ title, type, serviceId, powerField, priceField }: { title: string; type: string; serviceId?: string; powerField?: boolean; priceField?: boolean }) {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [f, setF] = useState<Record<string, string>>({ fullName: user && (user.firstName || user.lastName) ? `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim() : '', phone: user?.phone ? phoneFmt(user.phone).replace('+998 ', '') : '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { Api.regions().then(setRegions); }, []);
  useEffect(() => { if (region) Api.cities(region).then(setCities); setCity(''); }, [region]);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const valid = f.fullName?.trim() && f.phone.replace(/\D/g, '').length === 9 && region && city && (!powerField || f.power) && (!priceField || f.servicePrice);

  async function submit() {
    setBusy(true);
    try {
      await Api.createApplication({
        type, serviceId, region: regions.find((r) => r.id === region)?.nameUz, city: cities.find((c) => c.id === city)?.nameUz,
        fullName: f.fullName, phone: toE164(f.phone), power: f.power, servicePrice: f.servicePrice, comment: f.comment,
      });
      invalidate('applications');
      setDone(true);
    } finally { setBusy(false); }
  }

  if (done) return (
    <div><TopBar back />
      <div style={{ display: 'grid', placeItems: 'center', padding: 40, gap: 12, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center' }}><Check size={40} color="var(--on-accent)" /></div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Arizangiz qabul qilindi!</div>
        <div className="muted">Tez orada bog'lanamiz</div>
        <button className="btn" style={{ width: 220, marginTop: 12 }} onClick={() => nav('/applications')}>Mening arizalarim</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar back />
      <div style={{ padding: 16 }}>
        <h1 className="screen-title">{title}</h1>
        <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          {powerField && <Select label="Quvvat" value={f.power || ''} onChange={(v) => set('power', v)} options={['3 kW', '5 kW', '8 kW', '10 kW', '15 kW', 'Boshqa'].map((x) => ({ v: x, l: x }))} />}
          <Select label="Viloyat" value={region} onChange={setRegion} options={regions.map((r) => ({ v: r.id, l: r.nameUz }))} />
          {region && <Select label="Shahar/Tuman" value={city} onChange={setCity} options={cities.map((c) => ({ v: c.id, l: c.nameUz }))} />}
          <Inp label="Telefon raqamingiz" v={f.phone} prefix="+998 " on={(v) => set('phone', maskInput(v))} />
          <Inp label="F.I.Sh." v={f.fullName} on={(v) => set('fullName', v)} />
          {priceField && <Inp label="Xizmat narxi (1 kVt uchun)" v={f.servicePrice || ''} on={(v) => set('servicePrice', v)} />}
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Izoh</div>
            <textarea className="input" value={f.comment || ''} onChange={(e) => set('comment', e.target.value)} />
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: 16, maxWidth: 520, margin: '0 auto' }}>
        <button className="btn" disabled={!valid || busy} onClick={submit}>{busy ? <span className="spinner" /> : 'Arizani yuboring'}</button>
      </div>
    </div>
  );
}

// ── Kontent ─────────────────────────────────────────────────
export function Content() {
  const { key = 'about' } = useParams();
  const { data } = useQuery(`content:${key}`, Api.content.bind(null, key) as () => Promise<{ titleUz?: string; bodyUz?: string }>);
  if (!data) return (<><TopBar back /><Spinner center /></>);
  return (
    <div><TopBar title={data.titleUz || (key === 'about' ? 'Biz haqimizda' : 'Oferta')} back />
      <div style={{ padding: 16 }}>
        <h1 className="screen-title">{data.titleUz}</h1>
        <p style={{ marginTop: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{data.bodyUz}</p>
      </div>
    </div>
  );
}

// ── Profil tahrir ───────────────────────────────────────────
export function ProfileEdit() {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const logout = useAuth((s) => s.logout);
  const [last, setLast] = useState(user?.lastName || '');
  const [first, setFirst] = useState(user?.firstName || '');
  const [middle, setMiddle] = useState(user?.middleName || '');
  const [busy, setBusy] = useState(false);
  async function save() { setBusy(true); try { const u = await Api.updateMe({ firstName: first.trim(), lastName: last.trim(), middleName: middle.trim() }); setUser(u); nav(-1); } finally { setBusy(false); } }
  async function del() { if (!confirm("Profil o'chirilsinmi?")) return; try { await Api.deleteMe(); } catch { /* */ } await logout(); nav('/'); }
  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Profilni tahrirlash" back />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--on-accent)"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <Inp label="Familiya" v={last} on={setLast} />
          <Inp label="Ism" v={first} on={setFirst} />
          <Inp label="Sharif" v={middle} on={setMiddle} />
        </div>
        <button onClick={del} style={{ display: 'block', margin: '24px auto 0', color: 'var(--danger)', fontWeight: 600 }}>Profilni o'chirish</button>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: 16, display: 'flex', gap: 12, maxWidth: 520, margin: '0 auto' }}>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={() => nav(-1)}>Bekor qilish</button>
        <button className="btn" style={{ flex: 1 }} disabled={busy} onClick={save}>{busy ? <span className="spinner" /> : 'Saqlash'}</button>
      </div>
    </div>
  );
}

// ── Kichik form elementlari ─────────────────────────────────
function Inp({ label, v, on, prefix }: { label: string; v?: string; on: (v: string) => void; prefix?: string }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>{prefix && <span style={{ fontWeight: 600, padding: '0 8px 0 2px' }}>{prefix}</span>}
        <input className="input" value={v ?? ''} onChange={(e) => on(e.target.value)} /></div>
    </div>
  );
}
