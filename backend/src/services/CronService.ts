/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Cron Jobs (Lembretes automáticos)
 */

import cron from 'node-cron';
import { AgendamentoRepository } from '../repositories';
import { WhatsAppService } from './WhatsAppService';

export class CronService {
  private agendamentoRepository: AgendamentoRepository;
  private whatsAppService: WhatsAppService;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
    this.whatsAppService = new WhatsAppService();
  }

  start() {
    // Executar a cada 30 minutos para verificar lembretes
    cron.schedule('*/30 * * * *', async () => {
      try {
        await this.enviarLembretes();
      } catch (error) {
        console.error('❌ Erro no cron de lembretes:', error);
      }
    });

    console.log('⏰ Cron jobs iniciados');
  }

  private async enviarLembretes() {
    const agora = new Date();
    const trintaMinutosDepois = new Date(agora.getTime() + 30 * 60 * 1000);

    // Arredondar para o slot mais próximo (30 min)
    const minutos = trintaMinutosDepois.getMinutes();
    const minutosArredondados = minutos < 15 ? '00' : minutos < 45 ? '30' : '00';
    const horaFinal = minutosArredondados === '00' && minutos >= 45
      ? String((trintaMinutosDepois.getHours() + 1) % 24).padStart(2, '0')
      : String(trintaMinutosDepois.getHours()).padStart(2, '0');
    
    const horarioArredondado = `${horaFinal}:${minutosArredondados}`;

    const agendamentos = await this.agendamentoRepository.findAgendamentosParaLembrete(
      agora,
      horarioArredondado
    );

    for (const agendamento of agendamentos) {
      try {
        await this.whatsAppService.enviarLembrete(agendamento);
        console.log(`✅ Lembrete enviado para ${agendamento.nomeCliente}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar lembrete para ${agendamento.nomeCliente}:`, error);
      }
    }
  }
}
