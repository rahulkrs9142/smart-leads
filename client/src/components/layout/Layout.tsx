import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Moon, Sun, Menu, X, Shield, Zap } from 'lucide-react';
import { UserRole } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isDark ? '#020617' : '#f8fafc' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 39 }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{ background: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
        {/* Logo */}
        <div className="sidebar-logo" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>
            <Zap style={{ width: '22px', height: '22px', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
            Smart<span className="gradient-text">Leads</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="mobile-menu-btn"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isDark ? '#64748b' : '#94a3b8' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? 'active' : ''}`}>
                <Icon style={{ width: '20px', height: '20px' }} />
                <span>{item.label}</span>
                {active && (
                  <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="user-card" style={{ background: isDark ? '#1e293b' : '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #818cf8, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '16px'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <Shield style={{ width: '12px', height: '12px', color: '#6366f1' }} />
                <span style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8', textTransform: 'capitalize' }}>
                  {user?.role === UserRole.ADMIN ? 'Admin' : 'Sales User'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button onClick={toggleTheme} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: isDark ? '#334155' : '#ffffff', color: isDark ? '#cbd5e1' : '#64748b',
              boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              {isDark ? <Sun style={{ width: '14px', height: '14px' }} /> : <Moon style={{ width: '14px', height: '14px' }} />}
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button onClick={handleLogout} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: 'rgba(239,68,68,0.08)', color: '#ef4444'
            }}>
              <LogOut style={{ width: '14px', height: '14px' }} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar" style={{
          background: isDark ? 'rgba(2,6,23,0.85)' : 'rgba(255,255,255,0.85)',
          borderColor: isDark ? '#1e293b' : '#e2e8f0'
        }}>
          <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: isDark ? '#94a3b8' : '#64748b' }}>
            <Menu style={{ width: '22px', height: '22px' }} />
          </button>
          <div style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 500, color: isDark ? '#64748b' : '#94a3b8' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content animate-fadeInUp">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
