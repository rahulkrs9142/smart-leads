import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { leadService } from '../services/leadService';
import {
  ILead, ILeadFilters, ILeadCreateInput, ILeadUpdateInput, IPaginationMeta, SortOrder, UserRole,
} from '../types';
import { useDebounce } from '../hooks/useDebounce';
import LeadTable from '../components/leads/LeadTable';
import LeadFilters from '../components/leads/LeadFilters';
import LeadModal from '../components/leads/LeadModal';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';
import { Plus, Download, AlertCircle, Users } from 'lucide-react';

const LeadsPage: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ILeadFilters>({ sort: SortOrder.LATEST, page: 1, limit: 10 });
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 400);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads({ ...filters, search: debouncedSearch || undefined });
      if (response.success && response.data) {
        setLeads(response.data.records);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => { setFilters((prev) => ({ ...prev, page: 1 })); }, [debouncedSearch]);

  const handleFilterChange = (f: Partial<ILeadFilters>) => setFilters((prev) => ({ ...prev, ...f, page: 1 }));
  const handleClearFilters = () => { setFilters({ sort: SortOrder.LATEST, page: 1, limit: 10 }); setSearchValue(''); };
  const handlePageChange = (page: number) => { setFilters((prev) => ({ ...prev, page })); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleCreateLead = async (data: ILeadCreateInput | ILeadUpdateInput) => {
    setIsSubmitting(true);
    try {
      await leadService.createLead(data as ILeadCreateInput);
      toast.success('Lead created successfully!');
      setIsCreateModalOpen(false);
      fetchLeads();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create lead');
    } finally { setIsSubmitting(false); }
  };

  const handleUpdateLead = async (data: ILeadCreateInput | ILeadUpdateInput) => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadService.updateLead(selectedLead._id, data);
      toast.success('Lead updated successfully!');
      setIsEditModalOpen(false); setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update lead');
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted successfully!');
      fetchLeads();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await leadService.exportCSV({ status: filters.status || undefined, source: filters.source || undefined, search: debouncedSearch || undefined });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `leads_export_${Date.now()}.csv`;
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a);
      toast.success('CSV exported successfully!');
    } catch { toast.error('Failed to export CSV'); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>Leads</h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>Manage and track all your leads</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" id="export-csv-button"
            style={{ padding: '10px 18px', fontSize: '13px' }}>
            <Download style={{ width: '16px', height: '16px' }} />
            Export
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary" id="create-lead-button"
            style={{ padding: '10px 22px', fontSize: '13px' }}>
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '24px' }}>
        <LeadFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} searchValue={searchValue} onSearchChange={setSearchValue} />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullPage text="Loading leads..." />
      ) : error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 20px' }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', marginBottom: '16px' }} />
          <p style={{ fontSize: '18px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Error loading leads</p>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>{error}</p>
          <button onClick={fetchLeads} className="btn btn-secondary" style={{ marginTop: '20px' }}>Try Again</button>
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={searchValue || filters.status || filters.source
            ? "No leads match your current filters. Try adjusting your search criteria."
            : "You haven't added any leads yet. Create your first lead to get started."}
          icon={<Users style={{ width: '36px', height: '36px', color: isDark ? '#475569' : '#94a3b8' }} />}
          action={!searchValue && !filters.status && !filters.source ? (
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
              <Plus style={{ width: '16px', height: '16px' }} /> Add Your First Lead
            </button>
          ) : undefined}
        />
      ) : (
        <>
          <LeadTable leads={leads} onEdit={(lead) => { setSelectedLead(lead); setIsEditModalOpen(true); }} onDelete={handleDeleteLead} onView={(lead) => { setSelectedLead(lead); setIsDetailModalOpen(true); }} />
          {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
        </>
      )}

      {/* Modals */}
      <LeadModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateLead} isLoading={isSubmitting} />
      <LeadModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedLead(null); }} onSubmit={handleUpdateLead} lead={selectedLead} isLoading={isSubmitting} />
      <LeadDetailModal isOpen={isDetailModalOpen} onClose={() => { setIsDetailModalOpen(false); setSelectedLead(null); }} lead={selectedLead} />

      {user?.role === UserRole.ADMIN && (
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
          Admin mode: You can view all leads and delete records
        </p>
      )}
    </div>
  );
};

export default LeadsPage;
