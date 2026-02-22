/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Tipos customizados do sistema
 */

import { Request } from 'express';

export interface AuthRequest extends Request {
  adminId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalAgendamentos: number;
  agendamentosHoje: number;
  agendamentosSemana: number;
  proximosAgendamentos: any[];
}
