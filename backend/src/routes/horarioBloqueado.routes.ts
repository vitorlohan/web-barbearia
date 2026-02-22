/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - HorariosBloqueados
 */

import { Router } from 'express';
import { HorarioBloqueadoController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();
const controller = new HorarioBloqueadoController();

// Todas as rotas protegidas (admin)
router.get('/', authMiddleware, controller.listarTodos);
router.post('/', authMiddleware, controller.criar);
router.delete('/:id', authMiddleware, controller.deletar);

export default router;
