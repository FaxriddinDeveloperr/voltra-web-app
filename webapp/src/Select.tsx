import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Opt { v: string; l: string }

/** Ant Design uslubidagi yengil, temaga mos select. */
export function Select({
  label, value, onChange, options, placeholder = 'Tanlang', disabled,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.v === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{label}</div>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', height: 52, borderRadius: 'var(--r-input)',
          background: 'var(--surface)', padding: '0 14px',
          border: `1px solid ${open ? 'var(--accent)' : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, fontSize: 16, color: selected ? 'var(--text)' : 'var(--text-3)',
          transition: 'border-color .15s', opacity: disabled ? 0.6 : 1,
          boxShadow: open ? '0 0 0 3px var(--accent-tint)' : 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.l ?? placeholder}
        </span>
        <ChevronDown size={18} color="var(--text-2)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flex: '0 0 auto' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
            background: 'var(--card)', borderRadius: 'var(--r-input)',
            border: '1px solid var(--accent-border)', boxShadow: 'var(--shadow-card)',
            maxHeight: 260, overflowY: 'auto', padding: 6,
            animation: 'selPop .14s ease-out',
          }}
        >
          {options.length === 0 && (
            <div style={{ padding: 12, color: 'var(--text-3)', fontSize: 14 }}>Ro'yxat bo'sh</div>
          )}
          {options.map((o) => {
            const sel = o.v === value;
            return (
              <button
                key={o.v}
                type="button"
                onClick={() => { onChange(o.v); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8, padding: '11px 12px', borderRadius: 10, textAlign: 'left',
                  fontSize: 15, fontWeight: sel ? 600 : 400,
                  color: sel ? 'var(--accent-deep)' : 'var(--text)',
                  background: sel ? 'var(--accent-tint)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = 'var(--surface)'; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.l}</span>
                {sel && <Check size={16} color="var(--accent-deep)" style={{ flex: '0 0 auto' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
