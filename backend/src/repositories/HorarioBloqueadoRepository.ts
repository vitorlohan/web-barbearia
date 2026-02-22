/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - HorarioBloqueado
 */

import prisma from '../prisma/client';

export class HorarioBloqueadoRepository {
  async findAll() {
    return prisma.horarioBloqueado.findMany({
      orderBy: [{ data: 'asc' }, { horario: 'asc' }],
    });
  }

  async findByData(data: Date) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.horarioBloqueado.findMany({
      where: { data: { gte: startOfDay, lte: endOfDay } },
    });
  }

  async create(data: { data: Date; horario: string; motivo?: string }) {
    return prisma.horarioBloqueado.create({ data });
  }

  async delete(id: string) {
    return prisma.horarioBloqueado.delete({ where: { id } });
  }

  async getBlockedSlots(data: Date) {
    const bloqueados = await this.findByData(data);
    return bloqueados.map((b) => b.horario);
  }
}
