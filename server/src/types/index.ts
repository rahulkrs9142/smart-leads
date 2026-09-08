import { Request } from 'express';
import { Document, Types } from 'mongoose';

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
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

// ============ Lead Types ============
export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
export interface ILeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

// ============ Response Types ============
export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginatedResponse<T> {
  records: T[];
  pagination: IPaginationMeta;
}

// ============ Auth Types ============
export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// ============ Extended Request ============
export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}
