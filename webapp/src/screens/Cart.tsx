import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { priceUsd, priceUzs } from '../lib';
import { TopBar } from '../shell';
import { Img, Empty } from '../components';
import { useCart } from '../store';

export default function Cart() {
  const nav = useNavigate();
  const cart = useCart((s) => s.cart);
  const load = useCart((s) => s.load);
  const update = useCart((s) => s.update);
  const remove = useCart((s) => s.remove);
  useEffect(() => { load(); }, [load]);

  const items = cart?.items ?? [];
  const usdTotal = items.reduce((s, l) => s + Number(l.product.priceUsd ?? 0) * l.quantity, 0);

  if (!items.length) {
    return (
      <div>
        <TopBar title="Savat" back />
        <Empty icon={<ShoppingCart size={64} />} title="Savatingiz bo'sh"
          subtitle="Asosiy sahifadan kerakli mahsulotni toping"
          action={<button className="btn" style={{ width: 200 }} onClick={() => nav('/home')}>Bosh sahifa</button>} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Savat" back />
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        {items.map((l) => (
          <div key={l.id} className="card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flex: '0 0 auto' }}><Img url={l.product.images?.[0]?.url} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.product.nameUz}</div>
                <div className="price" style={{ fontSize: 16, marginTop: 4 }}>{priceUsd(l.product.priceUsd)}</div>
                <div className="muted" style={{ fontSize: 12 }}>Mavjud: {l.product.stock} dona</div>
              </div>
              <button onClick={() => remove(l.id)} className="press" style={{ alignSelf: 'flex-start' }}><Trash2 size={20} color="var(--accent-deep)" /></button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={() => l.quantity > 1 && update(l.id, l.quantity - 1)} style={qbtn}><Minus size={16} color="var(--accent-deep)" /></button>
                <span style={{ fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{l.quantity}</span>
                <button onClick={() => update(l.id, l.quantity + 1)} style={qbtn}><Plus size={16} color="var(--accent-deep)" /></button>
              </div>
              <div className="price" style={{ fontSize: 16 }}>{priceUsd(Number(l.product.priceUsd ?? 0) * l.quantity)}</div>
            </div>
          </div>
        ))}

        <div className="card" style={{ padding: 16, boxShadow: 'none', background: 'var(--surface)', border: 'none' }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Sizning buyurtmangiz</div>
          <Row l={`${cart?.count} ta mahsulot`} r={priceUsd(usdTotal)} />
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
          <Row l="Jami:" r={priceUsd(usdTotal)} bold />
          <div className="muted" style={{ textAlign: 'right', fontSize: 12 }}>≈ {priceUzs(cart?.grandTotal ?? 0)}</div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: 16, maxWidth: 520, margin: '0 auto' }}>
        <button className="btn" onClick={() => nav('/checkout')}>Buyurtma berish</button>
      </div>
    </div>
  );
}

const qbtn: React.CSSProperties = { width: 32, height: 32, borderRadius: '50%', border: '1.4px solid var(--accent-border)', display: 'grid', placeItems: 'center' };

function Row({ l, r, bold }: { l: string; r: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
      <span style={{ color: bold ? 'var(--text)' : 'var(--text-2)', fontSize: bold ? 18 : 14, fontWeight: bold ? 700 : 400 }}>{l}</span>
      <span style={{ fontSize: bold ? 18 : 14, fontWeight: bold ? 700 : 400 }}>{r}</span>
    </div>
  );
}
