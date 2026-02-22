/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - Servico
 */

import { Request, Response, NextFunction } from 'express';
import { ServicoService } from '../services';
import { createServicoDTO, updateServicoDTO } from '../dtos';
import { AppError } from '../utils/AppError';

export class ServicoController {
  private servicoService: ServicoService;

  constructor() {
    this.servicoService = new ServicoService();
  }

  listarPublico = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicos = await this.servicoService.listarTodos(true);
      res.json({ status: 'success', data: servicos });
    } catch (error) {
      next(error);
    }
  };

  listarTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicos = await this.servicoService.listarTodos();
      res.json({ status: 'success', data: servicos });
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servico = await this.servicoService.buscarPorId(req.params.id);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createServicoDTO.parse(req.body);
      const servico = await this.servicoService.criar(data);
      res.status(201).json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateServicoDTO.parse(req.body);
      const servico = await this.servicoService.atualizar(req.params.id, data);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  uploadImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        throw new AppError('Nenhuma imagem enviada', 400);
      }
      const servico = await this.servicoService.uploadImagem(req.params.id, file.buffer);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  removerImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servico = await this.servicoService.removerImagem(req.params.id);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.servicoService.deletar(req.params.id);
      res.json({ status: 'success', message: 'Serviço deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  };
}
