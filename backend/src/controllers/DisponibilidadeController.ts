/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - DisponibilidadeSemanal
 */

import { Request, Response, NextFunction } from 'express';
import { DisponibilidadeService } from '../services';

export class DisponibilidadeController {
  private service: DisponibilidadeService;

  constructor() {
    this.service = new DisponibilidadeService();
  }

  listarTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dados = await this.service.listarTodos();
      res.json({ status: 'success', data: dados });
    } catch (error) {
      next(error);
    }
  };

  listarAtivos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dados = await this.service.listarAtivos();
      res.json({ status: 'success', data: dados });
    } catch (error) {
      next(error);
    }
  };

  diasDisponiveis = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dias = await this.service.getDiasDisponiveis();
      res.json({ status: 'success', data: dias });
    } catch (error) {
      next(error);
    }
  };

  salvarTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dias } = req.body;

      if (!Array.isArray(dias)) {
        res.status(400).json({ status: 'error', message: 'Dados inválidos' });
        return;
      }

      const resultado = await this.service.salvarTodos(dias);
      res.json({ status: 'success', data: resultado });
    } catch (error) {
      next(error);
    }
  };
}
