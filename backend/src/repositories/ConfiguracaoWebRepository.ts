/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - ConfiguracaoWeb
 */

import prisma from '../prisma/client';

export class ConfiguracaoWebRepository {
  async find() {
    return prisma.configuracaoWeb.findFirst();
  }

  async upsert(data: any) {
    const existing = await this.find();

    if (existing) {
      return prisma.configuracaoWeb.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.configuracaoWeb.create({ data });
  }
}
