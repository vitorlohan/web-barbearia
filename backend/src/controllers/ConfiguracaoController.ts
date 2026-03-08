/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Controller - Configuracao
 */

import { Request, Response, NextFunction } from 'express';
import { ConfiguracaoService, WhatsAppService } from '../services';
import { updateConfiguracaoDTO } from '../dtos';

export class ConfiguracaoController {
  private configuracaoService: ConfiguracaoService;

  constructor() {
    this.configuracaoService = new ConfiguracaoService();
  }

  buscar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.configuracaoService.buscar();
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = updateConfiguracaoDTO.parse(req.body);
      const config = await this.configuracaoService.atualizar(data);
      res.json({ status: 'success', data: config });
    } catch (error) {
      next(error);
    }
  };

  getWhatsApp = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const whatsapp = await this.configuracaoService.getWhatsAppPrincipal();
      res.json({ status: 'success', data: { whatsapp } });
    } catch (error) {
      next(error);
    }
  };

  getWhatsAppStatus = async (_req: Request, res: Response): Promise<void> => {
    res.json({
      status: 'success',
      data: {
        connected: WhatsAppService.isConnected(),
        initializing: WhatsAppService.isInitializing(),
        hasQrCode: WhatsAppService.getQrCode() !== null,
        error: WhatsAppService.getLastError(),
      },
    });
  };

  getWhatsAppQrCode = async (_req: Request, res: Response): Promise<void> => {
    const qrCode = WhatsAppService.getQrCode();
    
    if (!qrCode) {
      res.json({
        status: 'success',
        data: {
          qrCode: null,
          connected: WhatsAppService.isConnected(),
          initializing: WhatsAppService.isInitializing(),
        },
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        qrCode,
        connected: false,
        initializing: false,
      },
    });
  };

  reconnectWhatsApp = async (_req: Request, res: Response): Promise<void> => {
    try {
      await WhatsAppService.reconectar();
      res.json({
        status: 'success',
        data: { message: 'Reconexão iniciada. Aguarde o QR Code.' },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao reconectar',
      });
    }
  };

  disconnectWhatsApp = async (_req: Request, res: Response): Promise<void> => {
    try {
      await WhatsAppService.desconectar();
      res.json({
        status: 'success',
        data: { message: 'WhatsApp desconectado com sucesso.' },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Erro ao desconectar',
      });
    }
  };
}
