/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - MembroEquipe
 */

import { Request, Response, NextFunction } from 'express';
import { MembroEquipeService } from '../services/MembroEquipeService';

export class MembroEquipeController {
  private service: MembroEquipeService;

  constructor() {
    this.service = new MembroEquipeService();
  }

  listarPublico = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const membros = await this.service.listarTodos(true);
      res.json({ status: 'success', data: membros });
    } catch (error) {
      next(error);
    }
  };

  listarTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const membros = await this.service.listarTodos();
      res.json({ status: 'success', data: membros });
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const membro = await this.service.buscarPorId(req.params.id);
      res.json({ status: 'success', data: membro });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nome, cargo, instagramUrl, facebookUrl, twitterUrl, ordem, ativo } = req.body;
      const data: any = { nome, cargo, instagramUrl, facebookUrl, twitterUrl };

      if (ordem !== undefined) data.ordem = parseInt(ordem);
      if (ativo !== undefined) data.ativo = ativo === 'true' || ativo === true;

      const membro = await this.service.criar(data, req.file?.buffer);
      res.status(201).json({ status: 'success', data: membro });
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nome, cargo, instagramUrl, facebookUrl, twitterUrl, ordem, ativo } = req.body;
      const data: any = {};

      if (nome !== undefined) data.nome = nome;
      if (cargo !== undefined) data.cargo = cargo;
      if (instagramUrl !== undefined) data.instagramUrl = instagramUrl;
      if (facebookUrl !== undefined) data.facebookUrl = facebookUrl;
      if (twitterUrl !== undefined) data.twitterUrl = twitterUrl;
      if (ordem !== undefined) data.ordem = parseInt(ordem);
      if (ativo !== undefined) data.ativo = ativo === 'true' || ativo === true;

      const membro = await this.service.atualizar(req.params.id, data, req.file?.buffer);
      res.json({ status: 'success', data: membro });
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deletar(req.params.id);
      res.json({ status: 'success', message: 'Membro deletado com sucesso' });
    } catch (error) {
      next(error);
    }
  };

  reordenar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { items } = req.body;
      await this.service.reordenar(items);
      res.json({ status: 'success', message: 'Ordem atualizada' });
    } catch (error) {
      next(error);
    }
  };
}
