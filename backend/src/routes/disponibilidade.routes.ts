/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - Disponibilidade Semanal
 */

import { Router } from 'express';
import { DisponibilidadeController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();
const controller = new DisponibilidadeController();

// Rotas públicas (para o modal de agendamento)
router.get('/dias-disponiveis', controller.diasDisponiveis);
router.get('/ativos', controller.listarAtivos);

// Rotas protegidas (admin)
router.get('/', authMiddleware, controller.listarTodos);
router.put('/', authMiddleware, controller.salvarTodos);

export default router;
