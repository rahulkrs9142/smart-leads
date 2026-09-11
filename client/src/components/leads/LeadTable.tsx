import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ILead, LeadStatus, UserRole } from '../../types';
import { Edit3, Trash2, Mail, Clock, Eye } from 'lucide-react';

interface LeadTableProps {
  leads: ILead[];
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  onView: (lead: ILead) => void;
}

const statusBadge: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'badge-new',
  [LeadStatus.CONTACTED]: 'badge-contacted',
  [LeadStatus.QUALIFIED]: 'badge-qualified',
  [LeadStatus.LOST]: 'badge-lost',
};

const sourceBadge: Record<string, string> = {
  Website: 'badge-source-website',
  Instagram: 'badge-source-instagram',
  Referral: 'badge-source-referral',
};

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onView }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const actionBtnStyle = (_hoverColor: string): React.CSSProperties => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
    borderRadius: '8px', color: '#94a3b8', transition: 'all 0.15s',
    display: 'flex', alignItems: 'center',
  });

  return (
    <div className="card" style={{
      padding: 0, overflow: 'hidden',
      background: isDark ? '#0f172a' : '#fff',
      borderColor: isDark ? '#1e293b' : '#e2e8f0'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Status</th>
              <th>Source</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #818cf8, #34d399)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '15px'
                    }}>
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>{lead.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                        <Mail style={{ width: '12px', height: '12px', color: '#94a3b8' }} />
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{lead.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${statusBadge[lead.status]}`}>
                    <span className="badge-dot" />
                    {lead.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${sourceBadge[lead.source] || 'badge-source-website'}`}>
                    {lead.source}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                    <span style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <button onClick={() => onView(lead)} title="View" style={actionBtnStyle('#6366f1')}
                      onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9'; e.currentTarget.style.color = '#6366f1'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                      <Eye style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button onClick={() => onEdit(lead)} title="Edit" style={actionBtnStyle('#f59e0b')}
                      onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9'; e.currentTarget.style.color = '#f59e0b'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                      <Edit3 style={{ width: '16px', height: '16px' }} />
                    </button>
                    {isAdmin && (
                      <button onClick={() => onDelete(lead._id)} title="Delete" style={actionBtnStyle('#ef4444')}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
