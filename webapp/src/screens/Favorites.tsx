import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Api } from '../api';
import { useQuery } from '../useQuery';
import { TopBar } from '../shell';
import { ProductGrid, GridSkeleton, Empty } from '../components';
import { useFav } from '../store';

export default function Favorites() {
  const nav = useNavigate();
  const ids = useFav((s) => s.ids);
  const key = `favorites:${[...ids].sort().join(',')}`;
  const { data: items } = useQuery(key, Api.favorites);
  return (
    <div>
      <TopBar title="Sevimlilar" back />
      {!items ? <GridSkeleton /> : items.length === 0 ? (
        <Empty icon={<Heart size={64} />} title="Sevimlilar bo'sh" subtitle="Yoqqan mahsulotlarni yurakcha bilan belgilang"
          action={<button className="btn" style={{ width: 200 }} onClick={() => nav('/home')}>Mahsulotlar</button>} />
      ) : <ProductGrid items={items} />}
    </div>
  );
}
