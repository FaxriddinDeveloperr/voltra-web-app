import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../api';
import { maskInput, toE164 } from '../lib';
import { useAuth, useCart, useFav } from '../store';
import { Logo } from '../shell';

export default function Auth({ initialStep = 'phone' }: { initialStep?: 'phone' | 'otp' | 'profile' }) {
  const nav = useNavigate();
  const verify = useAuth((s) => s.verify);
  const completeProfile = useAuth((s) => s.completeProfile);

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>(initialStep);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [last, setLast] = useState('');
  const [first, setFirst] = useState('');
  const [middle, setMiddle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const phoneValid = phone.replace(/\D/g, '').length === 9;

  async function sendOtp() {
    if (!phoneValid) return;
    setLoading(true); setErr('');
    try { await Api.sendOtp(toE164(phone)); setStep('otp'); }
    catch { setErr("Xatolik. Qayta urinib ko'ring."); }
    finally { setLoading(false); }
  }

  async function doVerify(c: string) {
    setLoading(true); setErr('');
    try {
      const st = await verify(toE164(phone), c);
      useCart.getState().load(); useFav.getState().load();
      if (st === 'needsProfile') setStep('profile');
      else nav('/home', { replace: true });
    } catch { setErr("Kod noto'g'ri yoki muddati tugagan"); }
    finally { setLoading(false); }
  }

  async function saveProfile() {
    if (!first.trim() || !last.trim()) return;
    setLoading(true);
    try { await completeProfile(first.trim(), last.trim(), middle.trim()); nav('/home', { replace: true }); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--hero)', borderRadius: '0 0 36px 36px', padding: '60px 24px 40px', boxShadow: 'var(--shadow-soft)' }}>
        <Logo size={50} wordmark />
        <h1 className="screen-title" style={{ fontSize: 30, marginTop: 28, lineHeight: 1.2 }}>
          Quyosh allaqachon<br />ishlayapti.
        </h1>
        <p className="muted" style={{ marginTop: 12, lineHeight: 1.45 }}>
          Quyosh energiyasi yechimlari — tomingiz aktivga aylansin.
        </p>
      </div>

      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {step === 'phone' && (
          <>
            <h3 className="section-title">Telefon raqamingiz</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Tasdiqlash kodi SMS orqali yuboriladi</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, gap: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 600, padding: '0 10px 0 4px' }}>+998</span>
              <input className="input" inputMode="numeric" placeholder="90 123 45 67"
                value={phone} onChange={(e) => setPhone(maskInput(e.target.value))} style={{ fontWeight: 600 }} />
            </div>
            {err && <p style={{ color: 'var(--danger)', marginTop: 8 }}>{err}</p>}
            <div style={{ flex: 1 }} />
            <button className="btn" disabled={!phoneValid || loading} onClick={sendOtp}>
              {loading ? <span className="spinner" /> : 'Davom etish'}
            </button>
            <p className="muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 12 }}>Davom etish orqali shartlarga rozilik bildirasiz</p>
          </>
        )}

        {step === 'otp' && (
          <>
            <h3 className="section-title">Tasdiqlash kodi</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{`+998 ${phone}`} raqamiga yuborilgan kodni kiriting</p>
            <input className="input" inputMode="numeric" placeholder="______" maxLength={6}
              value={code}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setCode(v); setErr(''); if (v.length === 6) doVerify(v); }}
              style={{ marginTop: 16, fontSize: 24, fontWeight: 700, letterSpacing: 8, textAlign: 'center' }} />
            {err && <p style={{ color: 'var(--danger)', marginTop: 8 }}>{err}</p>}
            <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>Dev rejimi: kod 123456</p>
            <div style={{ flex: 1 }} />
            <button className="btn" disabled={code.length < 4 || loading} onClick={() => doVerify(code)}>
              {loading ? <span className="spinner" /> : 'Tasdiqlash'}
            </button>
          </>
        )}

        {step === 'profile' && (
          <>
            <h3 className="section-title">Ma'lumotlaringiz</h3>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Buyurtma uchun ismingizni kiriting</p>
            <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
              <input className="input" placeholder="Familiya" value={last} onChange={(e) => setLast(e.target.value)} />
              <input className="input" placeholder="Ism" value={first} onChange={(e) => setFirst(e.target.value)} />
              <input className="input" placeholder="Sharif" value={middle} onChange={(e) => setMiddle(e.target.value)} />
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn" disabled={!first.trim() || !last.trim() || loading} onClick={saveProfile}>
              {loading ? <span className="spinner" /> : 'Saqlash'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
