/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - Agendamentos
 */

import { Router } from 'express';
import { AgendamentoController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();
const agendamentoController = new AgendamentoController();

// Rotas públicas
router.post('/', agendamentoController.criar);
router.get('/horarios-disponiveis', agendamentoController.horariosDisponiveis);

// Rotas protegidas (admin)
router.get('/', authMiddleware, agendamentoController.listarTodos);
router.get('/dashboard', authMiddleware, agendamentoController.dashboard);
router.get('/exportar-csv', authMiddleware, agendamentoController.exportarCSV);
router.get('/:id', authMiddleware, agendamentoController.buscarPorId);
router.patch('/:id/status', authMiddleware, agendamentoController.atualizarStatus);
router.patch('/:id/cancelar', authMiddleware, agendamentoController.cancelar);

export default router;
