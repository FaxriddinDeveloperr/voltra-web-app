import axios from 'axios';

// Same-origin /api/v1 (backend o'sha domendan beradi). Dev'da Vite proxy.
const baseURL = '/api/v1';

export const api = axios.create({ baseURL });

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';
export const tokens = {
  get access() { return localStorage.getItem(ACCESS); },
  get refresh() { return localStorage.getItem(REFRESH); },
  set(a: string, r: string) {
    localStorage.setItem(ACCESS, a);
    localStorage.setItem(REFRESH, r);
  },
  clear() { localStorage.removeItem(ACCESS); localStorage.removeItem(REFRESH); },
};

api.interceptors.request.use((cfg) => {
  const t = tokens.access;
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

let refreshing = false;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (
      err.response?.status === 401 &&
      !orig._retry &&
      !orig.url?.includes('/auth/') &&
      tokens.refresh
    ) {
      orig._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          const res = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken: tokens.refresh,
          });
          tokens.set(res.data.accessToken, res.data.refreshToken);
        } catch {
          tokens.clear();
        } finally {
          refreshing = false;
        }
      }
      orig.headers.Authorization = `Bearer ${tokens.access}`;
      return api(orig);
    }
    return Promise.reject(err);
  },
);

// ── Tiplar ──────────────────────────────────────────────────
export interface Brand { id: string; name: string; logoUrl?: string }
export interface ProductImage { id: string; url: string }
export interface Spec { icon: string; label: string; value: string }
export interface Product {
  id: string; nameUz: string; slug: string;
  price: string; oldPrice?: string; priceUsd?: string; discountPct?: number;
  stock: number; vatIncluded: boolean; descriptionUz?: string;
  shortFeatures: string[]; specs?: Spec[]; images: ProductImage[];
  datasheetUrl?: string; isHot: boolean; isNew: boolean; isBestSeller: boolean;
  isXit: boolean; brand?: Brand;
}
export interface Category { id: string; nameUz: string; imageUrl?: string; children: Category[] }
export interface Banner { id: string; imageUrl: string; title?: string }
export interface ServiceItem { id: string; nameUz: string; isActive: boolean; comingSoon: boolean; hasPowerField: boolean }
export interface Region { id: string; nameUz: string }
export interface City { id: string; nameUz: string }
export interface PickupPoint { id: string; name: string; city: string }
export interface CartLine { id: string; productId: string; quantity: number; product: Product; lineTotal: string }
export interface Cart { items: CartLine[]; count: number; itemsTotal: string; discountTotal: string; grandTotal: string }
export interface Order { id: string; orderNumber: string; status: string; grandTotal: string; createdAt: string; items: { productName: string; price: string; quantity: number }[] }
export interface AppUser { id: string; phone: string; firstName?: string; lastName?: string; middleName?: string }

interface Paged<T> { items: T[]; total: number }

export const Api = {
  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }).then((r) => r.data),
  verifyOtp: (phone: string, code: string) =>
    api.post('/auth/verify-otp', { phone, code }).then((r) => r.data),
  me: () => api.get<AppUser>('/me').then((r) => r.data),
  updateMe: (d: Partial<AppUser>) => api.patch<AppUser>('/me', d).then((r) => r.data),
  deleteMe: () => api.delete('/me'),

  categories: () => api.get<Category[]>('/categories').then((r) => r.data),
  brands: () => api.get<Brand[]>('/brands').then((r) => r.data),
  banners: () => api.get<Banner[]>('/banners').then((r) => r.data),
  products: (p: Record<string, string | number> = {}) =>
    api.get<Paged<Product>>('/products', { params: p }).then((r) => r.data),
  hot: () => api.get<Paged<Product>>('/products/hot').then((r) => r.data.items),
  newest: () => api.get<Paged<Product>>('/products/new').then((r) => r.data.items),
  best: () => api.get<Paged<Product>>('/products/best-sellers').then((r) => r.data.items),
  search: (q: string) => api.get<Paged<Product>>('/products/search', { params: { q } }).then((r) => r.data.items),
  product: (id: string) => api.get<Product>(`/products/${id}`).then((r) => r.data),

  favorites: () => api.get<Product[]>('/favorites').then((r) => r.data),
  addFav: (id: string) => api.post(`/favorites/${id}`),
  removeFav: (id: string) => api.delete(`/favorites/${id}`),

  cart: () => api.get<Cart>('/cart').then((r) => r.data),
  addCart: (productId: string, quantity = 1) => api.post<Cart>('/cart', { productId, quantity }).then((r) => r.data),
  updateCart: (itemId: string, quantity: number) => api.patch<Cart>(`/cart/${itemId}`, { quantity }).then((r) => r.data),
  removeCart: (itemId: string) => api.delete<Cart>(`/cart/${itemId}`).then((r) => r.data),

  pickupPoints: () => api.get<PickupPoint[]>('/pickup-points').then((r) => r.data),
  createOrder: (b: unknown) => api.post<Order>('/orders', b).then((r) => r.data),
  orders: () => api.get<Order[]>('/orders').then((r) => r.data),

  services: () => api.get<ServiceItem[]>('/services').then((r) => r.data),
  createApplication: (b: unknown) => api.post('/applications', b),
  applications: () => api.get('/applications').then((r) => r.data),

  content: (key: string) => api.get(`/content/${key}`).then((r) => r.data),
  regions: () => api.get<Region[]>('/regions').then((r) => r.data),
  cities: (regionId: string) => api.get<City[]>(`/regions/${regionId}/cities`).then((r) => r.data),
};
