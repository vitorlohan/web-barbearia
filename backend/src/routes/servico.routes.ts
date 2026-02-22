/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - Servicos
 */

import { Router } from 'express';
import { ServicoController } from '../controllers';
import { authMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload';

const router = Router();
const servicoController = new ServicoController();

// Rotas públicas
router.get('/public', servicoController.listarPublico);

// Rotas protegidas (admin)
router.get('/', authMiddleware, servicoController.listarTodos);
router.get('/:id', authMiddleware, servicoController.buscarPorId);
router.post('/', authMiddleware, servicoController.criar);
router.put('/:id', authMiddleware, servicoController.atualizar);
router.post('/:id/imagem', authMiddleware, upload.single('imagem'), servicoController.uploadImagem);
router.delete('/:id/imagem', authMiddleware, servicoController.removerImagem);
router.delete('/:id', authMiddleware, servicoController.deletar);

export default router;
