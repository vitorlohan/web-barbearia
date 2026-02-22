/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Agendamentos
 */

import api from './api';
import { Servico } from './servicoService';

export interface Agendamento {
  id: string;
  nomeCliente: string;
  telefoneCliente: string;
  servicoId: string;
  servico: Servico;
  data: string;
  horario: string;
  status: 'AGENDADO' | 'CANCELADO' | 'FINALIZADO';
  createdAt: string;
  updatedAt: string;
}

export interface AgendamentoListResponse {
  status: string;
  data: Agendamento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardData {
  totalAgendamentos: number;
  agendamentosHoje: number;
  agendamentosSemana: number;
  proximosAgendamentos: Agendamento[];
}

export const agendamentoService = {
  criar: (data: {
    nomeCliente: string;
    telefoneCliente: string;
    servicoId: string;
    data: string;
    horario: string;
  }) => api.post<{ status: string; message: string; data: Agendamento }>('/agendamentos', data),

  horariosDisponiveis: (data: string) =>
    api.get<{ status: string; data: string[] }>('/agendamentos/horarios-disponiveis', { params: { data } }),

  listarTodos: (params?: {
    status?: string;
    data?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }) => api.get<AgendamentoListResponse>('/agendamentos', { params }),

  buscarPorId: (id: string) =>
    api.get<{ status: string; data: Agendamento }>(`/agendamentos/${id}`),

  atualizarStatus: (id: string, status: string) =>
    api.patch<{ status: string; data: Agendamento }>(`/agendamentos/${id}/status`, { status }),

  cancelar: (id: string) =>
    api.patch<{ status: string; data: Agendamento }>(`/agendamentos/${id}/cancelar`),

  dashboard: () =>
    api.get<{ status: string; data: DashboardData }>('/agendamentos/dashboard'),

  exportarCSV: (params?: { dataInicio?: string; dataFim?: string }) =>
    api.get('/agendamentos/exportar-csv', { params, responseType: 'blob' }),
};
