/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - MembroEquipe
 */

import prisma from '../prisma/client';

export class MembroEquipeRepository {
  async findAll(apenasAtivos: boolean = false) {
    return prisma.membroEquipe.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      orderBy: { ordem: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.membroEquipe.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.membroEquipe.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.membroEquipe.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.membroEquipe.delete({ where: { id } });
  }

  async reorder(items: { id: string; ordem: number }[]) {
    const updates = items.map((item) =>
      prisma.membroEquipe.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      })
    );
    return prisma.$transaction(updates);
  }
}
