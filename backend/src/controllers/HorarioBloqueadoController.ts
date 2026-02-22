/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - HorarioBloqueado
 */

import { Request, Response, NextFunction } from 'express';
import { HorarioBloqueadoService } from '../services';
import { createHorarioBloqueadoDTO } from '../dtos';

export class HorarioBloqueadoController {
  private service: HorarioBloqueadoService;

  constructor() {
    this.service = new HorarioBloqueadoService();
  }

  listarTodos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const horarios = await this.service.listarTodos();
      res.json({ status: 'success', data: horarios });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createHorarioBloqueadoDTO.parse(req.body);
      const horario = await this.service.criar(data);
      res.status(201).json({ status: 'success', data: horario });
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deletar(req.params.id);
      res.json({ status: 'success', message: 'Horário desbloqueado com sucesso' });
    } catch (error) {
      next(error);
    }
  };
}
