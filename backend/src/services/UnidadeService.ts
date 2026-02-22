/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Unidade
 */

import { UnidadeRepository } from '../repositories';
import { UploadService } from './UploadService';
import { AppError } from '../utils/AppError';

export class UnidadeService {
  private repo: UnidadeRepository;
  private uploadService: UploadService;

  constructor() {
    this.repo = new UnidadeRepository();
    this.uploadService = new UploadService();
  }

  async listarTodas(apenasAtivas: boolean = false) {
    return this.repo.findAll(apenasAtivas);
  }

  async buscarPorId(id: string) {
    const unidade = await this.repo.findById(id);
    if (!unidade) throw new AppError('Unidade não encontrada', 404);
    return unidade;
  }

  async criar(data: any, fileBuffer?: Buffer) {
    if (fileBuffer) {
      data.imagem = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/unidades');
    }
    return this.repo.create(data);
  }

  async atualizar(id: string, data: any, fileBuffer?: Buffer) {
    const unidade = await this.buscarPorId(id);

    if (fileBuffer) {
      data.imagem = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/unidades');

      if (unidade.imagem) {
        try {
          await this.uploadService.deleteImage(unidade.imagem);
        } catch { /* ignore */ }
      }
    }

    return this.repo.update(id, data);
  }

  async deletar(id: string) {
    const unidade = await this.buscarPorId(id);

    if (unidade.imagem) {
      try {
        await this.uploadService.deleteImage(unidade.imagem);
      } catch { /* ignore */ }
    }

    return this.repo.delete(id);
  }

  async reordenar(items: { id: string; ordem: number }[]) {
    return this.repo.reorder(items);
  }
}
