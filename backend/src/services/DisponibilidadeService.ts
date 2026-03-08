/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - DisponibilidadeSemanal
 */

import { DisponibilidadeRepository } from '../repositories';
import { AppError } from '../utils/AppError';

interface DiaDisponibilidade {
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  intervaloMinutos: number;
  maxAgendamentos: number;
  ativo: boolean;
}

export class DisponibilidadeService {
  private repository: DisponibilidadeRepository;

  constructor() {
    this.repository = new DisponibilidadeRepository();
  }

  async listarTodos() {
    return this.repository.findAll();
  }

  async listarAtivos() {
    return this.repository.findAtivos();
  }

  async buscarPorDia(diaSemana: number) {
    if (diaSemana < 0 || diaSemana > 6) {
      throw new AppError('Dia da semana inválido (0-6)', 400);
    }
    return this.repository.findByDia(diaSemana);
  }

  async salvarTodos(dias: DiaDisponibilidade[]) {
    // Validate each day
    for (const dia of dias) {
      if (dia.diaSemana < 0 || dia.diaSemana > 6) {
        throw new AppError(`Dia da semana inválido: ${dia.diaSemana}`, 400);
      }
      if (dia.maxAgendamentos < 1) {
        throw new AppError('Quantidade máxima deve ser pelo menos 1', 400);
      }
      if (dia.intervaloMinutos < 10 || dia.intervaloMinutos > 120) {
        throw new AppError('Intervalo deve ser entre 10 e 120 minutos', 400);
      }
      // Validate time format
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(dia.horaInicio) || !timeRegex.test(dia.horaFim)) {
        throw new AppError('Formato de horário inválido (HH:MM)', 400);
      }
      if (dia.horaInicio >= dia.horaFim) {
        throw new AppError(`Hora início deve ser anterior à hora fim (dia ${dia.diaSemana})`, 400);
      }
    }

    return this.repository.salvarTodos(dias);
  }

  async getDiasDisponiveis() {
    const ativos = await this.repository.findAtivos();
    return ativos.map((d) => d.diaSemana);
  }
}
