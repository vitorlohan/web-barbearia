/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Configuração
 */

import api from './api';

export interface Configuracao {
  id: string;
  whatsappPrincipal: string;
  whatsappSecundarios: string[];
  enviarLembrete: boolean;
  mensagemPersonalizada?: string;
  createdAt: string;
  updatedAt: string;
}

export const configuracaoService = {
  buscar: () =>
    api.get<{ status: string; data: Configuracao }>('/configuracao'),

  atualizar: (data: Partial<Configuracao>) =>
    api.put<{ status: string; data: Configuracao }>('/configuracao', data),

  getWhatsApp: () =>
    api.get<{ status: string; data: { whatsapp: string } }>('/configuracao/whatsapp'),

  getWhatsAppStatus: () =>
    api.get<{ status: string; data: { connected: boolean; initializing: boolean; hasQrCode: boolean; error: string | null } }>('/configuracao/whatsapp-status'),

  getWhatsAppQrCode: () =>
    api.get<{ status: string; data: { qrCode: string | null; connected: boolean; initializing: boolean } }>('/configuracao/whatsapp-qr'),

  reconnectWhatsApp: () =>
    api.post<{ status: string; data: { message: string } }>('/configuracao/whatsapp-reconnect'),

  disconnectWhatsApp: () =>
    api.post<{ status: string; data: { message: string } }>('/configuracao/whatsapp-disconnect'),
};
