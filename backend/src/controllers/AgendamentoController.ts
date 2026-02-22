/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - Agendamento
 */

import { Request, Response, NextFunction } from 'express';
import { AgendamentoService } from '../services';
import { createAgendamentoDTO, updateAgendamentoStatusDTO } from '../dtos';
import { StatusAgendamento } from '@prisma/client';

export class AgendamentoController {
  private agendamentoService: AgendamentoService;

  constructor() {
    this.agendamentoService = new AgendamentoService();
  }

  listarTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, data, dataInicio, dataFim, page, limit } = req.query;
      
      const result = await this.agendamentoService.listarTodos({
        status: status as StatusAgendamento | undefined,
        data: data as string | undefined,
        dataInicio: dataInicio as string | undefined,
        dataFim: dataFim as string | undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agendamento = await this.agendamentoService.buscarPorId(req.params.id);
      res.json({ status: 'success', data: agendamento });
    } catch (error) {
      next(error);
    }
  };

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createAgendamentoDTO.parse(req.body);
      const agendamento = await this.agendamentoService.criar(data);
      
      res.status(201).json({
        status: 'success',
        message: 'Agendamento realizado com sucesso!',
        data: agendamento,
      });
    } catch (error) {
      next(error);
    }
  };

  atualizarStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = updateAgendamentoStatusDTO.parse(req.body);
      const agendamento = await this.agendamentoService.atualizarStatus(req.params.id, status);
      
      res.json({ status: 'success', data: agendamento });
    } catch (error) {
      next(error);
    }
  };

  cancelar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agendamento = await this.agendamentoService.cancelar(req.params.id);
      res.json({ status: 'success', data: agendamento });
    } catch (error) {
      next(error);
    }
  };

  horariosDisponiveis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { data } = req.query;
      
      if (!data) {
        res.status(400).json({ status: 'error', message: 'Data é obrigatória' });
        return;
      }

      const horarios = await this.agendamentoService.horariosDisponiveis(data as string);
      res.json({ status: 'success', data: horarios });
    } catch (error) {
      next(error);
    }
  };

  dashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.agendamentoService.getDashboard();
      res.json({ status: 'success', data: stats });
    } catch (error) {
      next(error);
    }
  };

  exportarCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dataInicio, dataFim } = req.query;
      
      const csv = await this.agendamentoService.exportarCSV({
        dataInicio: dataInicio as string | undefined,
        dataFim: dataFim as string | undefined,
      });

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=agendamentos.csv');
      res.send('\uFEFF' + csv); // BOM para Excel
    } catch (error) {
      next(error);
    }
  };
}
