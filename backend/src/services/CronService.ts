/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Cron Jobs (Lembretes automáticos)
 */

import cron from 'node-cron';
import { AgendamentoRepository, ConfiguracaoRepository } from '../repositories';
import { WhatsAppService } from './WhatsAppService';

export class CronService {
  private agendamentoRepository: AgendamentoRepository;
  private configuracaoRepository: ConfiguracaoRepository;
  private whatsAppService: WhatsAppService;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
    this.configuracaoRepository = new ConfiguracaoRepository();
    this.whatsAppService = new WhatsAppService();
  }

  start() {
    // Executar a cada 30 minutos para verificar lembretes (1h antes)
    cron.schedule('*/30 * * * *', async () => {
      try {
        await this.enviarLembretes();
      } catch (error) {
        console.error('❌ Erro no cron de lembretes:', error);
      }
    });

    console.log('⏰ Cron jobs iniciados (lembretes 1h antes)');
  }

  private async enviarLembretes() {
    // Verificar se lembretes estão habilitados
    const config = await this.configuracaoRepository.find();
    if (config && !config.enviarLembrete) return;

    const agora = new Date();
    // Calcular 1 hora à frente
    const umaHoraDepois = new Date(agora.getTime() + 60 * 60 * 1000);

    // Arredondar para o slot mais próximo (30 min)
    const minutos = umaHoraDepois.getMinutes();
    const minutosArredondados = minutos < 15 ? '00' : minutos < 45 ? '30' : '00';
    const horaFinal = minutosArredondados === '00' && minutos >= 45
      ? String((umaHoraDepois.getHours() + 1) % 24).padStart(2, '0')
      : String(umaHoraDepois.getHours()).padStart(2, '0');
    
    const horarioAlvo = `${horaFinal}:${minutosArredondados}`;

    const agendamentos = await this.agendamentoRepository.findAgendamentosParaLembrete(
      agora,
      horarioAlvo
    );

    if (agendamentos.length > 0) {
      console.log(`📱 Encontrados ${agendamentos.length} agendamento(s) para lembrete (${horarioAlvo})`);
    }

    for (const agendamento of agendamentos) {
      try {
        await this.whatsAppService.enviarLembrete(agendamento);
        console.log(`✅ Lembrete enviado para ${agendamento.nomeCliente} (${agendamento.horario})`);
      } catch (error) {
        console.error(`❌ Erro ao enviar lembrete para ${agendamento.nomeCliente}:`, error);
      }
    }
  }
}
