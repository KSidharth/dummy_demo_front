
import { apiClient } from './api';
import { AuthTokenDto, ErrorDto } from '../types/dtos';
import { AxiosError } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async loginManager(credentials: LoginCredentials): Promise<AuthTokenDto> {
    try {
      const response = await apiClient.post<AuthTokenDto>('/auth/manager/login', credentials);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to login. Please try again.');
    }
  }

  async loginEmployee(credentials: LoginCredentials): Promise<AuthTokenDto> {
    try {
      const response = await apiClient.post<AuthTokenDto>('/auth/employee/login', credentials);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to login. Please try again.');
    }
  }

  saveAuthData(token: string, role: 'manager' | 'employee', email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
  }

  clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  }

  getAuthData(): { token: string | null; role: string | null; email: string | null } {
    return {
      token: localStorage.getItem('authToken'),
      role: localStorage.getItem('userRole'),
      email: localStorage.getItem('userEmail'),
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserRole(): 'manager' | 'employee' | null {
    const role = localStorage.getItem('userRole');
    return role === 'manager' || role === 'employee' ? role : null;
  }
}

export const authService = new AuthService();
