/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - ServicoWeb (cards visuais do site)
 */

import { ServicoWebRepository } from '../repositories/ServicoWebRepository';
import { UploadService } from './UploadService';
import { AppError } from '../utils/AppError';

export class ServicoWebService {
  private repo: ServicoWebRepository;
  private uploadService: UploadService;

  constructor() {
    this.repo = new ServicoWebRepository();
    this.uploadService = new UploadService();
  }

  async listarTodos(apenasAtivos: boolean = false) {
    return this.repo.findAll(apenasAtivos);
  }

  async buscarPorId(id: string) {
    const servico = await this.repo.findById(id);
    if (!servico) throw new AppError('Serviço web não encontrado', 404);
    return servico;
  }

  async criar(data: { nome: string; descricao?: string; preco: number; ordem?: number; ativo?: boolean }) {
    return this.repo.create(data);
  }

  async atualizar(id: string, data: Partial<{ nome: string; descricao: string; preco: number; ordem: number; ativo: boolean }>) {
    await this.buscarPorId(id);
    return this.repo.update(id, data);
  }

  async uploadImagem(id: string, fileBuffer: Buffer) {
    const servico = await this.buscarPorId(id);
    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }
    const imageUrl = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/servicos_web');
    return this.repo.update(id, { imagem: imageUrl });
  }

  async removerImagem(id: string) {
    const servico = await this.buscarPorId(id);
    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }
    return this.repo.update(id, { imagem: null });
  }

  async deletar(id: string) {
    const servico = await this.buscarPorId(id);
    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }
    return this.repo.delete(id);
  }
}
