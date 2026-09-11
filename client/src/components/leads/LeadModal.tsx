import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ILead, ILeadCreateInput, ILeadUpdateInput, LeadStatus, LeadSource } from '../../types';
import { X, User, Mail, Tag, Globe } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ILeadCreateInput | ILeadUpdateInput) => Promise<void>;
  lead?: ILead | null;
  isLoading?: boolean;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit, lead, isLoading = false }) => {
  const { isDark } = useTheme();
  const isEditing = !!lead;

  const [formData, setFormData] = useState({ name: '', email: '', status: LeadStatus.NEW as LeadStatus, source: LeadSource.WEBSITE as LeadSource });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
    } else {
      setFormData({ name: '', email: '', status: LeadStatus.NEW, source: LeadSource.WEBSITE });
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'At least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Please enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit({ name: formData.name.trim(), email: formData.email.trim(), status: formData.status, source: formData.source });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content" style={{ background: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : 'transparent' }}>
        <div className="modal-header" style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
            {isEditing ? 'Edit Lead' : 'Create New Lead'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px',
            color: isDark ? '#64748b' : '#94a3b8', transition: 'background 0.15s'
          }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" />
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter lead name" className={`form-input ${errors.name ? 'error' : ''}`} id="lead-name-input" />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="form-input-wrapper">
                <Mail className="form-input-icon" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="lead@example.com" className={`form-input ${errors.email ? 'error' : ''}`} id="lead-email-input" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="form-input-wrapper">
                <Tag className="form-input-icon" />
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                  className="form-select" id="lead-status-select">
                  {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Source <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="form-input-wrapper">
                <Globe className="form-input-icon" />
                <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                  className="form-select" id="lead-source-select">
                  {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flex: 1 }} id="lead-submit-button">
              {isLoading ? 'Saving...' : isEditing ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
