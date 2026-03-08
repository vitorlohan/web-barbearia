/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Disponibilidade Semanal
 */

import api from './api';

export interface DisponibilidadeSemanal {
  id?: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  intervaloMinutos: number;
  maxAgendamentos: number;
  ativo: boolean;
}

export const disponibilidadeService = {
  listarTodos: () =>
    api.get<{ status: string; data: DisponibilidadeSemanal[] }>('/disponibilidade'),

  listarAtivos: () =>
    api.get<{ status: string; data: DisponibilidadeSemanal[] }>('/disponibilidade/ativos'),

  diasDisponiveis: () =>
    api.get<{ status: string; data: number[] }>('/disponibilidade/dias-disponiveis'),

  salvarTodos: (dias: DisponibilidadeSemanal[]) =>
    api.put<{ status: string; data: DisponibilidadeSemanal[] }>('/disponibilidade', { dias }),
};
