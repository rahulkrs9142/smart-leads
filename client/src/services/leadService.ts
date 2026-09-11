import api from './api';
import {
  IApiResponse,
  ILead,
  ILeadCreateInput,
  ILeadUpdateInput,
  ILeadFilters,
  IPaginatedData,
  ILeadStats,
} from '../types';

export const leadService = {
  getLeads: async (
    filters: ILeadFilters = {}
  ): Promise<IApiResponse<IPaginatedData<ILead>>> => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await api.get<IApiResponse<IPaginatedData<ILead>>>(
      `/leads?${params.toString()}`
    );
    return response.data;
  },

  getLeadById: async (id: string): Promise<IApiResponse<ILead>> => {
    const response = await api.get<IApiResponse<ILead>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: ILeadCreateInput): Promise<IApiResponse<ILead>> => {
    const response = await api.post<IApiResponse<ILead>>('/leads', data);
    return response.data;
  },

  updateLead: async (
    id: string,
    data: ILeadUpdateInput
  ): Promise<IApiResponse<ILead>> => {
    const response = await api.put<IApiResponse<ILead>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<IApiResponse<{ id: string }>> => {
    const response = await api.delete<IApiResponse<{ id: string }>>(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async (filters: ILeadFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  getStats: async (): Promise<IApiResponse<ILeadStats>> => {
    const response = await api.get<IApiResponse<ILeadStats>>('/leads/stats/overview');
    return response.data;
  },
};
