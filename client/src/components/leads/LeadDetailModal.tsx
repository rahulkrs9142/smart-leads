import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ILead, LeadStatus } from '../../types';
import { X, Mail, User, Tag, Globe, Clock, Calendar } from 'lucide-react';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ILead | null;
}

const statusClass: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'badge-new',
  [LeadStatus.CONTACTED]: 'badge-contacted',
  [LeadStatus.QUALIFIED]: 'badge-qualified',
  [LeadStatus.LOST]: 'badge-lost',
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead }) => {
  const { isDark } = useTheme();

  if (!isOpen || !lead) return null;

  const assignedTo = typeof lead.assignedTo === 'object' ? lead.assignedTo : null;

  const fields = [
    { icon: User, label: 'Name', value: lead.name },
    { icon: Mail, label: 'Email', value: lead.email },
    { icon: Tag, label: 'Status', value: lead.status, isBadge: true },
    { icon: Globe, label: 'Source', value: lead.source },
    { icon: User, label: 'Assigned To', value: assignedTo?.name || 'N/A' },
    { icon: Calendar, label: 'Created', value: new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
    { icon: Clock, label: 'Updated', value: new Date(lead.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : 'transparent' }}>
        <div className="modal-header" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Lead Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: isDark ? '#64748b' : '#94a3b8' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="modal-body">
          {/* Lead Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #818cf8, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '24px'
            }}>
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{lead.name}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>{lead.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                  borderRadius: '12px', background: isDark ? 'rgba(30,41,59,0.5)' : '#f8fafc'
                }}>
                  <Icon style={{ width: '16px', height: '16px', color: '#94a3b8', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', width: '90px', flexShrink: 0 }}>{field.label}</span>
                  {field.isBadge ? (
                    <span className={`badge ${statusClass[field.value as LeadStatus]}`}>
                      <span className="badge-dot" />
                      {field.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#f8fafc' : '#0f172a' }}>{field.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
