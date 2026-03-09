/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - ServicoWeb (cards visuais do site)
 */

import prisma from '../prisma/client';

export class ServicoWebRepository {
  async findAll(apenasAtivos: boolean = false) {
    return prisma.servicoWeb.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      orderBy: { ordem: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.servicoWeb.findUnique({ where: { id } });
  }

  async create(data: { nome: string; descricao?: string; preco: number; imagem?: string; ordem?: number; ativo?: boolean }) {
    return prisma.servicoWeb.create({ data });
  }

  async update(id: string, data: Partial<{ nome: string; descricao: string; preco: number; imagem: string | null; ordem: number; ativo: boolean }>) {
    return prisma.servicoWeb.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.servicoWeb.delete({ where: { id } });
  }
}
