import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  const { isDark } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDark ? '#1e293b' : '#f1f5f9', marginBottom: '24px'
      }}>
        {icon || <Inbox style={{ width: '36px', height: '36px', color: isDark ? '#475569' : '#94a3b8' }} />}
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '360px', textAlign: 'center', lineHeight: 1.6, marginBottom: '24px' }}>
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
