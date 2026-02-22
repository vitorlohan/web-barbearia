/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - MembroEquipe
 */

import { Router } from 'express';
import { MembroEquipeController } from '../controllers/MembroEquipeController';
import { authMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload';

const router = Router();
const controller = new MembroEquipeController();

// Rota pública
router.get('/public', controller.listarPublico);

// Rotas protegidas (admin)
router.get('/', authMiddleware, controller.listarTodos);
router.put('/reorder/batch', authMiddleware, controller.reordenar);
router.get('/:id', authMiddleware, controller.buscarPorId);
router.post('/', authMiddleware, upload.single('imagem'), controller.criar);
router.put('/:id', authMiddleware, upload.single('imagem'), controller.atualizar);
router.delete('/:id', authMiddleware, controller.deletar);

export default router;
