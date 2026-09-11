import api from './api';
import {
  IApiResponse,
  IAuthResponse,
  UserRole,
} from '../types';

export const authService = {
  register: async (
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.SALES
  ): Promise<IApiResponse<IAuthResponse>> => {
    const response = await api.post<IApiResponse<IAuthResponse>>('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<IApiResponse<IAuthResponse>> => {
    const response = await api.post<IApiResponse<IAuthResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<IApiResponse> => {
    const response = await api.get<IApiResponse>('/auth/me');
    return response.data;
  },
};
