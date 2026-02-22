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
};
