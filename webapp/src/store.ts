import { create } from 'zustand';
import { Api, api, tokens, type AppUser, type Cart } from './api';
import { tgInitData } from './lib';

// ── Auth ────────────────────────────────────────────────────
type AuthStatus = 'unknown' | 'guest' | 'needsProfile' | 'authed';
interface AuthState {
  status: AuthStatus;
  user?: AppUser;
  isAdmin: boolean;
  bootstrap: () => Promise<void>;
  verify: (phone: string, code: string) => Promise<AuthStatus>;
  completeProfile: (firstName: string, lastName: string, middleName?: string) => Promise<void>;
  setUser: (u: AppUser) => void;
  logout: () => Promise<void>;
}
function statusFor(u: AppUser): AuthStatus {
  return !u.firstName && !u.lastName ? 'needsProfile' : 'authed';
}
export const useAuth = create<AuthState>((set) => ({
  status: 'unknown',
  isAdmin: false,
  bootstrap: async () => {
    const initData = tgInitData();
    // Telegram ichida — JORIY akkaunt manbai. Har ochilganda shu bilan kiramiz,
    // chunki bitta telefonda bir nechta akkaunt localStorage'ni bo'lishadi va
    // eski/boshqa akkaunt tokeni qolib ketgan bo'lishi mumkin.
    if (initData) {
      try {
        const res = await Api.telegramAuth(initData);
        tokens.set(res.accessToken, res.refreshToken);
        set({ status: statusFor(res.user), user: res.user });
        Api.adminCheck().then((isAdmin) => set({ isAdmin }));
      } catch {
        // Tasdiqlab bo'lmadi — noto'g'ri akkauntni ko'rsatmaslik uchun guest
        set({ status: 'guest' });
      }
      return;
    }
    // Telegram tashqarisida (brauzer) — saqlangan token bilan
    if (tokens.access) {
      try {
        const u = await Api.me();
        set({ status: statusFor(u), user: u });
        Api.adminCheck().then((isAdmin) => set({ isAdmin }));
        return;
      } catch { tokens.clear(); }
    }
    set({ status: 'guest' });
  },
  verify: async (phone, code) => {
    const res = await Api.verifyOtp(phone, code);
    tokens.set(res.accessToken, res.refreshToken);
    const st = res.isNewProfile ? 'needsProfile' : statusFor(res.user);
    set({ status: st, user: res.user });
    Api.adminCheck().then((isAdmin) => set({ isAdmin }));
    return st;
  },
  completeProfile: async (firstName, lastName, middleName) => {
    const u = await Api.updateMe({ firstName, lastName, middleName });
    set({ status: 'authed', user: u });
  },
  setUser: (u) => { set({ user: u, status: statusFor(u) }); Api.adminCheck().then((isAdmin) => set({ isAdmin })); },
  logout: async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    tokens.clear();
    set({ status: 'guest', user: undefined, isAdmin: false });
    useCart.getState().clear();
    useFav.getState().clear();
  },
}));

// ── Cart ────────────────────────────────────────────────────
interface CartState {
  cart?: Cart;
  load: () => Promise<void>;
  add: (productId: string, qty?: number) => Promise<void>;
  update: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => void;
  count: () => number;
}
export const useCart = create<CartState>((set, get) => ({
  load: async () => {
    if (useAuth.getState().status === 'guest') return;
    try { set({ cart: await Api.cart() }); } catch { /* ignore */ }
  },
  add: async (productId, qty = 1) => set({ cart: await Api.addCart(productId, qty) }),
  update: async (itemId, qty) => set({ cart: await Api.updateCart(itemId, qty) }),
  remove: async (itemId) => set({ cart: await Api.removeCart(itemId) }),
  clear: () => set({ cart: undefined }),
  count: () => get().cart?.count ?? 0,
}));

// ── Favorites ───────────────────────────────────────────────
interface FavState {
  ids: Set<string>;
  load: () => Promise<void>;
  toggle: (id: string) => Promise<void>;
  has: (id: string) => boolean;
  clear: () => void;
}
export const useFav = create<FavState>((set, get) => ({
  ids: new Set(),
  load: async () => {
    if (useAuth.getState().status === 'guest') return;
    try {
      const list = await Api.favorites();
      set({ ids: new Set(list.map((p) => p.id)) });
    } catch { /* ignore */ }
  },
  toggle: async (id) => {
    const ids = new Set(get().ids);
    if (ids.has(id)) { ids.delete(id); set({ ids }); await Api.removeFav(id); }
    else { ids.add(id); set({ ids }); await Api.addFav(id); }
  },
  has: (id) => get().ids.has(id),
  clear: () => set({ ids: new Set() }),
}));

// ── Theme ───────────────────────────────────────────────────
type Mode = 'light' | 'dark' | 'system';
interface ThemeState { mode: Mode; setMode: (m: Mode) => void; apply: () => void }
function resolve(mode: Mode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}
export const useTheme = create<ThemeState>((set, get) => ({
  mode: (localStorage.getItem('theme_mode') as Mode) || 'light',
  setMode: (m) => { localStorage.setItem('theme_mode', m); set({ mode: m }); get().apply(); },
  apply: () => {
    document.documentElement.dataset.theme = resolve(get().mode) ? 'dark' : 'light';
  },
}));
