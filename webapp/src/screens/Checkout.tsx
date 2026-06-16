import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, Check } from 'lucide-react';
import { Api, type Region, type City, type PickupPoint } from '../api';
import { priceUsd, priceUzs, toE164, phoneFmt, maskInput } from '../lib';
import { TopBar } from '../shell';
import { Select } from '../Select';
import { useAuth, useCart } from '../store';

type Seg = { v: string; label: string; icon?: React.ReactNode };
function Segmented({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: Seg[] }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 'var(--r-btn)', padding: 4 }}>
      {opts.map((o) => {
        const a = o.v === value;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 12, fontWeight: 600, color: a ? 'var(--text)' : 'var(--text-2)', background: a ? 'var(--bg)' : 'transparent', boxShadow: a ? 'var(--shadow-soft)' : 'none' }}>
            {o.icon}{o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Checkout() {
  const nav = useNavigate();
  const cart = useCart((s) => s.cart);
  const clearCart = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);

  const [delivery, setDelivery] = useState('DELIVERY');
  const [customer, setCustomer] = useState('INDIVIDUAL');
  const [install, setInstall] = useState('SELF');
  const [f, setF] = useState<Record<string, string>>({
    fullName: user && (user.firstName || user.lastName) ? `${user.lastName ?? ''} ${user.firstName ?? ''}`.trim() : '',
    phone: user ? phoneFmt(user.phone).replace('+998 ', '') : '',
  });
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [pickup, setPickup] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState('');

  useEffect(() => { Api.regions().then(setRegions); Api.pickupPoints().then(setPoints); }, []);
  useEffect(() => { if (region) Api.cities(region).then(setCities); else setCities([]); setCity(''); }, [region]);

  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const items = cart?.items ?? [];
  const usd = items.reduce((s, l) => s + Number(l.product.priceUsd ?? 0) * l.quantity, 0);

  const valid = (() => {
    if (f.phone.replace(/\D/g, '').length < 9) return false;
    if (customer === 'INDIVIDUAL' && !f.fullName?.trim()) return false;
    if (customer === 'LEGAL' && (!f.orgName?.trim() || !f.inn?.trim())) return false;
    if (delivery === 'DELIVERY') return !!(region && city && f.address?.trim());
    return !!pickup;
  })();

  async function submit() {
    if (!valid) return;
    setSubmitting(true);
    const body: Record<string, unknown> = {
      deliveryType: delivery, customerType: customer, installation: install,
      phone: toE164(f.phone),
      items: items.map((l) => ({ productId: l.productId, quantity: l.quantity })),
    };
    if (customer === 'INDIVIDUAL') body.fullName = f.fullName;
    else Object.assign(body, { orgName: f.orgName, inn: f.inn, directorName: f.director, bank: f.bank, mfo: f.mfo, oked: f.oked, legalAddress: f.legalAddr });
    if (delivery === 'DELIVERY') Object.assign(body, { region: regions.find((r) => r.id === region)?.nameUz, city: cities.find((c) => c.id === city)?.nameUz, address: f.address, house: f.house, landmark: f.landmark });
    else body.pickupPointId = pickup;
    try {
      const order = await Api.createOrder(body);
      clearCart();
      setDone(order.orderNumber);
    } catch { alert('Buyurtma yaratilmadi'); } finally { setSubmitting(false); }
  }

  if (done) return (
    <div>
      <TopBar title="Buyurtma berish" />
      <div style={{ display: 'grid', placeItems: 'center', padding: 40, gap: 12, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center' }}><Check size={40} color="var(--on-accent)" /></div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Buyurtma qabul qilindi!</div>
        <div className="muted">Raqam: {done}</div>
        <button className="btn" style={{ width: 220, marginTop: 12 }} onClick={() => nav('/orders')}>Buyurtmalarim</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Buyurtma berish" back />
      <div style={{ padding: 16, display: 'grid', gap: 24 }}>
        <Segmented value={delivery} onChange={setDelivery} opts={[{ v: 'DELIVERY', label: 'Yetkazib berish', icon: <Truck size={18} /> }, { v: 'PICKUP', label: 'Olib ketish', icon: <Store size={18} /> }]} />

        <div>
          <h3 className="section-title" style={{ marginBottom: 12 }}>Mijoz</h3>
          <Segmented value={customer} onChange={setCustomer} opts={[{ v: 'INDIVIDUAL', label: 'Jis. shaxs' }, { v: 'LEGAL', label: 'Yur. shaxs' }]} />
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {customer === 'INDIVIDUAL' ? (
              <Field label="F.I.Sh." v={f.fullName} on={(v) => set('fullName', v)} />
            ) : (
              <>
                <Field label="Tashkilot nomi" v={f.orgName} on={(v) => set('orgName', v)} />
                <Field label="STIR" v={f.inn} on={(v) => set('inn', v)} />
                <Field label="Direktor F.I.Sh." v={f.director} on={(v) => set('director', v)} />
                <Field label="Bank" v={f.bank} on={(v) => set('bank', v)} />
                <Field label="MFO" v={f.mfo} on={(v) => set('mfo', v)} />
                <Field label="OKED" v={f.oked} on={(v) => set('oked', v)} />
                <Field label="Yuridik manzil" v={f.legalAddr} on={(v) => set('legalAddr', v)} />
              </>
            )}
            <Field label="Telefon raqamingiz" v={f.phone} prefix="+998 " on={(v) => set('phone', maskInput(v))} />
          </div>
        </div>

        {delivery === 'DELIVERY' ? (
          <div>
            <h3 className="section-title" style={{ marginBottom: 12 }}>Yetkazib berish manzili</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <Select label="Viloyat" value={region} onChange={setRegion} options={regions.map((r) => ({ v: r.id, l: r.nameUz }))} />
              {region && <Select label="Shahar/Tuman" value={city} onChange={setCity} options={cities.map((c) => ({ v: c.id, l: c.nameUz }))} />}
              <Field label="Manzil" v={f.address} on={(v) => set('address', v)} />
              <Field label="Uy" v={f.house} on={(v) => set('house', v)} />
              <Field label="Mo'ljal" v={f.landmark} on={(v) => set('landmark', v)} />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="section-title" style={{ marginBottom: 12 }}>Qabul qilish punkti</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {points.map((p) => <Radio key={p.id} sel={pickup === p.id} title={p.name} sub={p.city} on={() => setPickup(p.id)} />)}
            </div>
          </div>
        )}

        <div>
          <h3 className="section-title" style={{ marginBottom: 12 }}>O'rnatish</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <Radio sel={install === 'SELF'} title="O'zim o'rnatib olaman" on={() => setInstall('SELF')} />
            <Radio sel={install === 'WITH_INSTALL'} title="O'rnatish bilan" on={() => setInstall('WITH_INSTALL')} />
          </div>
        </div>

        <div className="card" style={{ padding: 16, boxShadow: 'none', background: 'var(--surface)', border: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Sizning buyurtmangiz</div>
          <SumRow l={`${cart?.count} ta mahsulot`} r={priceUsd(usd)} />
          <SumRow l="Yetkazib berish" r="$0" />
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
          <SumRow l="Jami:" r={priceUsd(usd)} bold />
          <div className="muted" style={{ textAlign: 'right', fontSize: 12 }}>≈ {priceUzs(cart?.grandTotal ?? 0)}</div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: 12, display: 'flex', gap: 12, alignItems: 'center', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <div className="muted" style={{ fontSize: 13 }}>Jami</div>
          <div className="price" style={{ fontSize: 17 }}>{priceUsd(usd)}</div>
        </div>
        <button className="btn" style={{ flex: 1 }} disabled={!valid || submitting} onClick={submit}>
          {submitting ? <span className="spinner" /> : 'Buyurtma berish'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, v, on, prefix }: { label: string; v?: string; on: (v: string) => void; prefix?: string }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {prefix && <span style={{ fontWeight: 600, padding: '0 8px 0 2px' }}>{prefix}</span>}
        <input className="input" value={v ?? ''} onChange={(e) => on(e.target.value)} />
      </div>
    </div>
  );
}
function Radio({ sel, title, sub, on }: { sel: boolean; title: string; sub?: string; on: () => void }) {
  return (
    <button onClick={on} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 'var(--r-btn)', textAlign: 'left', background: sel ? 'var(--accent-tint)' : 'var(--surface)', border: `1.4px solid ${sel ? 'var(--accent)' : 'transparent'}` }}>
      <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${sel ? 'var(--accent-deep)' : 'var(--text-3)'}`, display: 'grid', placeItems: 'center' }}>
        {sel && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-deep)' }} />}
      </span>
      <span style={{ flex: 1 }}><span style={{ fontWeight: 500 }}>{title}</span>{sub && <div className="muted" style={{ fontSize: 12 }}>{sub}</div>}</span>
    </button>
  );
}
function SumRow({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
    <span style={{ color: bold ? 'var(--text)' : 'var(--text-2)', fontSize: bold ? 18 : 14, fontWeight: bold ? 700 : 400 }}>{l}</span>
    <span style={{ fontSize: bold ? 18 : 14, fontWeight: bold ? 700 : 400 }}>{r}</span>
  </div>;
}
