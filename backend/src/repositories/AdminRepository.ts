/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - Admin
 */

import prisma from '../prisma/client';

export class AdminRepository {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  }

  async create(data: { nome: string; email: string; senha: string }) {
    return prisma.admin.create({ data });
  }
}
