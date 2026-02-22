/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - ConfiguracaoWeb
 */

import { Router } from 'express';
import { ConfiguracaoWebController } from '../controllers/ConfiguracaoWebController';
import { authMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload';

const router = Router();
const controller = new ConfiguracaoWebController();

// Rota pública - site consome esta rota
router.get('/public', controller.obterPublico);

// Rotas protegidas (admin)
router.get('/', authMiddleware, controller.obter);
router.put('/', authMiddleware, controller.atualizar);
router.post('/logo/:tipo', authMiddleware, upload.single('imagem'), controller.uploadLogo);
router.post('/sobre-imagem/:posicao', authMiddleware, upload.single('imagem'), controller.uploadSobreImagem);

export default router;
