/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - Configuracao
 */

import prisma from '../prisma/client';
import { UpdateConfiguracaoDTO } from '../dtos';

export class ConfiguracaoRepository {
  async find() {
    return prisma.configuracao.findFirst();
  }

  async update(id: string, data: UpdateConfiguracaoDTO) {
    return prisma.configuracao.update({ where: { id }, data });
  }

  async create(data: {
    whatsappPrincipal: string;
    whatsappSecundarios?: string[];
    enviarLembrete?: boolean;
    mensagemPersonalizada?: string;
  }) {
    return prisma.configuracao.create({ data });
  }
}
