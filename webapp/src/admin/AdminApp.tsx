import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, FileText, Image, FolderTree, Tag, Wrench,
  MapPin, ScrollText, Users, RefreshCw, ChevronRight, TrendingUp, Layers, Phone, Send,
} from 'lucide-react';
import { Admin, type AdminStats } from '../api';
import { useAuth } from '../store';
import { ToastHost, AdminHeader, Loader, useToast } from './ui';
import {
  AdminProducts, AdminOrders, AdminApplications, AdminBanners, AdminCategories,
  AdminBrands, AdminServices, AdminPickups, AdminContents, AdminUsers, AdminContacts,
  AdminOrderGroups,
} from './sections';

export default function AdminApp() {
  const isAdmin = useAuth((s) => s.isAdmin);
  const status = useAuth((s) => s.status);
  // adminCheck hali yuklanmagan bo'lishi mumkin — kuting
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 600); return () => clearTimeout(t); }, []);

  if (status !== 'authed') return <Navigate to="/home" replace />;
  if (!isAdmin && !ready) return <Loader />;
  if (!isAdmin) return <Navigate to="/home" replace />;

  return (
    <ToastHost>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="pickups" element={<AdminPickups />} />
        <Route path="order-groups" element={<AdminOrderGroups />} />
        <Route path="content" element={<AdminContents />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ToastHost>
  );
}

const money = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

function Dashboard() {
  const nav = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [syncing, setSyncing] = useState(false);
  useEffect(() => { Admin.stats().then(setStats); }, []);

  const sync = async () => {
    setSyncing(true);
    try { const r = await Admin.priceSync(); toast(`${r.updated} mahsulot yangilandi`); Admin.stats().then(setStats); }
    catch { toast('Sinxron xatosi', true); } finally { setSyncing(false); }
  };

  const tiles = [
    { to: 'products', icon: Package, label: 'Mahsulotlar', count: stats?.counts.products },
    { to: 'orders', icon: ShoppingCart, label: 'Buyurtmalar', count: stats?.counts.orders },
    { to: 'applications', icon: FileText, label: 'Arizalar', count: stats?.counts.applications },
    { to: 'banners', icon: Image, label: 'Bannerlar', count: stats?.counts.banners },
    { to: 'categories', icon: FolderTree, label: 'Kategoriyalar', count: stats?.counts.categories },
    { to: 'brands', icon: Tag, label: 'Brendlar', count: stats?.counts.brands },
    { to: 'services', icon: Wrench, label: 'Xizmatlar', count: stats?.counts.services },
    { to: 'pickups', icon: MapPin, label: 'Olib ketish punktlari' },
    { to: 'order-groups', icon: Send, label: 'Buyurtma guruhlari' },
    { to: 'content', icon: ScrollText, label: 'Kontent sahifalari' },
    { to: 'contacts', icon: Phone, label: 'Aloqa ma\'lumotlari' },
    { to: 'users', icon: Users, label: 'Foydalanuvchilar', count: stats?.counts.users },
  ];

  const newOrders = stats?.ordersByStatus?.NEW ?? 0;

  return (
    <div className="adm">
      <AdminHeader title="Admin panel" right={
        <button className="adm-iconbtn" onClick={sync} disabled={syncing} aria-label="Narxni yangilash">
          <RefreshCw size={18} className={syncing ? 'spin' : ''} style={syncing ? { animation: 'sp .8s linear infinite' } : undefined} />
        </button>
      } />

      {!stats ? <Loader /> : (
        <>
          {/* Revenue banner */}
          <div className="card" style={{ padding: 16, marginBottom: 12, background: 'linear-gradient(135deg, var(--accent-bright), var(--accent))', border: 'none', color: 'var(--on-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, opacity: .8 }}><TrendingUp size={16} /> Umumiy savdo</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', marginTop: 4 }}>{money(stats.revenue)} so'm</div>
          </div>

          {/* Stat grid */}
          <div className="adm-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
            <Stat v={newOrders} l="Yangi buyurtma" icon={<ShoppingCart size={18} color="var(--accent-deep)" />} onClick={() => nav('orders')} />
            <Stat v={stats.counts.products} l="Mahsulot" sub={`${stats.counts.hiddenProducts} yashirin`} icon={<Package size={18} color="var(--accent-deep)" />} onClick={() => nav('products')} />
            <Stat v={stats.counts.applications} l="Ariza" icon={<FileText size={18} color="var(--accent-deep)" />} onClick={() => nav('applications')} />
            <Stat v={stats.counts.users} l="Foydalanuvchi" icon={<Users size={18} color="var(--accent-deep)" />} onClick={() => nav('users')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 2px 10px', color: 'var(--text-2)', fontWeight: 700, fontSize: 13 }}>
            <Layers size={15} /> BOSHQARUV
          </div>
          <div className="adm-grid">
            {tiles.map((t) => (
              <button key={t.to} className="adm-tile" onClick={() => nav(t.to)}>
                <span className="ti"><t.icon size={20} color="var(--accent-deep)" /></span>
                <span className="tt">{t.label}</span>
                {t.count != null && <span className="tc">{t.count}</span>}
                <ChevronRight size={18} color="var(--text-3)" />
              </button>
            ))}
          </div>

          <button className="adm-btn" style={{ marginTop: 16, height: 46 }} onClick={sync} disabled={syncing}>
            <RefreshCw size={16} style={syncing ? { animation: 'sp .8s linear infinite' } : undefined} /> {syncing ? 'Yangilanmoqda…' : 'Narxlarni hozir sinxronlash'}
          </button>
        </>
      )}
    </div>
  );
}

function Stat({ v, l, sub, icon, onClick }: { v: number; l: string; sub?: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button className="adm-stat press" onClick={onClick} style={{ textAlign: 'left' }}>
      <span className="ic">{icon}</span>
      <div className="v">{v}</div>
      <div className="l">{l}{sub ? ` · ${sub}` : ''}</div>
    </button>
  );
}
