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

  adminCheck: () => api.get<{ isAdmin: boolean }>('/admin-check').then((r) => r.data.isAdmin).catch(() => false),
};

// ── Admin tiplari ───────────────────────────────────────────
export interface AdminStats {
  counts: { products: number; hiddenProducts: number; categories: number; brands: number; banners: number; services: number; users: number; orders: number; applications: number };
  ordersByStatus: Record<string, number>;
  appsByStatus: Record<string, number>;
  revenue: number;
  recentOrders: AdminOrder[];
  recentApps: AdminApplication[];
}
export interface AdminProduct extends Product {
  hidden: boolean; createdAt: string; slug: string;
  categoryId?: string; brandId?: string;
  category?: { id: string; nameUz: string };
}
export interface AdminOrder {
  id: string; orderNumber: string; status: string; createdAt: string;
  deliveryType: string; customerType: string;
  fullName?: string; phone: string; orgName?: string; inn?: string;
  region?: string; city?: string; address?: string; house?: string; landmark?: string;
  installation: string; grandTotal: string;
  items: { productName: string; price: string; quantity: number }[];
  user?: AppUser;
}
export interface AdminApplication {
  id: string; type: string; status: string; createdAt: string;
  fullName?: string; phone: string; region?: string; city?: string;
  power?: string; servicePrice?: string; comment?: string; serviceId?: string;
}
export interface AdminBanner { id: string; imageUrl: string; title?: string; link?: string; type?: string; sortOrder: number; isActive: boolean }
export interface AdminCategory { id: string; nameUz: string; nameRu?: string; imageUrl?: string; parentId?: string; sortOrder: number; _count?: { products: number } }
export interface AdminBrand { id: string; name: string; logoUrl?: string; sortOrder: number; _count?: { products: number } }
export interface AdminService { id: string; nameUz: string; nameRu?: string; isActive: boolean; comingSoon: boolean; hasPowerField: boolean; sortOrder: number }
export interface AdminPickup { id: string; name: string; city: string; lat?: number; lng?: number }
export interface AdminContent { id: string; key: string; titleUz?: string; bodyUz?: string }
export interface AdminUser { id: string; phone: string; firstName?: string; lastName?: string; createdAt: string; _count?: { orders: number; applications: number } }

const adm = '/admin';
export const Admin = {
  stats: () => api.get<AdminStats>(`${adm}/stats`).then((r) => r.data),

  products: (p: Record<string, string | number> = {}) =>
    api.get<Paged<AdminProduct>>(`${adm}/products`, { params: p }).then((r) => r.data),
  updateProduct: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/products/${id}`, b).then((r) => r.data),
  deleteProduct: (id: string) => api.delete(`${adm}/products/${id}`).then((r) => r.data),

  orders: (p: Record<string, string> = {}) => api.get<AdminOrder[]>(`${adm}/orders`, { params: p }).then((r) => r.data),
  orderStatus: (id: string, status: string) => api.patch(`${adm}/orders/${id}/status`, { status }).then((r) => r.data),
  deleteOrder: (id: string) => api.delete(`${adm}/orders/${id}`).then((r) => r.data),

  applications: (p: Record<string, string> = {}) => api.get<AdminApplication[]>(`${adm}/applications`, { params: p }).then((r) => r.data),
  appStatus: (id: string, status: string) => api.patch(`${adm}/applications/${id}/status`, { status }).then((r) => r.data),
  deleteApp: (id: string) => api.delete(`${adm}/applications/${id}`).then((r) => r.data),

  banners: () => api.get<AdminBanner[]>(`${adm}/banners`).then((r) => r.data),
  createBanner: (b: Record<string, unknown>) => api.post(`${adm}/banners`, b).then((r) => r.data),
  updateBanner: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/banners/${id}`, b).then((r) => r.data),
  deleteBanner: (id: string) => api.delete(`${adm}/banners/${id}`).then((r) => r.data),

  categories: () => api.get<AdminCategory[]>(`${adm}/categories`).then((r) => r.data),
  createCategory: (b: Record<string, unknown>) => api.post(`${adm}/categories`, b).then((r) => r.data),
  updateCategory: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/categories/${id}`, b).then((r) => r.data),
  deleteCategory: (id: string) => api.delete(`${adm}/categories/${id}`).then((r) => r.data),

  brands: () => api.get<AdminBrand[]>(`${adm}/brands`).then((r) => r.data),
  createBrand: (b: Record<string, unknown>) => api.post(`${adm}/brands`, b).then((r) => r.data),
  updateBrand: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/brands/${id}`, b).then((r) => r.data),
  deleteBrand: (id: string) => api.delete(`${adm}/brands/${id}`).then((r) => r.data),

  services: () => api.get<AdminService[]>(`${adm}/services`).then((r) => r.data),
  createService: (b: Record<string, unknown>) => api.post(`${adm}/services`, b).then((r) => r.data),
  updateService: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/services/${id}`, b).then((r) => r.data),
  deleteService: (id: string) => api.delete(`${adm}/services/${id}`).then((r) => r.data),

  pickupPoints: () => api.get<AdminPickup[]>(`${adm}/pickup-points`).then((r) => r.data),
  createPickup: (b: Record<string, unknown>) => api.post(`${adm}/pickup-points`, b).then((r) => r.data),
  updatePickup: (id: string, b: Record<string, unknown>) => api.patch(`${adm}/pickup-points/${id}`, b).then((r) => r.data),
  deletePickup: (id: string) => api.delete(`${adm}/pickup-points/${id}`).then((r) => r.data),

  content: () => api.get<AdminContent[]>(`${adm}/content`).then((r) => r.data),
  saveContent: (key: string, b: Record<string, unknown>) => api.put(`${adm}/content/${key}`, b).then((r) => r.data),

  users: () => api.get<AdminUser[]>(`${adm}/users`).then((r) => r.data),
  priceSync: () => api.post<{ updated: number }>(`${adm}/price-sync`).then((r) => r.data),
};
