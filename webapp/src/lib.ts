const NBSP = ' ';

export function groupNum(v: number): string {
  const neg = v < 0;
  const d = Math.abs(Math.round(v)).toString();
  let out = '';
  for (let i = 0; i < d.length; i++) {
    if (i > 0 && (d.length - i) % 3 === 0) out += NBSP;
    out += d[i];
  }
  return (neg ? '-' : '') + out;
}

export function priceUzs(v: number | string, suffix = "so'm"): string {
  return `${groupNum(Number(v))}${NBSP}${suffix}`;
}

export function priceUsd(v: number | string | undefined | null): string {
  if (v == null || v === '') return '';
  const d = Number(v);
  if (d === Math.round(d)) return `$${groupNum(d)}`;
  return `$${groupNum(Math.trunc(d))}.${Math.round((d - Math.trunc(d)) * 100)
    .toString()
    .padStart(2, '0')}`;
}

export function phoneFmt(raw: string): string {
  const dd = raw.replace(/\D/g, '');
  const b = dd.startsWith('998') ? dd.slice(3) : dd;
  const p: string[] = [];
  if (b.length >= 2) p.push(b.slice(0, 2));
  if (b.length >= 5) p.push(b.slice(2, 5));
  if (b.length >= 7) p.push(b.slice(5, 7));
  if (b.length >= 9) p.push(b.slice(7, 9));
  return `+998${p.length ? ' ' + p.join(' ') : ''}`;
}

export function maskInput(raw: string): string {
  const dd = raw.replace(/\D/g, '');
  const b = (dd.startsWith('998') ? dd.slice(3) : dd).slice(0, 9);
  let out = '';
  for (let i = 0; i < b.length; i++) {
    if (i === 2 || i === 5 || i === 7) out += ' ';
    out += b[i];
  }
  return out;
}

export function toE164(input: string): string {
  const dd = input.replace(/\D/g, '');
  const b = dd.startsWith('998') ? dd.slice(3) : dd;
  return `+998${b}`;
}

// Telegram WebApp SDK
interface TG {
  ready(): void; expand(): void;
  colorScheme?: 'light' | 'dark';
  setHeaderColor?(c: string): void; setBackgroundColor?(c: string): void;
  onEvent?(e: string, cb: () => void): void;
  themeParams?: Record<string, string>;
}
export function telegram(): TG | undefined {
  return (window as unknown as { Telegram?: { WebApp?: TG } }).Telegram?.WebApp;
}
