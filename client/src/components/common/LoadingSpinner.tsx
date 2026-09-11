import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text = 'Loading...', fullPage = false }) => {
  const { isDark } = useTheme();
  const sizeMap = { sm: 20, md: 32, lg: 48 };
  const s = sizeMap[size];

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <div style={{
        width: s, height: s, borderRadius: '50%',
        border: `3px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        borderTopColor: '#6366f1',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && <p style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>{spinner}</div>;
  }

  return spinner;
};

export default LoadingSpinner;
