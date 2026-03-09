/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - ServicoWeb (cards visuais do site)
 */

import { Router } from 'express';
import { ServicoWebController } from '../controllers/ServicoWebController';
import { authMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload';

const router = Router();
const controller = new ServicoWebController();

// Rotas públicas
router.get('/public', controller.listarPublico);

// Rotas protegidas (admin)
router.get('/', authMiddleware, controller.listarTodos);
router.post('/', authMiddleware, controller.criar);
router.put('/:id', authMiddleware, controller.atualizar);
router.post('/:id/imagem', authMiddleware, upload.single('imagem'), controller.uploadImagem);
router.delete('/:id/imagem', authMiddleware, controller.removerImagem);
router.delete('/:id', authMiddleware, controller.deletar);

export default router;
