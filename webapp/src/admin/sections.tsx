import { useEffect, useRef, useState } from 'react';
import {
  Plus, Trash2, Pencil, RefreshCw, Eye, EyeOff, Phone, Package, ImagePlus, X,
} from 'lucide-react';
import {
  Admin, type AdminProduct, type AdminOrder, type AdminApplication,
  type AdminBanner, type AdminCategory, type AdminBrand, type AdminService,
  type AdminPickup, type AdminContent, type AdminUser, type ProductImage,
} from '../api';
import { Select } from '../Select';
import {
  AdminHeader, Modal, Field, Toggle, Pill, Empty, Loader, useToast, useConfirm,
} from './ui';

// ── helpers ──────────────────────────────────────────────────
const uzs = (v: string | number) => Math.round(Number(v)).toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
const usd = (v?: string | number) => (v == null || v === '' ? '—' : '$' + Number(v).toLocaleString('en-US'));
const dt = (s: string) => new Date(s).toLocaleString('uz', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

const ORDER_ST: Record<string, { l: string; tone: string }> = {
  NEW: { l: 'Yangi', tone: 'blue' },
  CONFIRMED: { l: 'Tasdiqlangan', tone: 'amber' },
  PROCESSING: { l: 'Tayyorlanmoqda', tone: 'amber' },
  SHIPPED: { l: "Jo'natilgan", tone: 'amber' },
  DELIVERED: { l: 'Yetkazilgan', tone: 'green' },
  CANCELLED: { l: 'Bekor qilingan', tone: 'red' },
};
const APP_ST: Record<string, { l: string; tone: string }> = {
  NEW: { l: 'Yangi', tone: 'blue' },
  CONTACTED: { l: "Bog'lanildi", tone: 'amber' },
  DONE: { l: 'Bajarildi', tone: 'green' },
  REJECTED: { l: 'Rad etildi', tone: 'red' },
};
const APP_TYPE: Record<string, string> = { SERVICE: 'Xizmat', DEALER: 'Diler', SELLER: 'Sotuvchi', MASTER: 'Usta' };

// ═══════════════ MAHSULOTLAR ═══════════════
export function AdminProducts() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');
  const [edit, setEdit] = useState<AdminProduct | null>(null);
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const toast = useToast();
  const confirm = useConfirm();

  const load = () => {
    setLoading(true);
    Admin.products({ search: q, hidden: filter, limit: 60 })
      .then((r) => setItems(r.items)).finally(() => setLoading(false));
  };
  useEffect(() => { Admin.categories().then(setCats); Admin.brands().then(setBrands); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q, filter]);

  const del = async (p: AdminProduct) => {
    if (!(await confirm(`"${p.nameUz}" o'chirilsinmi?`))) return;
    await Admin.deleteProduct(p.id); toast("O'chirildi"); setItems((s) => s.filter((x) => x.id !== p.id));
  };
  const toggleHide = async (p: AdminProduct) => {
    await Admin.updateProduct(p.id, { hidden: !p.hidden });
    setItems((s) => s.map((x) => (x.id === p.id ? { ...x, hidden: !p.hidden } : x)));
    toast(p.hidden ? 'Userga ko\'rinadi' : 'Yashirildi');
  };

  return (
    <div className="adm">
      <AdminHeader title="Mahsulotlar" />
      <input className="adm-input" placeholder="Qidirish (nomi yoki slug)…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 10 }} />
      <div className="adm-seg">
        {[['', 'Hammasi'], ['false', "Ko'rinadigan"], ['true', 'Yashirilgan']].map(([v, l]) => (
          <button key={v} className={`adm-chip${filter === v ? ' on' : ''}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>
      {loading ? <Loader /> : items.length === 0 ? <Empty text="Mahsulot topilmadi" /> : items.map((p) => (
        <div className="adm-card" key={p.id} style={{ opacity: p.hidden ? 0.62 : 1 }}>
          <div className="hd">
            <span className="ti">{p.nameUz}</span>
            {p.hidden && <Pill tone="gray">Yashirin</Pill>}
          </div>
          <div className="sub">{usd(p.priceUsd)} · {uzs(p.price)}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {p.isHot && <Pill tone="red">Hot</Pill>}
            {p.isNew && <Pill tone="green">Yangi</Pill>}
            {p.isBestSeller && <Pill tone="amber">Best</Pill>}
            {p.isXit && <Pill tone="amber">Xit</Pill>}
            {p.category && <Pill tone="gray">{p.category.nameUz}</Pill>}
          </div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(p)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm" onClick={() => toggleHide(p)}>{p.hidden ? <Eye size={15} /> : <EyeOff size={15} />}</button>
            <button className="adm-btn sm danger" onClick={() => del(p)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      {edit && (
        <ProductModal product={edit} cats={cats} brands={brands}
          onClose={() => setEdit(null)}
          onSaved={(u) => { setItems((s) => s.map((x) => (x.id === u.id ? { ...x, ...u } : x))); setEdit(null); toast('Saqlandi'); }} />
      )}
    </div>
  );
}

function ProductModal({ product, cats, brands, onClose, onSaved }: {
  product: AdminProduct; cats: AdminCategory[]; brands: AdminBrand[];
  onClose: () => void; onSaved: (p: AdminProduct) => void;
}) {
  const [f, setF] = useState({
    nameUz: product.nameUz, priceUsd: product.priceUsd ?? '', price: product.price,
    oldPrice: product.oldPrice ?? '', discountPct: product.discountPct?.toString() ?? '',
    categoryId: product.categoryId ?? '', brandId: product.brandId ?? '',
    descriptionUz: product.descriptionUz ?? '',
    hidden: product.hidden, isHot: product.isHot, isNew: product.isNew, isBestSeller: product.isBestSeller, isXit: product.isXit,
  });
  const [images, setImages] = useState<ProductImage[]>(product.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const url = await Admin.uploadImage(file);
      const img = await Admin.addProductImage(product.id, url);
      setImages((s) => [...s, img]);
      toast('Rasm qo\'shildi');
    } catch { toast('Yuklashda xato', true); } finally { setUploading(false); }
  };
  const delImage = async (img: ProductImage) => {
    setImages((s) => s.filter((x) => x.id !== img.id));
    try { await Admin.removeProductImage(product.id, img.id); } catch { toast('Xato', true); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const u = await Admin.updateProduct(product.id, {
        nameUz: f.nameUz, price: f.price, priceUsd: f.priceUsd || null, oldPrice: f.oldPrice || null,
        discountPct: f.discountPct ? Number(f.discountPct) : null,
        categoryId: f.categoryId || null, brandId: f.brandId || null, descriptionUz: f.descriptionUz,
        hidden: f.hidden, isHot: f.isHot, isNew: f.isNew, isBestSeller: f.isBestSeller, isXit: f.isXit,
      });
      onSaved({ ...(u as AdminProduct), images });
    } catch { toast('Xato yuz berdi', true); } finally { setSaving(false); }
  };

  return (
    <Modal title="Mahsulotni tahrirlash" onClose={onClose}>
      {/* Rasmlar */}
      <div className="adm-field">
        <label>Rasmlar</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {images.map((img) => (
            <div key={img.id} style={{ position: 'relative', width: 76, height: 76 }}>
              <img src={img.url} alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
              <button onClick={() => delImage(img)} aria-label="O'chirish"
                style={{ position: 'absolute', top: -7, right: -7, width: 24, height: 24, borderRadius: '50%', background: 'var(--danger)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,.3)' }}>
                <X size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ width: 76, height: 76, borderRadius: 12, border: '1.5px dashed var(--accent-border)', background: 'var(--accent-tint-soft)', color: 'var(--accent-deep)', display: 'grid', placeItems: 'center', gap: 2 }}>
            {uploading ? <span className="spinner" /> : <><ImagePlus size={22} /><span style={{ fontSize: 10, fontWeight: 700 }}>Qo'shish</span></>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
        </div>
      </div>
      <Field label="Nomi" value={f.nameUz} onChange={(v) => set('nameUz', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Narx (USD)" type="number" value={String(f.priceUsd)} onChange={(v) => set('priceUsd', v)} />
        <Field label="Narx (UZS)" type="number" value={String(f.price)} onChange={(v) => set('price', v)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Eski narx (UZS)" type="number" value={String(f.oldPrice)} onChange={(v) => set('oldPrice', v)} />
        <Field label="Chegirma %" type="number" value={f.discountPct} onChange={(v) => set('discountPct', v)} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <Select label="Kategoriya" value={f.categoryId} onChange={(v) => set('categoryId', v)}
          options={[{ v: '', l: '— yo\'q —' }, ...cats.map((c) => ({ v: c.id, l: c.nameUz }))]} />
      </div>
      <div style={{ marginBottom: 4 }}>
        <Select label="Brend" value={f.brandId} onChange={(v) => set('brandId', v)}
          options={[{ v: '', l: '— yo\'q —' }, ...brands.map((b) => ({ v: b.id, l: b.name }))]} />
      </div>
      <Field label="Tavsif" area value={f.descriptionUz} onChange={(v) => set('descriptionUz', v)} />
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '4px 14px', marginBottom: 14 }}>
        <Toggle label="Userdan yashirish" on={f.hidden} onChange={(v) => set('hidden', v)} />
        <Toggle label="🔥 Hot (qaynoq narx)" on={f.isHot} onChange={(v) => set('isHot', v)} />
        <Toggle label="🆕 Yangi" on={f.isNew} onChange={(v) => set('isNew', v)} />
        <Toggle label="⭐ Ko'p sotilgan" on={f.isBestSeller} onChange={(v) => set('isBestSeller', v)} />
        <Toggle label="🏆 Xit" on={f.isXit} onChange={(v) => set('isXit', v)} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 12px' }}>
        Eslatma: narx va nom Google Sheets'dan har daqiqada yangilanadi. Rasmlar, belgilar va yashirish — admin nazoratida saqlanadi.
      </p>
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>
        {saving ? 'Saqlanmoqda…' : 'Saqlash'}
      </button>
    </Modal>
  );
}

// ═══════════════ BUYURTMALAR ═══════════════
export function AdminOrders() {
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [st, setSt] = useState('');
  const [open, setOpen] = useState<AdminOrder | null>(null);
  const toast = useToast();

  const load = () => { setLoading(true); Admin.orders(st ? { status: st } : {}).then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [st]);

  return (
    <div className="adm">
      <AdminHeader title="Buyurtmalar" />
      <div className="adm-seg">
        <button className={`adm-chip${st === '' ? ' on' : ''}`} onClick={() => setSt('')}>Hammasi</button>
        {Object.entries(ORDER_ST).map(([k, v]) => (
          <button key={k} className={`adm-chip${st === k ? ' on' : ''}`} onClick={() => setSt(k)}>{v.l}</button>
        ))}
      </div>
      {loading ? <Loader /> : items.length === 0 ? <Empty text="Buyurtma yo'q" /> : items.map((o) => (
        <button className="adm-card" key={o.id} style={{ display: 'block', textAlign: 'left', width: '100%' }} onClick={() => setOpen(o)}>
          <div className="hd">
            <span className="ti">{o.orderNumber}</span>
            <Pill tone={ORDER_ST[o.status]?.tone}>{ORDER_ST[o.status]?.l ?? o.status}</Pill>
          </div>
          <div className="sub">{o.fullName ?? o.orgName ?? '—'} · {o.phone}</div>
          <div className="sub" style={{ marginTop: 4, fontWeight: 700, color: 'var(--text)' }}>{uzs(o.grandTotal)} · {o.items.length} ta · {dt(o.createdAt)}</div>
        </button>
      ))}
      {open && <OrderModal order={open} onClose={() => setOpen(null)}
        onStatus={(s) => { setItems((it) => it.map((x) => (x.id === open.id ? { ...x, status: s } : x))); setOpen({ ...open, status: s }); toast('Holat yangilandi'); }}
        onDeleted={() => { setItems((it) => it.filter((x) => x.id !== open.id)); setOpen(null); toast("O'chirildi"); }} />}
    </div>
  );
}

function OrderModal({ order, onClose, onStatus, onDeleted }: {
  order: AdminOrder; onClose: () => void; onStatus: (s: string) => void; onDeleted: () => void;
}) {
  const confirm = useConfirm();
  const change = async (s: string) => { await Admin.orderStatus(order.id, s); onStatus(s); };
  const del = async () => { if (await confirm("Buyurtma o'chirilsinmi?")) { await Admin.deleteOrder(order.id); onDeleted(); } };
  const addr = [order.region, order.city, order.address, order.house, order.landmark].filter(Boolean).join(', ');
  return (
    <Modal title={order.orderNumber} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <Select label="Holat" value={order.status} onChange={change}
          options={Object.entries(ORDER_ST).map(([k, v]) => ({ v: k, l: v.l }))} />
      </div>
      <Row k="Mijoz" v={`${order.fullName ?? order.orgName ?? '—'} (${order.customerType === 'LEGAL' ? 'Yuridik' : 'Jismoniy'})`} />
      {order.inn && <Row k="STIR" v={order.inn} />}
      <Row k="Telefon" v={order.phone} />
      <Row k="Yetkazish" v={order.deliveryType === 'DELIVERY' ? `Yetkazib berish — ${addr}` : 'Olib ketish'} />
      <Row k="O'rnatish" v={order.installation === 'WITH_INSTALL' ? "O'rnatish bilan" : "O'zi o'rnatadi"} />
      <Row k="Sana" v={dt(order.createdAt)} />
      <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0', paddingTop: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Mahsulotlar</div>
        {order.items.map((i, n) => (
          <div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '5px 0', gap: 8 }}>
            <span>{i.productName} × {i.quantity}</span>
            <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{uzs(Number(i.price) * i.quantity)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 800, fontSize: 16 }}>
          <span>Jami</span><span>{uzs(order.grandTotal)}</span>
        </div>
      </div>
      <button className="adm-btn danger" style={{ width: '100%', height: 46 }} onClick={del}><Trash2 size={16} /> Buyurtmani o'chirish</button>
    </Modal>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 14 }}>
    <span style={{ color: 'var(--text-2)', minWidth: 90 }}>{k}</span><span style={{ flex: 1, fontWeight: 500 }}>{v}</span>
  </div>;
}

// ═══════════════ ARIZALAR ═══════════════
export function AdminApplications() {
  const [items, setItems] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<AdminApplication | null>(null);
  const toast = useToast();
  const load = () => { setLoading(true); Admin.applications().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="adm">
      <AdminHeader title="Arizalar" />
      {loading ? <Loader /> : items.length === 0 ? <Empty text="Ariza yo'q" /> : items.map((a) => (
        <button className="adm-card" key={a.id} style={{ display: 'block', textAlign: 'left', width: '100%' }} onClick={() => setOpen(a)}>
          <div className="hd">
            <span className="ti">{a.fullName ?? a.phone}</span>
            <Pill tone="gray">{APP_TYPE[a.type] ?? a.type}</Pill>
            <Pill tone={APP_ST[a.status]?.tone ?? 'gray'}>{APP_ST[a.status]?.l ?? a.status}</Pill>
          </div>
          <div className="sub">{a.phone}{a.region ? ` · ${a.region}` : ''} · {dt(a.createdAt)}</div>
        </button>
      ))}
      {open && <AppModal app={open} onClose={() => setOpen(null)}
        onStatus={(s) => { setItems((it) => it.map((x) => (x.id === open.id ? { ...x, status: s } : x))); setOpen({ ...open, status: s }); toast('Yangilandi'); }}
        onDeleted={() => { setItems((it) => it.filter((x) => x.id !== open.id)); setOpen(null); toast("O'chirildi"); }} />}
    </div>
  );
}
function AppModal({ app, onClose, onStatus, onDeleted }: {
  app: AdminApplication; onClose: () => void; onStatus: (s: string) => void; onDeleted: () => void;
}) {
  const confirm = useConfirm();
  const change = async (s: string) => { await Admin.appStatus(app.id, s); onStatus(s); };
  const del = async () => { if (await confirm("Ariza o'chirilsinmi?")) { await Admin.deleteApp(app.id); onDeleted(); } };
  return (
    <Modal title={`${APP_TYPE[app.type] ?? app.type} arizasi`} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <Select label="Holat" value={APP_ST[app.status] ? app.status : 'NEW'} onChange={change}
          options={Object.entries(APP_ST).map(([k, v]) => ({ v: k, l: v.l }))} />
      </div>
      <Row k="Ism" v={app.fullName ?? '—'} />
      <Row k="Telefon" v={app.phone} />
      {app.region && <Row k="Hudud" v={[app.region, app.city].filter(Boolean).join(', ')} />}
      {app.power && <Row k="Quvvat" v={app.power} />}
      {app.servicePrice && <Row k="1 kVt narxi" v={app.servicePrice} />}
      {app.comment && <Row k="Izoh" v={app.comment} />}
      <Row k="Sana" v={dt(app.createdAt)} />
      <button className="adm-btn danger" style={{ width: '100%', height: 46, marginTop: 12 }} onClick={del}><Trash2 size={16} /> O'chirish</button>
    </Modal>
  );
}

// ═══════════════ BANNERLAR ═══════════════
export function AdminBanners() {
  const [items, setItems] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<AdminBanner | 'new' | null>(null);
  const toast = useToast(); const confirm = useConfirm();
  const load = () => { setLoading(true); Admin.banners().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const del = async (b: AdminBanner) => { if (await confirm("Banner o'chirilsinmi?")) { await Admin.deleteBanner(b.id); setItems((s) => s.filter((x) => x.id !== b.id)); toast("O'chirildi"); } };
  return (
    <div className="adm">
      <AdminHeader title="Bannerlar" />
      {loading ? <Loader /> : items.length === 0 ? <Empty text="Banner yo'q" /> : items.map((b) => (
        <div className="adm-card" key={b.id}>
          {b.imageUrl && <img src={b.imageUrl} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />}
          <div className="hd"><span className="ti">{b.title || '(sarlavhasiz)'}</span>{!b.isActive && <Pill tone="gray">O'chiq</Pill>}</div>
          <div className="sub">Tartib: {b.sortOrder}{b.type ? ` · ${b.type}` : ''}</div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(b)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm danger" onClick={() => del(b)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button className="adm-fab" onClick={() => setEdit('new')}><Plus size={26} /></button>
      {edit && <BannerModal banner={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function BannerModal({ banner, onClose, onSaved }: { banner: AdminBanner | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ imageUrl: banner?.imageUrl ?? '', title: banner?.title ?? '', link: banner?.link ?? '', type: banner?.type ?? '', sortOrder: String(banner?.sortOrder ?? 0), isActive: banner?.isActive ?? true });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!f.imageUrl) { toast('Rasm URL majburiy', true); return; }
    setSaving(true);
    const body = { ...f, sortOrder: Number(f.sortOrder) || 0 };
    try { banner ? await Admin.updateBanner(banner.id, body) : await Admin.createBanner(body); onSaved(); }
    catch { toast('Xato', true); } finally { setSaving(false); }
  };
  return (
    <Modal title={banner ? 'Bannerni tahrirlash' : 'Yangi banner'} onClose={onClose}>
      <Field label="Rasm URL" value={f.imageUrl} onChange={(v) => set('imageUrl', v)} placeholder="https://…" />
      {f.imageUrl && <img src={f.imageUrl} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />}
      <Field label="Sarlavha" value={f.title} onChange={(v) => set('title', v)} />
      <Field label="Havola (link)" value={f.link} onChange={(v) => set('link', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Segment (type)" value={f.type} onChange={(v) => set('type', v)} />
        <Field label="Tartib" type="number" value={f.sortOrder} onChange={(v) => set('sortOrder', v)} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '0 14px', marginBottom: 14 }}>
        <Toggle label="Faol" on={f.isActive} onChange={(v) => set('isActive', v)} />
      </div>
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ KATEGORIYALAR ═══════════════
export function AdminCategories() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<AdminCategory | 'new' | null>(null);
  const toast = useToast(); const confirm = useConfirm();
  const load = () => { setLoading(true); Admin.categories().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const del = async (c: AdminCategory) => { if (await confirm(`"${c.nameUz}" o'chirilsinmi?`)) { try { await Admin.deleteCategory(c.id); setItems((s) => s.filter((x) => x.id !== c.id)); toast("O'chirildi"); } catch { toast('Mahsulotlari bor — o\'chmaydi', true); } } };
  return (
    <div className="adm">
      <AdminHeader title="Kategoriyalar" />
      {loading ? <Loader /> : items.map((c) => (
        <div className="adm-card" key={c.id}>
          <div className="hd"><span className="ti">{c.nameUz}</span><Pill tone="gray">{c._count?.products ?? 0} ta</Pill></div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(c)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm danger" onClick={() => del(c)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button className="adm-fab" onClick={() => setEdit('new')}><Plus size={26} /></button>
      {edit && <CategoryModal cat={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function CategoryModal({ cat, onClose, onSaved }: { cat: AdminCategory | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ nameUz: cat?.nameUz ?? '', nameRu: cat?.nameRu ?? '', imageUrl: cat?.imageUrl ?? '', sortOrder: String(cat?.sortOrder ?? 0) });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!f.nameUz) { toast('Nom majburiy', true); return; }
    setSaving(true); const body = { ...f, sortOrder: Number(f.sortOrder) || 0 };
    try { cat ? await Admin.updateCategory(cat.id, body) : await Admin.createCategory(body); onSaved(); } catch { toast('Xato', true); } finally { setSaving(false); }
  };
  return (
    <Modal title={cat ? 'Kategoriya' : 'Yangi kategoriya'} onClose={onClose}>
      <Field label="Nomi (UZ)" value={f.nameUz} onChange={(v) => set('nameUz', v)} />
      <Field label="Nomi (RU)" value={f.nameRu} onChange={(v) => set('nameRu', v)} />
      <Field label="Rasm URL" value={f.imageUrl} onChange={(v) => set('imageUrl', v)} />
      <Field label="Tartib" type="number" value={f.sortOrder} onChange={(v) => set('sortOrder', v)} />
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ BRENDLAR ═══════════════
export function AdminBrands() {
  const [items, setItems] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<AdminBrand | 'new' | null>(null);
  const toast = useToast(); const confirm = useConfirm();
  const load = () => { setLoading(true); Admin.brands().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const del = async (b: AdminBrand) => { if (await confirm(`"${b.name}" o'chirilsinmi?`)) { try { await Admin.deleteBrand(b.id); setItems((s) => s.filter((x) => x.id !== b.id)); toast("O'chirildi"); } catch { toast('Mahsulotlari bor', true); } } };
  return (
    <div className="adm">
      <AdminHeader title="Brendlar" />
      {loading ? <Loader /> : items.map((b) => (
        <div className="adm-card" key={b.id}>
          <div className="hd">
            {b.logoUrl && <img src={b.logoUrl} alt="" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }} />}
            <span className="ti">{b.name}</span><Pill tone="gray">{b._count?.products ?? 0} ta</Pill>
          </div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(b)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm danger" onClick={() => del(b)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button className="adm-fab" onClick={() => setEdit('new')}><Plus size={26} /></button>
      {edit && <BrandModal brand={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function BrandModal({ brand, onClose, onSaved }: { brand: AdminBrand | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: brand?.name ?? '', logoUrl: brand?.logoUrl ?? '', sortOrder: String(brand?.sortOrder ?? 0) });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!f.name) { toast('Nom majburiy', true); return; }
    setSaving(true); const body = { ...f, sortOrder: Number(f.sortOrder) || 0 };
    try { brand ? await Admin.updateBrand(brand.id, body) : await Admin.createBrand(body); onSaved(); } catch { toast('Xato', true); } finally { setSaving(false); }
  };
  return (
    <Modal title={brand ? 'Brend' : 'Yangi brend'} onClose={onClose}>
      <Field label="Nomi" value={f.name} onChange={(v) => set('name', v)} />
      <Field label="Logo URL" value={f.logoUrl} onChange={(v) => set('logoUrl', v)} />
      <Field label="Tartib" type="number" value={f.sortOrder} onChange={(v) => set('sortOrder', v)} />
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ XIZMATLAR ═══════════════
export function AdminServices() {
  const [items, setItems] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<AdminService | 'new' | null>(null);
  const toast = useToast(); const confirm = useConfirm();
  const load = () => { setLoading(true); Admin.services().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const del = async (s: AdminService) => { if (await confirm(`"${s.nameUz}" o'chirilsinmi?`)) { await Admin.deleteService(s.id); setItems((x) => x.filter((y) => y.id !== s.id)); toast("O'chirildi"); } };
  return (
    <div className="adm">
      <AdminHeader title="Xizmatlar" />
      {loading ? <Loader /> : items.map((s) => (
        <div className="adm-card" key={s.id}>
          <div className="hd">
            <span className="ti">{s.nameUz}</span>
            {s.comingSoon && <Pill tone="amber">Tez kunda</Pill>}
            <Pill tone={s.isActive ? 'green' : 'gray'}>{s.isActive ? 'Faol' : "O'chiq"}</Pill>
          </div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(s)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm danger" onClick={() => del(s)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button className="adm-fab" onClick={() => setEdit('new')}><Plus size={26} /></button>
      {edit && <ServiceModal svc={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function ServiceModal({ svc, onClose, onSaved }: { svc: AdminService | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ nameUz: svc?.nameUz ?? '', nameRu: svc?.nameRu ?? '', sortOrder: String(svc?.sortOrder ?? 0), isActive: svc?.isActive ?? true, comingSoon: svc?.comingSoon ?? false, hasPowerField: svc?.hasPowerField ?? false });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!f.nameUz) { toast('Nom majburiy', true); return; }
    setSaving(true); const body = { ...f, sortOrder: Number(f.sortOrder) || 0 };
    try { svc ? await Admin.updateService(svc.id, body) : await Admin.createService(body); onSaved(); } catch { toast('Xato', true); } finally { setSaving(false); }
  };
  return (
    <Modal title={svc ? 'Xizmat' : 'Yangi xizmat'} onClose={onClose}>
      <Field label="Nomi (UZ)" value={f.nameUz} onChange={(v) => set('nameUz', v)} />
      <Field label="Nomi (RU)" value={f.nameRu} onChange={(v) => set('nameRu', v)} />
      <Field label="Tartib" type="number" value={f.sortOrder} onChange={(v) => set('sortOrder', v)} />
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '0 14px', marginBottom: 14 }}>
        <Toggle label="Faol" on={f.isActive} onChange={(v) => set('isActive', v)} />
        <Toggle label="Tez kunda (Coming soon)" on={f.comingSoon} onChange={(v) => set('comingSoon', v)} />
        <Toggle label="Quvvat maydoni kerak" on={f.hasPowerField} onChange={(v) => set('hasPowerField', v)} />
      </div>
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ PUNKTLAR ═══════════════
export function AdminPickups() {
  const [items, setItems] = useState<AdminPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<AdminPickup | 'new' | null>(null);
  const toast = useToast(); const confirm = useConfirm();
  const load = () => { setLoading(true); Admin.pickupPoints().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const del = async (p: AdminPickup) => { if (await confirm("O'chirilsinmi?")) { await Admin.deletePickup(p.id); setItems((s) => s.filter((x) => x.id !== p.id)); toast("O'chirildi"); } };
  return (
    <div className="adm">
      <AdminHeader title="Olib ketish punktlari" />
      {loading ? <Loader /> : items.map((p) => (
        <div className="adm-card" key={p.id}>
          <div className="hd"><span className="ti">{p.name}</span></div>
          <div className="sub">{p.city}</div>
          <div className="adm-actions">
            <button className="adm-btn" onClick={() => setEdit(p)}><Pencil size={15} /> Tahrirlash</button>
            <button className="adm-btn sm danger" onClick={() => del(p)}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button className="adm-fab" onClick={() => setEdit('new')}><Plus size={26} /></button>
      {edit && <PickupModal p={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function PickupModal({ p, onClose, onSaved }: { p: AdminPickup | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: p?.name ?? '', city: p?.city ?? '', lat: p?.lat?.toString() ?? '', lng: p?.lng?.toString() ?? '' });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const save = async () => {
    if (!f.name || !f.city) { toast('Nom va shahar majburiy', true); return; }
    setSaving(true); const body = { name: f.name, city: f.city, lat: f.lat ? Number(f.lat) : null, lng: f.lng ? Number(f.lng) : null };
    try { p ? await Admin.updatePickup(p.id, body) : await Admin.createPickup(body); onSaved(); } catch { toast('Xato', true); } finally { setSaving(false); }
  };
  return (
    <Modal title={p ? 'Punkt' : 'Yangi punkt'} onClose={onClose}>
      <Field label="Manzil nomi" value={f.name} onChange={(v) => set('name', v)} />
      <Field label="Shahar" value={f.city} onChange={(v) => set('city', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Lat" type="number" value={f.lat} onChange={(v) => set('lat', v)} />
        <Field label="Lng" type="number" value={f.lng} onChange={(v) => set('lng', v)} />
      </div>
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ KONTENT ═══════════════
const CONTENT_KEYS = [{ key: 'about', l: 'Ilova haqida' }, { key: 'offer', l: 'Oferta va shartlar' }];
export function AdminContents() {
  const [items, setItems] = useState<AdminContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<{ key: string; l: string } | null>(null);
  const toast = useToast();
  const load = () => { setLoading(true); Admin.content().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  return (
    <div className="adm">
      <AdminHeader title="Kontent sahifalari" />
      {loading ? <Loader /> : CONTENT_KEYS.map((c) => {
        const ex = items.find((x) => x.key === c.key);
        return (
          <div className="adm-card" key={c.key}>
            <div className="hd"><span className="ti">{c.l}</span><Pill tone={ex ? 'green' : 'gray'}>{ex ? "To'ldirilgan" : "Bo'sh"}</Pill></div>
            {ex?.titleUz && <div className="sub">{ex.titleUz}</div>}
            <div className="adm-actions"><button className="adm-btn" onClick={() => setEdit(c)}><Pencil size={15} /> Tahrirlash</button></div>
          </div>
        );
      })}
      {edit && <ContentModal cfg={edit} current={items.find((x) => x.key === edit.key)} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load(); toast('Saqlandi'); }} />}
    </div>
  );
}
function ContentModal({ cfg, current, onClose, onSaved }: { cfg: { key: string; l: string }; current?: AdminContent; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ titleUz: current?.titleUz ?? '', bodyUz: current?.bodyUz ?? '' });
  const [saving, setSaving] = useState(false); const toast = useToast();
  const save = async () => { setSaving(true); try { await Admin.saveContent(cfg.key, f); onSaved(); } catch { toast('Xato', true); } finally { setSaving(false); } };
  return (
    <Modal title={cfg.l} onClose={onClose}>
      <Field label="Sarlavha" value={f.titleUz} onChange={(v) => setF((s) => ({ ...s, titleUz: v }))} />
      <Field label="Matn" area value={f.bodyUz} onChange={(v) => setF((s) => ({ ...s, bodyUz: v }))} />
      <button className="adm-btn primary" style={{ width: '100%', height: 48 }} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
    </Modal>
  );
}

// ═══════════════ USERLAR ═══════════════
export function AdminUsers() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Admin.users().then(setItems).finally(() => setLoading(false)); }, []);
  return (
    <div className="adm">
      <AdminHeader title="Foydalanuvchilar" />
      {loading ? <Loader /> : items.length === 0 ? <Empty text="User yo'q" /> : items.map((u) => (
        <div className="adm-card" key={u.id}>
          <div className="hd">
            <Phone size={16} color="var(--text-2)" />
            <span className="ti">{u.phone}</span>
            <Pill tone="gray"><Package size={12} /> {u._count?.orders ?? 0}</Pill>
          </div>
          <div className="sub">{[u.lastName, u.firstName].filter(Boolean).join(' ') || '—'} · {dt(u.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}

export { RefreshCw };
