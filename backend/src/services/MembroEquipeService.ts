/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - MembroEquipe
 */

import { MembroEquipeRepository } from '../repositories';
import { UploadService } from './UploadService';
import { AppError } from '../utils/AppError';

export class MembroEquipeService {
  private repo: MembroEquipeRepository;
  private uploadService: UploadService;

  constructor() {
    this.repo = new MembroEquipeRepository();
    this.uploadService = new UploadService();
  }

  async listarTodos(apenasAtivos: boolean = false) {
    return this.repo.findAll(apenasAtivos);
  }

  async buscarPorId(id: string) {
    const membro = await this.repo.findById(id);
    if (!membro) throw new AppError('Membro não encontrado', 404);
    return membro;
  }

  async criar(data: any, fileBuffer?: Buffer) {
    if (fileBuffer) {
      data.imagem = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/equipe');
    }
    return this.repo.create(data);
  }

  async atualizar(id: string, data: any, fileBuffer?: Buffer) {
    const membro = await this.buscarPorId(id);

    if (fileBuffer) {
      data.imagem = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/equipe');

      // Deletar imagem antiga
      if (membro.imagem) {
        try {
          await this.uploadService.deleteImage(membro.imagem);
        } catch { /* ignore */ }
      }
    }

    return this.repo.update(id, data);
  }

  async deletar(id: string) {
    const membro = await this.buscarPorId(id);

    // Deletar imagem do Cloudinary
    if (membro.imagem) {
      try {
        await this.uploadService.deleteImage(membro.imagem);
      } catch { /* ignore */ }
    }

    return this.repo.delete(id);
  }

  async reordenar(items: { id: string; ordem: number }[]) {
    return this.repo.reorder(items);
  }
}
