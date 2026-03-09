/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - ServicoWeb (cards visuais do site)
 */

import { Request, Response, NextFunction } from 'express';
import { ServicoWebService } from '../services/ServicoWebService';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createDTO = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

const updateDTO = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().optional(),
  preco: z.number().positive().optional(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

export class ServicoWebController {
  private service: ServicoWebService;

  constructor() {
    this.service = new ServicoWebService();
  }

  listarPublico = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicos = await this.service.listarTodos(true);
      res.json({ status: 'success', data: servicos });
    } catch (error) {
      next(error);
    }
  };

  listarTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servicos = await this.service.listarTodos();
      res.json({ status: 'success', data: servicos });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createDTO.parse(req.body);
      const servico = await this.service.criar(data);
      res.status(201).json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateDTO.parse(req.body);
      const servico = await this.service.atualizar(req.params.id, data);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  uploadImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) throw new AppError('Nenhuma imagem enviada', 400);
      const servico = await this.service.uploadImagem(req.params.id, file.buffer);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  removerImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const servico = await this.service.removerImagem(req.params.id);
      res.json({ status: 'success', data: servico });
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deletar(req.params.id);
      res.json({ status: 'success', message: 'Serviço web deletado' });
    } catch (error) {
      next(error);
    }
  };
}
