import { useSearchParams } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { Api } from '../api';
import { useQuery } from '../useQuery';
import { TopBar } from '../shell';
import { ProductGrid, GridSkeleton, Empty } from '../components';

export default function Products() {
  const [sp] = useSearchParams();
  const title = sp.get('title') || 'Mahsulotlar';
  const filter = sp.get('filter');
  const category = sp.get('category');
  const brand = sp.get('brand');

  const key = `products:${filter ?? ''}:${category ?? ''}:${brand ?? ''}`;
  const { data: items } = useQuery(key, () => {
    if (filter === 'hot') return Api.hot();
    if (filter === 'new') return Api.newest();
    if (filter === 'best') return Api.best();
    const p: Record<string, string | number> = { limit: 50 };
    if (category) p.category = category;
    if (brand) p.brand = brand;
    return Api.products(p).then((r) => r.items);
  });

  return (
    <div>
      <TopBar title={title} back />
      {!items ? <GridSkeleton /> : items.length === 0 ? (
        <Empty icon={<PackageOpen size={64} />} title="Mahsulot topilmadi" />
      ) : <ProductGrid items={items} />}
    </div>
  );
}
