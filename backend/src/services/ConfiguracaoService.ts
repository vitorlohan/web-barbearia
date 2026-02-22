/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Configuracao
 */

import { ConfiguracaoRepository } from '../repositories';
import { UpdateConfiguracaoDTO } from '../dtos';
import { AppError } from '../utils/AppError';

export class ConfiguracaoService {
  private configuracaoRepository: ConfiguracaoRepository;

  constructor() {
    this.configuracaoRepository = new ConfiguracaoRepository();
  }

  async buscar() {
    const config = await this.configuracaoRepository.find();

    if (!config) {
      throw new AppError('Configuração não encontrada', 404);
    }

    return config;
  }

  async atualizar(data: UpdateConfiguracaoDTO) {
    const config = await this.configuracaoRepository.find();

    if (!config) {
      throw new AppError('Configuração não encontrada', 404);
    }

    return this.configuracaoRepository.update(config.id, data);
  }

  async getWhatsAppPrincipal() {
    const config = await this.configuracaoRepository.find();
    return config?.whatsappPrincipal || '';
  }
}
