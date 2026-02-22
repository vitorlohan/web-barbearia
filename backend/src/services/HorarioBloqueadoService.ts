/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - HorarioBloqueado
 */

import { HorarioBloqueadoRepository } from '../repositories';
import { CreateHorarioBloqueadoDTO } from '../dtos';
import { AppError } from '../utils/AppError';

export class HorarioBloqueadoService {
  private repository: HorarioBloqueadoRepository;

  constructor() {
    this.repository = new HorarioBloqueadoRepository();
  }

  async listarTodos() {
    return this.repository.findAll();
  }

  async criar(data: CreateHorarioBloqueadoDTO) {
    return this.repository.create({
      data: new Date(data.data),
      horario: data.horario,
      motivo: data.motivo,
    });
  }

  async deletar(id: string) {
    return this.repository.delete(id);
  }
}
