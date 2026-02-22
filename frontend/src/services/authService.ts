/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Auth
 */

import api from './api';

export interface Admin {
  id: string;
  nome: string;
  email: string;
  createdAt?: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}

export const authService = {
  login: (email: string, senha: string) =>
    api.post<{ status: string; data: LoginResponse }>('/auth/login', { email, senha }),

  profile: () =>
    api.get<{ status: string; data: Admin }>('/auth/profile'),
};
