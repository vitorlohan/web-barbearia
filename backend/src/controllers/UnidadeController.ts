/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - Unidade
 */

import { Request, Response, NextFunction } from 'express';
import { UnidadeService } from '../services/UnidadeService';

export class UnidadeController {
  private service: UnidadeService;

  constructor() {
    this.service = new UnidadeService();
  }

  listarPublico = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unidades = await this.service.listarTodas(true);
      res.json({ status: 'success', data: unidades });
    } catch (error) {
      next(error);
    }
  };

  listarTodas = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unidades = await this.service.listarTodas();
      res.json({ status: 'success', data: unidades });
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unidade = await this.service.buscarPorId(req.params.id);
      res.json({ status: 'success', data: unidade });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nome, cidade, endereco, ordem, ativo } = req.body;
      const data: any = { nome, cidade, endereco };

      if (ordem !== undefined) data.ordem = parseInt(ordem);
      if (ativo !== undefined) data.ativo = ativo === 'true' || ativo === true;

      const unidade = await this.service.criar(data, req.file?.buffer);
      res.status(201).json({ status: 'success', data: unidade });
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nome, cidade, endereco, ordem, ativo } = req.body;
      const data: any = {};

      if (nome !== undefined) data.nome = nome;
      if (cidade !== undefined) data.cidade = cidade;
      if (endereco !== undefined) data.endereco = endereco;
      if (ordem !== undefined) data.ordem = parseInt(ordem);
      if (ativo !== undefined) data.ativo = ativo === 'true' || ativo === true;

      const unidade = await this.service.atualizar(req.params.id, data, req.file?.buffer);
      res.json({ status: 'success', data: unidade });
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deletar(req.params.id);
      res.json({ status: 'success', message: 'Unidade deletada com sucesso' });
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
