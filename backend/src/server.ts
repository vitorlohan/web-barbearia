/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Servidor Express - Entry Point
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config';
import routes from './routes';
import { errorHandler } from './middlewares';
import { CronService, WhatsAppService } from './services';

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (_req, res) => {
  res.json({
    name: 'Barbearia API',
    version: '1.0.0',
    author: 'Vitor Lohan',
    status: 'running',
  });
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
app.listen(env.PORT, () => {
  console.log('');
  console.log('===================================');
  console.log('  💈 Barbearia API');
  console.log(`  🚀 Servidor rodando na porta ${env.PORT}`);
  console.log(`  📍 http://localhost:${env.PORT}`);
  console.log(`  🌍 Ambiente: ${env.NODE_ENV}`);
  console.log('  👨‍💻 Desenvolvido por Vitor Lohan');
  console.log('===================================');
  console.log('');

  // Iniciar WPPConnect (WhatsApp)
  WhatsAppService.inicializar().then(() => {
    console.log('📱 WPPConnect inicializado');
  }).catch((err) => {
    console.error('⚠️  WPPConnect não conectado:', err.message);
    console.log('⚠️  Mensagens serão simuladas no console.');
  });

  // Iniciar cron jobs
  const cronService = new CronService();
  cronService.start();
});

export default app;
