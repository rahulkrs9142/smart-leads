// ============ Enums ============
export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
}

// ============ User Types ============
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

// ============ Lead Types ============
export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadCreateInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface ILeadUpdateInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ============ Query Types ============
export interface ILeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

// ============ API Response Types ============
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedData<T> {
  records: T[];
  pagination: IPaginationMeta;
}

// ============ Lead Stats ============
export interface ILeadStats {
  totalLeads: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  recentLeads: ILead[];
}

// ============ Auth Context ============
export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

// ============ Theme Context ============
export interface IThemeContext {
  isDark: boolean;
  toggleTheme: () => void;
}
