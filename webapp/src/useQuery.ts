import { useEffect, useRef, useState } from 'react';

/**
 * Yengil stale-while-revalidate cache.
 * Orqaga qaytilganda ma'lumot darhol cache'dan ko'rsatiladi (qayta yuklanmaydi),
 * fonда yangilanadi. Bir xil key uchun bir vaqtda bitta so'rov (dedupe).
 */
const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

/** Cache'ni tozalash (yoki prefiks bo'yicha). Yangilangach qayta yuklash uchun. */
export function invalidate(prefix?: string): void {
  if (!prefix) { cache.clear(); return; }
  for (const k of [...cache.keys()]) if (k.startsWith(prefix)) cache.delete(k);
}

export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function useQuery<T>(
  key: string | null,
  fetcher: () => Promise<T>,
): { data: T | undefined; loading: boolean } {
  const [data, setData] = useState<T | undefined>(
    () => (key != null ? (cache.get(key) as T | undefined) : undefined),
  );
  const [loading, setLoading] = useState<boolean>(() => key != null && !cache.has(key));
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (key == null) { setData(undefined); setLoading(false); return; }
    let alive = true;

    if (cache.has(key)) { setData(cache.get(key) as T); setLoading(false); }
    else { setData(undefined); setLoading(true); }

    let p = inflight.get(key) as Promise<T> | undefined;
    if (!p) {
      p = fetcherRef.current();
      inflight.set(key, p);
      void p.finally(() => { if (inflight.get(key) === p) inflight.delete(key); });
    }
    p.then((d) => {
      cache.set(key, d);
      if (alive) { setData(d); setLoading(false); }
    }).catch(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [key]);

  return { data, loading };
}
