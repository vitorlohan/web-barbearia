/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Router principal
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import servicoRoutes from './servico.routes';
import agendamentoRoutes from './agendamento.routes';
import configuracaoRoutes from './configuracao.routes';
import horarioBloqueadoRoutes from './horarioBloqueado.routes';
import configWebRoutes from './configWeb.routes';
import membroEquipeRoutes from './membroEquipe.routes';
import unidadeRoutes from './unidade.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/configuracao', configuracaoRoutes);
router.use('/horarios-bloqueados', horarioBloqueadoRoutes);
router.use('/config-web', configWebRoutes);
router.use('/equipe', membroEquipeRoutes);
router.use('/unidades', unidadeRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
