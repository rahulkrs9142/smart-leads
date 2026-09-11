import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { leadService } from '../services/leadService';
import { ILeadStats, LeadStatus, LeadSource } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Users, TrendingUp, AlertCircle, UserCheck, Globe, Camera, Share2, BarChart3 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<ILeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await leadService.getStats();
        if (response.success && response.data) setStats(response.data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage text="Loading dashboard..." />;

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', marginBottom: '16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Something went wrong</p>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, iconColor: '#6366f1', bgColor: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff' },
    { label: 'Qualified', value: stats.byStatus[LeadStatus.QUALIFIED] || 0, icon: UserCheck, iconColor: '#10b981', bgColor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5' },
    { label: 'Contacted', value: stats.byStatus[LeadStatus.CONTACTED] || 0, icon: TrendingUp, iconColor: '#f59e0b', bgColor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' },
    { label: 'New', value: stats.byStatus[LeadStatus.NEW] || 0, icon: BarChart3, iconColor: '#3b82f6', bgColor: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff' },
  ];

  const sourceIcons: Record<string, React.ReactNode> = {
    [LeadSource.WEBSITE]: <Globe style={{ width: '20px', height: '20px' }} />,
    [LeadSource.INSTAGRAM]: <Camera style={{ width: '20px', height: '20px' }} />,
    [LeadSource.REFERRAL]: <Share2 style={{ width: '20px', height: '20px' }} />,
  };

  const sourceColors: Record<string, string> = {
    [LeadSource.WEBSITE]: '#8b5cf6',
    [LeadSource.INSTAGRAM]: '#ec4899',
    [LeadSource.REFERRAL]: '#06b6d4',
  };

  const statusBadge = (status: LeadStatus) => {
    const map: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: 'badge-new',
      [LeadStatus.CONTACTED]: 'badge-contacted',
      [LeadStatus.QUALIFIED]: 'badge-qualified',
      [LeadStatus.LOST]: 'badge-lost',
    };
    return map[status] || 'badge-new';
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>
          Overview of your lead management pipeline
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
              <div className="stat-icon-box" style={{ background: card.bgColor }}>
                <Icon style={{ width: '24px', height: '24px', color: card.iconColor }} />
              </div>
              <div className="stat-value" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Source Breakdown */}
        <div className="card" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '24px' }}>
            Leads by Source
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(stats.bySource).map(([source, count]) => {
              const pct = stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0;
              return (
                <div key={source}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: sourceColors[source] || '#94a3b8' }}>{sourceIcons[source]}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>{source}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{count}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>({pct}%)</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.bySource).length === 0 && (
              <p style={{ fontSize: '14px', textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>No source data yet</p>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '24px' }}>
            Recent Leads
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.recentLeads.map((lead) => (
              <div key={lead._id} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px',
                borderRadius: '12px', transition: 'background 0.15s',
                cursor: 'default'
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#1e293b' : '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #818cf8, #34d399)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '15px'
                }}>
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.email}
                  </p>
                </div>
                <span className={`badge ${statusBadge(lead.status)}`}>
                  <span className="badge-dot" />
                  {lead.status}
                </span>
              </div>
            ))}
            {stats.recentLeads.length === 0 && (
              <p style={{ fontSize: '14px', textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>No leads yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
