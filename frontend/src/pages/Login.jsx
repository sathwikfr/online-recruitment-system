import { useState, useEffect } from 'react';
import { Loader2, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          localStorage.setItem('token', data.token);
          setAuth(true);
          navigate('/');
        } else {
          setSuccess('Account created! You can now sign in.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        setError(data.message || 'Action failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#f5f5f7' }}>

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #003d73 0%, #0062b8 55%, #0078db 100%)' }}>

        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 80%, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none'
        }} />

        {/* Glow orb */}
        <div style={{
          position: 'absolute', bottom: -100, right: -80,
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Users size={20} color="#fff" strokeWidth={2.2} />
          </div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 19, letterSpacing: '-0.4px' }}>InternRecruit</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 28
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7dd3fc' }} />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px' }}>
              ADMIN PORTAL
            </span>
          </div>

          <h1 style={{
            fontSize: 46, fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-1.5px', color: '#fff', marginBottom: 18
          }}>
            Hire the best<br />
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>interns faster.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.75, maxWidth: 360 }}>
            Manage candidates, schedule interviews, and onboard your new hires — all in one streamlined platform.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 32, marginTop: 48,
            padding: '24px 28px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            width: 'fit-content'
          }}>
            {[
              { value: '2.4k+', label: 'Applicants' },
              { value: '98%', label: 'Satisfaction' },
              { value: '60+', label: 'Companies' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600 }}>
            © 2026 InternRecruit · All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8"
        style={{ background: '#f5f5f7' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#0078db',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={20} color="#fff" strokeWidth={2.2} />
            </div>
            <span style={{ color: '#1d1d1f', fontWeight: 800, fontSize: 18 }}>InternRecruit</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#1d1d1f', fontSize: 30, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>
              {isLogin ? 'Sign in' : 'Create account'}
            </h2>
            <p style={{ color: '#86868b', fontSize: 15, fontWeight: 500 }}>
              {isLogin ? 'Welcome back to InternRecruit.' : 'Join the InternRecruit platform.'}
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 28,
            border: '1px solid #d2d2d7',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '36px 36px 32px'
          }}>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 20, padding: '13px 16px',
                background: '#fff1f1', border: '1px solid #fecaca',
                borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10
              }}>
                <AlertCircle size={16} color="#ef4444" />
                <span style={{ color: '#dc2626', fontSize: 14, fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                marginBottom: 20, padding: '13px 16px',
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10
              }}>
                <CheckCircle size={16} color="#16a34a" />
                <span style={{ color: '#15803d', fontSize: 14, fontWeight: 600 }}>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', color: '#86868b', fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 7 }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@internrecruit.com"
                    className="login-input"
                    style={{
                      width: '100%', padding: '13px 16px', borderRadius: 14,
                      background: '#f5f5f7', border: '1.5px solid #d2d2d7',
                      color: '#1d1d1f', fontSize: 15, outline: 'none',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#0078db';
                      e.target.style.background = '#fff';
                      e.target.style.boxShadow = '0 0 0 4px rgba(0,120,219,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#d2d2d7';
                      e.target.style.background = '#f5f5f7';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', color: '#86868b', fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 7 }}>
                    PASSWORD
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%', padding: '13px 48px 13px 16px', borderRadius: 14,
                        background: '#f5f5f7', border: '1.5px solid #d2d2d7',
                        color: '#1d1d1f', fontSize: 15, outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#0078db';
                        e.target.style.background = '#fff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(0,120,219,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#d2d2d7';
                        e.target.style.background = '#f5f5f7';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#86868b', padding: 0, display: 'flex' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', color: '#86868b', fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', marginBottom: 7 }}>
                      CONFIRM PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%', padding: '13px 48px 13px 16px', borderRadius: 14,
                          background: '#f5f5f7', border: '1.5px solid #d2d2d7',
                          color: '#1d1d1f', fontSize: 15, outline: 'none',
                          boxSizing: 'border-box', fontFamily: 'inherit',
                          transition: 'border-color 0.2s, box-shadow 0.2s'
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = '#0078db';
                          e.target.style.background = '#fff';
                          e.target.style.boxShadow = '0 0 0 4px rgba(0,120,219,0.1)';
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = '#d2d2d7';
                          e.target.style.background = '#f5f5f7';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#86868b', padding: 0, display: 'flex' }}>
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember + Forgot */}
                {isLogin && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#0078db', width: 15, height: 15 }}
                      />
                      <span style={{ color: '#86868b', fontSize: 14, fontWeight: 500 }}>Remember me</span>
                    </label>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#0078db', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    marginTop: 6, width: '100%', padding: '15px',
                    background: isLoading ? '#5baee8' : 'linear-gradient(135deg, #0078db, #0062b8)',
                    border: 'none', borderRadius: 16, color: '#fff',
                    fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 6px 24px rgba(0,120,219,0.3)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    fontFamily: 'inherit'
                  }}
                  onMouseOver={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,120,219,0.4)'; } }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,120,219,0.3)'; }}
                >
                  {isLoading
                    ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    : null
                  }
                  {isLoading
                    ? 'Please wait...'
                    : isLogin ? 'Sign In' : 'Create Account'
                  }
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>
            </form>

            {/* Divider + switch mode */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
              <span style={{ color: '#86868b', fontSize: 14, fontWeight: 500 }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                style={{ background: 'none', border: 'none', color: '#0078db', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                {isLogin ? 'Create yours now.' : 'Sign in.'}
              </button>
            </div>
          </div>

          {/* Demo hint */}
          {isLogin && (
            <div style={{
              marginTop: 20, padding: '13px 18px',
              background: '#fff', border: '1px solid #d2d2d7',
              borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0078db', flexShrink: 0 }} />
              <p style={{ color: '#86868b', fontSize: 13, fontWeight: 500, margin: 0 }}>
                <strong style={{ color: '#1d1d1f' }}>Demo: </strong>
                admin@internrecruit.com / password123
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #c7c7cc; }
      `}</style>
    </div>
  );
}
