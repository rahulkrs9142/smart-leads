import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Zap, User, Shield, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const { isDark } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'At least 6 characters required';
    else if (!/\d/.test(password)) newErrors.password = 'Must include at least one number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: isDark ? '#020617' : '#f8fafc' }}>
      {/* Left Panel */}
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
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>SmartLeads</span>
          </div>

          <h1 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Start managing<br />your leads today
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(199,210,254,0.85)', lineHeight: 1.7, maxWidth: '440px' }}>
            Create an account and take control of your sales pipeline with powerful tools and real-time insights.
          </p>

          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Real-time dashboard analytics', 'Advanced lead filtering & search', 'CSV export & role-based access'].map((feat) => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '8px',
                  background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                </div>
                <span style={{ fontSize: '15px', color: 'rgba(199,210,254,0.9)', fontWeight: 500 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right" style={{ background: isDark ? '#020617' : '#ffffff' }}>
        <div className="auth-form-container animate-fadeInUp">
          <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap style={{ width: '24px', height: '24px', color: '#fff' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>SmartLeads</span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
            Create an account
          </h2>
          <p style={{ fontSize: '15px', color: isDark ? '#64748b' : '#94a3b8', marginTop: '8px', marginBottom: '32px' }}>
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className={`form-input ${errors.name ? 'error' : ''}`} id="register-name" />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <Mail className="form-input-icon" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={`form-input ${errors.email ? 'error' : ''}`} id="register-email" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars, include a number"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingRight: '48px' }} id="register-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', padding: '4px' }}>
                  {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="form-input-wrapper">
                <Shield className="form-input-icon" />
                <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
                  className="form-select" id="register-role">
                  <option value={UserRole.SALES}>Sales User</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-full" id="register-submit"
              style={{ marginTop: '8px', height: '50px', fontSize: '15px' }}>
              {isLoading ? 'Creating account...' : (<>Create Account <ArrowRight style={{ width: '18px', height: '18px' }} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: isDark ? '#64748b' : '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
