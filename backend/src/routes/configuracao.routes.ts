/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - Configuracao
 */

import { Router } from 'express';
import { ConfiguracaoController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();
const configuracaoController = new ConfiguracaoController();

// Rota pública (para widget WhatsApp)
router.get('/whatsapp', configuracaoController.getWhatsApp);

// Rotas protegidas (admin)
router.get('/', authMiddleware, configuracaoController.buscar);
router.put('/', authMiddleware, configuracaoController.atualizar);

export default router;
