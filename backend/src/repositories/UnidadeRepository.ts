/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - Unidade
 */

import prisma from '../prisma/client';

export class UnidadeRepository {
  async findAll(apenasAtivos: boolean = false) {
    return prisma.unidade.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      orderBy: { ordem: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.unidade.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.unidade.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.unidade.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.unidade.delete({ where: { id } });
  }

  async reorder(items: { id: string; ordem: number }[]) {
    const updates = items.map((item) =>
      prisma.unidade.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      })
    );
    return prisma.$transaction(updates);
  }
}
