/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - ConfiguracaoWeb
 */

import { Request, Response, NextFunction } from 'express';
import { ConfiguracaoWebService } from '../services/ConfiguracaoWebService';
import { updateConfiguracaoWebDTO } from '../dtos';

export class ConfiguracaoWebController {
  private service: ConfiguracaoWebService;

  constructor() {
    this.service = new ConfiguracaoWebService();
  }

  /** GET /api/config-web/public - Retorna config para o site público */
  obterPublico = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.service.obter();
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  /** GET /api/config-web - Admin */
  obter = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.service.obter();
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  /** PUT /api/config-web - Admin - Atualizar dados gerais */
  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateConfiguracaoWebDTO.parse(req.body);
      const config = await this.service.atualizar(data);
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  /** POST /api/config-web/logo/:tipo - Admin - Upload de logo */
  uploadLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tipo = req.params.tipo as 'header' | 'footer';
      if (!['header', 'footer'].includes(tipo)) {
        res.status(400).json({ status: 'error', message: 'Tipo inválido. Use: header ou footer' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ status: 'error', message: 'Nenhuma imagem enviada' });
        return;
      }

      const config = await this.service.uploadLogo(tipo, req.file.buffer);
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  /** POST /api/config-web/sobre-imagem/:posicao - Admin - Upload imagem Sobre */
  uploadSobreImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const posicao = parseInt(req.params.posicao);
      if (![1, 2, 3].includes(posicao)) {
        res.status(400).json({ status: 'error', message: 'Posição inválida. Use: 1, 2 ou 3' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ status: 'error', message: 'Nenhuma imagem enviada' });
        return;
      }

      const config = await this.service.uploadSobreImagem(posicao, req.file.buffer);
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };
}
