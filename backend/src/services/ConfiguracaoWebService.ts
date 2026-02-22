/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - ConfiguracaoWeb
 */

import { ConfiguracaoWebRepository } from '../repositories';
import { UploadService } from './UploadService';

export class ConfiguracaoWebService {
  private repo: ConfiguracaoWebRepository;
  private uploadService: UploadService;

  constructor() {
    this.repo = new ConfiguracaoWebRepository();
    this.uploadService = new UploadService();
  }

  async obter() {
    let config = await this.repo.find();

    if (!config) {
      // Cria config padrão se não existir
      config = await this.repo.upsert({
        corPrimaria: '#D4A843',
        corPrimariaLight: '#E8C76A',
        corBackground: '#0D0D0D',
        corBackgroundCard: '#1A1A1A',
        corTexto: '#F5F5F5',
        corTextoMuted: '#8A8A8A',
        corBorda: '#2A2A2A',
        sobreTitulo: 'Tradição e Estilo desde 2010',
      });
    }

    return config;
  }

  async atualizar(data: any) {
    return this.repo.upsert(data);
  }

  async uploadLogo(tipo: 'header' | 'footer', fileBuffer: Buffer) {
    const url = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/logos');

    const updateData = tipo === 'header'
      ? { logoHeaderUrl: url }
      : { logoFooterUrl: url };

    // Deletar logo antiga se existir
    const config = await this.repo.find();
    if (config) {
      const oldUrl = tipo === 'header' ? config.logoHeaderUrl : config.logoFooterUrl;
      if (oldUrl) {
        try {
          await this.uploadService.deleteImage(oldUrl);
        } catch { /* ignore */ }
      }
    }

    return this.repo.upsert(updateData);
  }

  async uploadSobreImagem(posicao: number, fileBuffer: Buffer) {
    const url = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/sobre');

    const fieldMap: Record<number, string> = {
      1: 'sobreImagem1',
      2: 'sobreImagem2',
      3: 'sobreImagem3',
    };

    const field = fieldMap[posicao];
    if (!field) throw new Error('Posição de imagem inválida (1-3)');

    // Deletar imagem antiga
    const config = await this.repo.find();
    if (config) {
      const oldUrl = (config as any)[field];
      if (oldUrl) {
        try {
          await this.uploadService.deleteImage(oldUrl);
        } catch { /* ignore */ }
      }
    }

    return this.repo.upsert({ [field]: url });
  }
}
