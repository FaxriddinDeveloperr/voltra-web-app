import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { telegram } from './lib';
import { useAuth, useCart, useFav, useTheme } from './store';
import { Logo, BottomNav } from './shell';
import Auth from './screens/Auth';
import Home from './screens/Home';
import Catalog from './screens/Catalog';
import Products from './screens/Products';
import ProductDetail from './screens/ProductDetail';
import Search from './screens/Search';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import Favorites from './screens/Favorites';
import Profile from './screens/Profile';
import {
  Orders, Applications, Services, ServiceForm, PartnershipMenu,
  PartnershipForm, Content, ProfileEdit,
} from './screens/Misc';
import AdminApp from './admin/AdminApp';

const TAB_PATHS = ['/home', '/catalog', '/cart', '/profile'];

// Sahifa scroll holatini eslab qoladi: orqaga (POP) qaytilganda o'sha joyga tiklaydi.
const scrollPositions = new Map<string, number>();
function ScrollRestoration() {
  const loc = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const key = loc.key;
    const save = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });

    if (navType === 'POP') {
      // Kontent (ma'lumot) yuklanib, sahifa balandligi yetguncha qayta urinamiz
      const target = scrollPositions.get(key) ?? 0;
      let tries = 0;
      const restore = () => {
        window.scrollTo(0, target);
        if (Math.abs(window.scrollY - target) > 2 && tries < 60) {
          tries++;
          requestAnimationFrame(restore);
        }
      };
      requestAnimationFrame(restore);
    } else {
      window.scrollTo(0, 0);
    }
    return () => { save(); window.removeEventListener('scroll', save); };
  }, [loc.key, navType]);
  return null;
}

export default function App() {
  const status = useAuth((s) => s.status);
  const bootstrap = useAuth((s) => s.bootstrap);
  const applyTheme = useTheme((s) => s.apply);
  const loc = useLocation();
  const navigate = useNavigate();

  // Telegram native "Orqaga" tugmasi — /home dan tashqari hamma joyda
  useEffect(() => {
    const bb = telegram()?.BackButton;
    if (!bb) return;
    const handler = () => navigate(-1);
    if (loc.pathname === '/home' || status !== 'authed') bb.hide();
    else bb.show();
    bb.onClick(handler);
    return () => bb.offClick(handler);
  }, [loc.pathname, status, navigate]);

  useEffect(() => {
    applyTheme();
    bootstrap().then(() => {
      if (useAuth.getState().status === 'authed') {
        useCart.getState().load();
        useFav.getState().load();
      }
    });
  }, [bootstrap, applyTheme]);

  if (status === 'unknown') {
    return (
      <div className="app" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--hero)' }}>
        <div style={{ display: 'grid', placeItems: 'center', gap: 20 }}>
          <Logo size={88} />
          <span style={{ fontWeight: 800, letterSpacing: 4, fontSize: 22 }}>VOLTRA</span>
        </div>
      </div>
    );
  }

  if (status !== 'authed') {
    return <div className="app"><Auth initialStep={status === 'needsProfile' ? 'profile' : 'phone'} /></div>;
  }

  const showNav = TAB_PATHS.includes(loc.pathname);
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollRestoration />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/apply" element={<ServiceForm />} />
          <Route path="/partnership" element={<PartnershipMenu />} />
          <Route path="/partnership/:type" element={<PartnershipForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/content/:key" element={<Content />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}
