import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Zap, ShoppingCart, Download } from 'lucide-react';
import { Api } from '../api';
import { useQuery } from '../useQuery';
import { priceUsd, priceUzs, pricePerWatt } from '../lib';
import { TopBar } from '../shell';
import { Img, Spinner, PriceRow } from '../components';
import { useCart, useFav } from '../store';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const { data: p } = useQuery(id ? `product:${id}` : null, () => Api.product(id));
  const [gi, setGi] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [adding, setAdding] = useState(false);
  const fav = useFav((s) => s.ids.has(id));
  const toggleFav = useFav((s) => s.toggle);
  const addCart = useCart((s) => s.add);

  async function add() {
    setAdding(true);
    try { await addCart(id); nav('/cart'); }
    finally { setAdding(false); }
  }

  if (!p) return (<><TopBar back /><Spinner center /></>);
  const imgs = p.images ?? [];

  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar back right={
        <button onClick={() => toggleFav(id)} className="press" style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}>
          <Heart size={22} fill={fav ? 'var(--danger)' : 'none'} color={fav ? 'var(--danger)' : 'var(--text)'} />
        </button>} />

      <div style={{ aspectRatio: 1, background: '#fff', position: 'relative' }}>
        {imgs.length > 1 ? (
          <>
            <div
              ref={trackRef}
              className="img-track"
              onScroll={(e) => {
                const el = e.currentTarget;
                const i = Math.round(el.scrollLeft / el.clientWidth);
                if (i !== gi) setGi(i);
              }}
              style={{ display: 'flex', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
            >
              {imgs.map((im, i) => (
                <div key={i} style={{ flex: '0 0 100%', width: '100%', height: '100%', scrollSnapAlign: 'center' }}>
                  <Img url={im?.url} fit="contain" />
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>
              {gi + 1} / {imgs.length}
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {imgs.map((_, i) => (
                <span key={i}
                  onClick={() => trackRef.current?.scrollTo({ left: i * trackRef.current.clientWidth, behavior: 'smooth' })}
                  style={{ width: i === gi ? 18 : 7, height: 7, borderRadius: 4, background: i === gi ? 'var(--accent)' : 'rgba(255,255,255,.7)', transition: 'width .2s', cursor: 'pointer' }} />
              ))}
            </div>
          </>
        ) : (
          <Img url={imgs[0]?.url} fit="contain" />
        )}
      </div>

      <div style={{ padding: 16 }}>
        {p.specs && p.specs.length > 0 && (
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 14, marginBottom: 16, boxShadow: 'none' }}>
            {p.specs.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="var(--accent-deep)" />
                <div>
                  <div className="muted" style={{ fontSize: 11 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>{p.nameUz}</h1>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 12 }}>
          <PriceRow p={p} />
          {p.vatIncluded && <span className="muted" style={{ fontSize: 13, paddingBottom: 18 }}>QQS bilan</span>}
        </div>

        {p.shortFeatures?.length > 0 && (
          <ul style={{ marginTop: 16, listStyle: 'none', display: 'grid', gap: 6 }}>
            {p.shortFeatures.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ width: 5, height: 5, borderRadius: 5, background: 'var(--accent-deep)', marginTop: 8, flex: '0 0 auto' }} />
                <span style={{ lineHeight: 1.4 }}>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {p.datasheetUrl && (
          <a className="btn-ghost" href={p.datasheetUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <Download size={18} /> Datasheet'ni yuklab olish
          </a>
        )}
      </div>


      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: 12, display: 'flex', gap: 12, maxWidth: 520, margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <div className="price" style={{ fontSize: 17 }}>{priceUsd(p.priceUsd)}</div>
          <div className="muted" style={{ fontSize: 11 }}>≈ {priceUzs(p.price)}{p.priceUsdPerWatt ? ` · ${pricePerWatt(p.priceUsdPerWatt)}` : ''}</div>
        </div>
        <button className="btn" style={{ flex: 1 }} disabled={adding} onClick={add}>
          {adding ? <span className="spinner" /> : <><ShoppingCart size={18} /> Savatga</>}
        </button>
      </div>
    </div>
  );
}
