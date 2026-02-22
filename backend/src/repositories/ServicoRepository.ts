/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - Servico
 */

import prisma from '../prisma/client';
import { CreateServicoDTO, UpdateServicoDTO } from '../dtos';

export class ServicoRepository {
  async findAll(apenasAtivos: boolean = false) {
    return prisma.servico.findMany({
      where: apenasAtivos ? { ativo: true } : undefined,
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.servico.findUnique({ where: { id } });
  }

  async create(data: CreateServicoDTO) {
    return prisma.servico.create({ data });
  }

  async update(id: string, data: UpdateServicoDTO) {
    return prisma.servico.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.servico.delete({ where: { id } });
  }

  async count() {
    return prisma.servico.count({ where: { ativo: true } });
  }
}
