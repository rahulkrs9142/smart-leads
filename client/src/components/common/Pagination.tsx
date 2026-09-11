import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IPaginationMeta } from '../../types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  pagination: IPaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { isDark } = useTheme();
  const { currentPage, totalPages, totalRecords, limit, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase: React.CSSProperties = {
    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
    transition: 'all 0.15s', background: 'transparent', fontFamily: 'inherit',
  };

  const startRec = (currentPage - 1) * limit + 1;
  const endRec = Math.min(currentPage * limit, totalRecords);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '24px' }}>
      <p style={{ fontSize: '13px', color: '#94a3b8' }}>
        Showing <strong style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{startRec}</strong> to{' '}
        <strong style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{endRec}</strong> of{' '}
        <strong style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{totalRecords}</strong> results
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onPageChange(1)} disabled={!hasPrevPage} title="First"
          style={{ ...btnBase, color: hasPrevPage ? (isDark ? '#cbd5e1' : '#64748b') : (isDark ? '#334155' : '#e2e8f0'), cursor: hasPrevPage ? 'pointer' : 'not-allowed' }}>
          <ChevronsLeft style={{ width: '16px', height: '16px' }} />
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevPage} title="Previous"
          style={{ ...btnBase, color: hasPrevPage ? (isDark ? '#cbd5e1' : '#64748b') : (isDark ? '#334155' : '#e2e8f0'), cursor: hasPrevPage ? 'pointer' : 'not-allowed' }}>
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
        </button>

        {getPages().map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`e-${idx}`} style={{ ...btnBase, cursor: 'default', color: '#94a3b8' }}>...</span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)}
              style={{
                ...btnBase,
                background: page === currentPage ? (isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff') : 'transparent',
                color: page === currentPage ? (isDark ? '#a5b4fc' : '#4f46e5') : (isDark ? '#94a3b8' : '#64748b'),
                fontWeight: page === currentPage ? 700 : 500,
              }}>
              {page}
            </button>
          )
        )}

        <button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage} title="Next"
          style={{ ...btnBase, color: hasNextPage ? (isDark ? '#cbd5e1' : '#64748b') : (isDark ? '#334155' : '#e2e8f0'), cursor: hasNextPage ? 'pointer' : 'not-allowed' }}>
          <ChevronRight style={{ width: '16px', height: '16px' }} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={!hasNextPage} title="Last"
          style={{ ...btnBase, color: hasNextPage ? (isDark ? '#cbd5e1' : '#64748b') : (isDark ? '#334155' : '#e2e8f0'), cursor: hasNextPage ? 'pointer' : 'not-allowed' }}>
          <ChevronsRight style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
