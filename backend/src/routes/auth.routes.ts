/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Routes - Auth
 */

import { Router } from 'express';
import { AuthController } from '../controllers';
import { authMiddleware } from '../middlewares';
import rateLimit from 'express-rate-limit';

const router = Router();
const authController = new AuthController();

// Rate limit para login - 5 tentativas por 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 'error', message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

router.post('/login', loginLimiter, authController.login);
router.get('/profile', authMiddleware, authController.profile);

export default router;
