/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - WhatsApp (Twilio)
 */

import { env } from '../config';
import { ConfiguracaoRepository } from '../repositories';
import { buildWhatsAppMessage, formatDate } from '../utils/helpers';

export class WhatsAppService {
  private configuracaoRepository: ConfiguracaoRepository;
  private client: any;

  constructor() {
    this.configuracaoRepository = new ConfiguracaoRepository();
    
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        this.client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
      } catch {
        console.log('⚠️  Twilio não configurado. Mensagens WhatsApp serão simuladas.');
        this.client = null;
      }
    }
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

  private async enviarMensagem(to: string, body: string) {
    if (!this.client) {
      console.log(`📱 [SIMULADO] Mensagem para ${to}:`);
      console.log(body);
      console.log('---');
      return;
    }

    try {
      const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      await this.client.messages.create({
        from: env.TWILIO_WHATSAPP_FROM,
        to: toNumber,
        body,
      });
      
      console.log(`✅ Mensagem enviada para ${to}`);
    } catch (error: any) {
      console.error(`❌ Erro ao enviar mensagem para ${to}:`, error.message);
    }
  }
}
