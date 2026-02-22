/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - WhatsApp (WPPConnect)
 */

import wppconnect from '@wppconnect-team/wppconnect';
import path from 'path';
import { ConfiguracaoRepository } from '../repositories';
import { buildWhatsAppMessage, formatDate } from '../utils/helpers';

export class WhatsAppService {
  private static client: wppconnect.Whatsapp | null = null;
  private static initializing = false;
  private static ready = false;
  private static qrCode: string | null = null;
  private configuracaoRepository: ConfiguracaoRepository;

  constructor() {
    this.configuracaoRepository = new ConfiguracaoRepository();
  }

  /**
   * Inicializa a sessão do WPPConnect (singleton).
   * Gera QR Code acessível via API para escanear pelo painel admin.
   * A sessão é salva em disco para reconexão automática.
   */
  static async inicializar(): Promise<void> {
    if (WhatsAppService.client || WhatsAppService.initializing) return;
    WhatsAppService.initializing = true;
    WhatsAppService.qrCode = null;

    try {
      console.log('');
      console.log('📱 Iniciando WPPConnect...');
      console.log('📱 Acesse o painel admin > Configurações para escanear o QR Code');
      console.log('');

      const client = await wppconnect.create({
        session: 'barbearia-session',
        folderNameToken: path.resolve(__dirname, '..', '..', 'tokens'),
        headless: true,
        autoClose: 0,
        puppeteerOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        logQR: false,
        catchQR: (base64Qr) => {
          // Armazena o QR code em base64 para servir via API
          WhatsAppService.qrCode = base64Qr;
          console.log('📱 QR Code gerado — disponível no painel admin');
        },
        statusFind: (statusSession) => {
          console.log(`📱 Status da sessão: ${statusSession}`);
          if (statusSession === 'inChat' || statusSession === 'isLogged') {
            WhatsAppService.qrCode = null; // Limpa QR ao conectar
          }
        },
      });

      WhatsAppService.client = client;
      WhatsAppService.ready = true;
      WhatsAppService.initializing = false;
      WhatsAppService.qrCode = null;

      console.log('✅ WPPConnect conectado com sucesso!');
      console.log('');
    } catch (error: any) {
      WhatsAppService.initializing = false;
      WhatsAppService.ready = false;
      console.error('❌ Erro ao inicializar WPPConnect:', error.message);
      console.log('⚠️  Mensagens serão simuladas no console até reconectar.');
    }
  }

  /** Retorna true se o WPPConnect está conectado */
  static isConnected(): boolean {
    return WhatsAppService.ready && WhatsAppService.client !== null;
  }

  /** Retorna o QR Code em base64 (ou null se já conectado/não disponível) */
  static getQrCode(): string | null {
    return WhatsAppService.qrCode;
  }

  /** Retorna true se está no processo de inicialização */
  static isInitializing(): boolean {
    return WhatsAppService.initializing;
  }

  /** Desconecta a sessão ativa e permite reconectar */
  static async desconectar(): Promise<void> {
    if (WhatsAppService.client) {
      try {
        await WhatsAppService.client.logout();
      } catch {
        // ignora erro de logout
      }
      try {
        await WhatsAppService.client.close();
      } catch {
        // ignora erro de close
      }
    }
    WhatsAppService.client = null;
    WhatsAppService.ready = false;
    WhatsAppService.initializing = false;
    WhatsAppService.qrCode = null;
  }

  /** Desconecta e reinicia o WPPConnect (gera novo QR Code) */
  static async reconectar(): Promise<void> {
    await WhatsAppService.desconectar();
    // Remove tokens salvos para forçar novo QR
    const fs = await import('fs');
    const tokensPath = path.resolve(__dirname, '..', '..', 'tokens');
    if (fs.existsSync(tokensPath)) {
      fs.rmSync(tokensPath, { recursive: true, force: true });
    }
    // Reinicia em background (não bloqueia)
    WhatsAppService.inicializar().catch((err) => {
      console.error('❌ Erro ao reconectar WPPConnect:', err.message);
    });
  }

  async enviarNotificacaoAgendamento(agendamento: {
    nomeCliente: string;
    telefoneCliente: string;
    servico: { nome: string; preco?: number };
    data: Date;
    horario: string;
  }) {
    const config = await this.configuracaoRepository.find();

    if (!config) {
      console.log('⚠️  Configuração não encontrada. Notificação não enviada.');
      return;
    }

    const preco = agendamento.servico.preco 
      ? agendamento.servico.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';

    const messageData = {
      nome: agendamento.nomeCliente,
      servico: agendamento.servico.nome,
      data: formatDate(agendamento.data),
      horario: agendamento.horario,
      telefone: agendamento.telefoneCliente,
      preco,
    };

    const template = config.mensagemPersonalizada || 
      '📋 *Novo Agendamento!*\n\n👤 Cliente: {nome}\n💇 Serviço: {servico}\n📅 Data: {data}\n🕐 Horário: {horario}\n📱 Telefone: {telefone}';

    const message = buildWhatsAppMessage(template, messageData);

    // Enviar para o WhatsApp principal
    await this.enviarMensagem(config.whatsappPrincipal, message);

    // Enviar para WhatsApps secundários
    if (config.whatsappSecundarios && config.whatsappSecundarios.length > 0) {
      for (const numero of config.whatsappSecundarios) {
        await this.enviarMensagem(numero, message);
      }
    }
  }

  async enviarLembrete(agendamento: {
    nomeCliente: string;
    telefoneCliente: string;
    servico: { nome: string };
    data: Date;
    horario: string;
  }) {
    const message = `⏰ *Lembrete de Agendamento!*\n\nOlá ${agendamento.nomeCliente}!\n\nSeu agendamento é hoje às ${agendamento.horario}.\n💇 Serviço: ${agendamento.servico.nome}\n\nTe esperamos! 💈`;

    await this.enviarMensagem(agendamento.telefoneCliente, message);
  }

  /**
   * Formata o número para o padrão internacional do WhatsApp.
   * Aceita: 67999999999, (67)99999-9999, +5567999999999, 5567999999999
   * Retorna: 5567999999999@c.us
   */
  private formatarNumero(telefone: string): string {
    // Remove tudo que não é dígito
    let numero = telefone.replace(/\D/g, '');

    // Se não começa com 55 (Brasil), adiciona
    if (!numero.startsWith('55')) {
      numero = `55${numero}`;
    }

    return `${numero}@c.us`;
  }

  private async enviarMensagem(to: string, body: string) {
    if (!WhatsAppService.isConnected()) {
      console.log(`📱 [SIMULADO] Mensagem para ${to}:`);
      console.log(body);
      console.log('---');
      return;
    }

    try {
      const chatId = this.formatarNumero(to);
      await WhatsAppService.client!.sendText(chatId, body);
      console.log(`✅ Mensagem WhatsApp enviada para ${to}`);
    } catch (error: any) {
      console.error(`❌ Erro ao enviar mensagem para ${to}:`, error.message);
    }
  }
}
