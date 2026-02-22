/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Service - Agendamento
 */

import { AgendamentoRepository, HorarioBloqueadoRepository } from '../repositories';
import { CreateAgendamentoDTO } from '../dtos';
import { AppError } from '../utils/AppError';
import { generateTimeSlots } from '../utils/helpers';
import { WhatsAppService } from './WhatsAppService';
import { ServicoService } from './ServicoService';
import { StatusAgendamento } from '@prisma/client';

export class AgendamentoService {
  private agendamentoRepository: AgendamentoRepository;
  private horarioBloqueadoRepository: HorarioBloqueadoRepository;
  private whatsAppService: WhatsAppService;
  private servicoService: ServicoService;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
    this.horarioBloqueadoRepository = new HorarioBloqueadoRepository();
    this.whatsAppService = new WhatsAppService();
    this.servicoService = new ServicoService();
  }

  async listarTodos(filters?: {
    status?: StatusAgendamento;
    data?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
  }) {
    const parsedFilters: any = {};

    if (filters?.status) parsedFilters.status = filters.status;
    if (filters?.data) parsedFilters.data = new Date(filters.data);
    if (filters?.dataInicio) parsedFilters.dataInicio = new Date(filters.dataInicio);
    if (filters?.dataFim) parsedFilters.dataFim = new Date(filters.dataFim);
    if (filters?.page) parsedFilters.page = filters.page;
    if (filters?.limit) parsedFilters.limit = filters.limit;

    return this.agendamentoRepository.findAll(parsedFilters);
  }

  async buscarPorId(id: string) {
    const agendamento = await this.agendamentoRepository.findById(id);

    if (!agendamento) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    return agendamento;
  }

  async criar(data: CreateAgendamentoDTO) {
    // Verificar se o serviço existe e está ativo
    const servico = await this.servicoService.buscarPorId(data.servicoId);
    if (!servico.ativo) {
      throw new AppError('Serviço não está disponível', 400);
    }

    const dataAgendamento = new Date(data.data);

    // Verificar se a data não é no passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataAgendamento < hoje) {
      throw new AppError('Não é possível agendar em datas passadas', 400);
    }

    // Verificar conflito de horário
    const conflito = await this.agendamentoRepository.findByDataHorario(
      dataAgendamento,
      data.horario
    );

    if (conflito) {
      throw new AppError('Este horário já está ocupado. Escolha outro horário.', 409);
    }

    // Verificar se o horário está bloqueado
    const horariosBloqueados = await this.horarioBloqueadoRepository.getBlockedSlots(dataAgendamento);
    if (horariosBloqueados.includes(data.horario)) {
      throw new AppError('Este horário está bloqueado', 400);
    }

    // Criar agendamento
    const agendamento = await this.agendamentoRepository.create({
      nomeCliente: data.nomeCliente,
      telefoneCliente: data.telefoneCliente,
      servicoId: data.servicoId,
      data: dataAgendamento,
      horario: data.horario,
    });

    // Enviar notificação por WhatsApp (async, sem bloquear resposta)
    this.whatsAppService.enviarNotificacaoAgendamento(agendamento).catch((err) => {
      console.error('❌ Erro ao enviar notificação WhatsApp:', err);
    });

    return agendamento;
  }

  async atualizarStatus(id: string, status: StatusAgendamento) {
    await this.buscarPorId(id);
    return this.agendamentoRepository.updateStatus(id, status);
  }

  async cancelar(id: string) {
    return this.atualizarStatus(id, 'CANCELADO');
  }

  async horariosDisponiveis(data: string) {
    const dataObj = new Date(data);
    
    // Verificar se é dia passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataObj < hoje) {
      return [];
    }

    // Gerar todos os horários possíveis
    const todosHorarios = generateTimeSlots('09:00', '18:00', 30);

    // Buscar horários ocupados
    const ocupados = await this.agendamentoRepository.getOccupiedSlots(dataObj);

    // Buscar horários bloqueados
    const bloqueados = await this.horarioBloqueadoRepository.getBlockedSlots(dataObj);

    // Se é hoje, remover horários passados
    const agora = new Date();
    const isHoje = dataObj.toDateString() === agora.toDateString();

    const disponiveis = todosHorarios.filter((horario) => {
      if (ocupados.includes(horario)) return false;
      if (bloqueados.includes(horario)) return false;

      if (isHoje) {
        const [h, m] = horario.split(':').map(Number);
        const horarioDate = new Date();
        horarioDate.setHours(h, m, 0, 0);
        if (horarioDate <= agora) return false;
      }

      return true;
    });

    return disponiveis;
  }

  async getDashboard() {
    const [totalAgendamentos, agendamentosHoje, agendamentosSemana, proximosAgendamentos] =
      await Promise.all([
        this.agendamentoRepository.countTotal(),
        this.agendamentoRepository.countHoje(),
        this.agendamentoRepository.countSemana(),
        this.agendamentoRepository.findProximos(10),
      ]);

    return {
      totalAgendamentos,
      agendamentosHoje,
      agendamentosSemana,
      proximosAgendamentos,
    };
  }

  async exportarCSV(filters?: { dataInicio?: string; dataFim?: string }) {
    const result = await this.listarTodos({
      ...filters,
      page: 1,
      limit: 10000,
    });

    const header = 'Nome,Telefone,Serviço,Data,Horário,Status\n';
    const rows = result.data
      .map((a: any) => {
        const data = new Date(a.data).toLocaleDateString('pt-BR');
        return `"${a.nomeCliente}","${a.telefoneCliente}","${a.servico.nome}","${data}","${a.horario}","${a.status}"`;
      })
      .join('\n');

    return header + rows;
  }
}
