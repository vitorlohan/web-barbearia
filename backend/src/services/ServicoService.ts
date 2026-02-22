/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Servico
 */

import { ServicoRepository } from '../repositories';
import { CreateServicoDTO, UpdateServicoDTO } from '../dtos';
import { AppError } from '../utils/AppError';
import { UploadService } from './UploadService';

export class ServicoService {
  private servicoRepository: ServicoRepository;
  private uploadService: UploadService;

  constructor() {
    this.servicoRepository = new ServicoRepository();
    this.uploadService = new UploadService();
  }

  async listarTodos(apenasAtivos: boolean = false) {
    return this.servicoRepository.findAll(apenasAtivos);
  }

  async buscarPorId(id: string) {
    const servico = await this.servicoRepository.findById(id);

    if (!servico) {
      throw new AppError('Serviço não encontrado', 404);
    }

    return servico;
  }

  async criar(data: CreateServicoDTO) {
    return this.servicoRepository.create(data);
  }

  async atualizar(id: string, data: UpdateServicoDTO) {
    await this.buscarPorId(id);
    return this.servicoRepository.update(id, data);
  }

  async uploadImagem(id: string, fileBuffer: Buffer) {
    const servico = await this.buscarPorId(id);

    // Deletar imagem anterior se existir
    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }

    const imageUrl = await this.uploadService.uploadImage(fileBuffer, 'barbearia_web/servicos');
    return this.servicoRepository.update(id, { imagem: imageUrl });
  }

  async removerImagem(id: string) {
    const servico = await this.buscarPorId(id);

    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }

    return this.servicoRepository.update(id, { imagem: null as any });
  }

  async deletar(id: string) {
    const servico = await this.buscarPorId(id);

    // Deletar imagem do Cloudinary se existir
    if (servico.imagem) {
      await this.uploadService.deleteImage(servico.imagem);
    }

    return this.servicoRepository.delete(id);
  }
}
