import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isDark ? 'page-bg' : ''}`} style={{ background: isDark ? '#020617' : '#f8fafc' }}>
      {/* Left Panel — Branding */}
      <div className="auth-panel-left">
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap style={{ width: '28px', height: '28px', color: '#fff' }} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              SmartLeads
            </span>
          </div>

          <h1 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Manage your leads<br />with intelligence
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(199,210,254,0.85)', lineHeight: 1.7, maxWidth: '440px' }}>
            Track, organize, and convert your leads with our powerful dashboard. Built for modern sales teams.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '56px' }}>
            {[
              { label: 'Active Leads', value: '2,400+' },
              { label: 'Conversion Rate', value: '68%' },
              { label: 'Time Saved/Week', value: '12hrs' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(199,210,254,0.7)', marginTop: '6px', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="auth-panel-right" style={{ background: isDark ? '#020617' : '#ffffff' }}>
        <div className="auth-form-container animate-fadeInUp">
          {/* Mobile logo */}
          {/* Mobile-only logo — hidden on large screens where left panel shows */}
          <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap style={{ width: '24px', height: '24px', color: '#fff' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              SmartLeads
            </span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '8px', marginBottom: '36px' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <Mail className="form-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  id="login-email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingRight: '48px' }}
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', background: 'none', border: 'none',
                    cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-full" id="login-submit"
              style={{ marginTop: '8px', height: '50px', fontSize: '15px' }}>
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </>
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '28px', fontSize: '14px',
            color: isDark ? '#64748b' : '#94a3b8'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
