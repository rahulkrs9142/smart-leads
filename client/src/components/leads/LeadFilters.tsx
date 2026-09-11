import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ILeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';
import { Search, X } from 'lucide-react';

interface LeadFiltersProps {
  filters: ILeadFilters;
  onFilterChange: (filters: Partial<ILeadFilters>) => void;
  onClearFilters: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters, onFilterChange, onClearFilters, searchValue, onSearchChange,
}) => {
  const { isDark } = useTheme();
  const hasActive = filters.status || filters.source || searchValue;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: hasActive ? '16px' : '0' }}>
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            type="text" value={searchValue} onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="form-input" style={{ paddingLeft: '42px', paddingRight: searchValue ? '40px' : '16px' }}
            id="lead-search-input"
          />
          {searchValue && (
            <button onClick={() => onSearchChange('')} style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px'
            }}>
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          )}
        </div>

        {/* Status */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select value={filters.status || ''} onChange={(e) => onFilterChange({ status: (e.target.value as LeadStatus) || undefined })}
            className="form-select" style={{ paddingLeft: '16px', minWidth: '150px' }} id="filter-status-select">
            <option value="">All Status</option>
            {Object.values(LeadStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Source */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select value={filters.source || ''} onChange={(e) => onFilterChange({ source: (e.target.value as LeadSource) || undefined })}
            className="form-select" style={{ paddingLeft: '16px', minWidth: '150px' }} id="filter-source-select">
            <option value="">All Sources</option>
            {Object.values(LeadSource).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select value={filters.sort || SortOrder.LATEST} onChange={(e) => onFilterChange({ sort: e.target.value as SortOrder })}
            className="form-select" style={{ paddingLeft: '16px', minWidth: '150px' }} id="filter-sort-select">
            <option value={SortOrder.LATEST}>Latest First</option>
            <option value={SortOrder.OLDEST}>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActive && (
        <div className="animate-fadeIn" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Active:</span>
          {filters.status && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
              borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', color: isDark ? '#a5b4fc' : '#4f46e5'
            }}>
              Status: {filters.status}
              <button onClick={() => onFilterChange({ status: undefined })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            </span>
          )}
          {filters.source && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
              borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              background: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', color: isDark ? '#34d399' : '#059669'
            }}>
              Source: {filters.source}
              <button onClick={() => onFilterChange({ source: undefined })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            </span>
          )}
          {searchValue && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px',
              borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              background: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb', color: isDark ? '#fbbf24' : '#d97706'
            }}>
              Search: "{searchValue}"
              <button onClick={() => onSearchChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                <X style={{ width: '12px', height: '12px' }} />
              </button>
            </span>
          )}
          <button onClick={onClearFilters} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: 600, color: '#ef4444', marginLeft: '4px', padding: '4px 8px'
          }}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadFilters;
