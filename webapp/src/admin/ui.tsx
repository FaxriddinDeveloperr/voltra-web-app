import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, AlertTriangle, X } from 'lucide-react';

// ── Toast ────────────────────────────────────────────────────
type Toast = { id: number; msg: string; err?: boolean };
const ToastCtx = createContext<(msg: string, err?: boolean) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

let _tid = 1;
export function ToastHost({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((msg: string, err?: boolean) => {
    const id = _tid++;
    setItems((s) => [...s, { id, msg, err }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2400);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {items.map((t) => (
        <div key={t.id} className={`adm-toast${t.err ? ' err' : ''}`}>
          {t.err ? <AlertTriangle size={16} /> : <Check size={16} />}
          {t.msg}
        </div>
      ))}
    </ToastCtx.Provider>
  );
}

// ── Header ───────────────────────────────────────────────────
export function AdminHeader({ title, right }: { title: string; right?: ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="adm-top">
      <button className="adm-iconbtn" onClick={() => nav(-1)} aria-label="Orqaga"><ChevronLeft size={20} /></button>
      <h1>{title}</h1>
      {right}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="adm-mask" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ flex: 1, margin: 0 }}>{title}</h3>
          <button className="adm-iconbtn" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Field ────────────────────────────────────────────────────
export function Field({ label, value, onChange, type = 'text', placeholder, area }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; area?: boolean;
}) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {area ? (
        <textarea className="adm-input" value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="adm-input" type={type} value={value} placeholder={placeholder}
          inputMode={type === 'number' ? 'decimal' : undefined}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

// ── Switch ───────────────────────────────────────────────────
export function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="adm-rowtog">
      <span className="lab">{label}</span>
      <button className={`adm-switch${on ? ' on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on} />
    </div>
  );
}

// ── Pill / Empty / Spinner ───────────────────────────────────
export function Pill({ tone = 'gray', children }: { tone?: string; children: ReactNode }) {
  return <span className={`adm-tag ${tone}`}>{children}</span>;
}
export function Empty({ text }: { text: string }) {
  return <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '60px 20px', fontSize: 15 }}>{text}</div>;
}
export function Loader() {
  return <div style={{ display: 'grid', placeItems: 'center', padding: 60 }}><div className="spinner" /></div>;
}

// ── Confirm dialog (promise based) ───────────────────────────
export function useConfirm() {
  return useCallback((msg: string) => Promise.resolve(window.confirm(msg)), []);
}
