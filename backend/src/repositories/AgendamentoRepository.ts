/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - Agendamento
 */

import prisma from '../prisma/client';
import { StatusAgendamento } from '@prisma/client';

export class AgendamentoRepository {
  async findAll(filters?: {
    status?: StatusAgendamento;
    data?: Date;
    dataInicio?: Date;
    dataFim?: Date;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.data) {
      const startOfDay = new Date(filters.data);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.data);
      endOfDay.setHours(23, 59, 59, 999);
      where.data = { gte: startOfDay, lte: endOfDay };
    }

    if (filters?.dataInicio && filters?.dataFim) {
      where.data = { gte: filters.dataInicio, lte: filters.dataFim };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    const [data, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        include: { servico: true },
        orderBy: [{ data: 'asc' }, { horario: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.agendamento.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return prisma.agendamento.findUnique({
      where: { id },
      include: { servico: true },
    });
  }

  async findByDataHorario(data: Date, horario: string) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.agendamento.findFirst({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        horario,
        status: { not: 'CANCELADO' },
      },
    });
  }

  async findAgendamentosDodia(data: Date) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.agendamento.findMany({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELADO' },
      },
      include: { servico: true },
      orderBy: { horario: 'asc' },
    });
  }

  async findProximos(limit: number = 5) {
    const now = new Date();
    return prisma.agendamento.findMany({
      where: {
        data: { gte: now },
        status: 'AGENDADO',
      },
      include: { servico: true },
      orderBy: [{ data: 'asc' }, { horario: 'asc' }],
      take: limit,
    });
  }

  async findAgendamentosParaLembrete(data: Date, horario: string) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.agendamento.findMany({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        horario,
        status: 'AGENDADO',
      },
      include: { servico: true },
    });
  }

  async create(data: {
    nomeCliente: string;
    telefoneCliente: string;
    servicoId: string;
    data: Date;
    horario: string;
  }) {
    return prisma.agendamento.create({
      data,
      include: { servico: true },
    });
  }

  async updateStatus(id: string, status: StatusAgendamento) {
    return prisma.agendamento.update({
      where: { id },
      data: { status },
      include: { servico: true },
    });
  }

  async delete(id: string) {
    return prisma.agendamento.delete({ where: { id } });
  }

  async countTotal() {
    return prisma.agendamento.count();
  }

  async countByStatus(status: StatusAgendamento) {
    return prisma.agendamento.count({ where: { status } });
  }

  async countHoje() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return prisma.agendamento.count({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELADO' },
      },
    });
  }

  async countSemana() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return prisma.agendamento.count({
      where: {
        data: { gte: startOfWeek, lte: endOfWeek },
        status: { not: 'CANCELADO' },
      },
    });
  }

  async getOccupiedSlots(data: Date) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELADO' },
      },
      select: { horario: true },
    });

    return agendamentos.map((a) => a.horario);
  }

  async countByDataHorario(data: Date, horario: string) {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.agendamento.count({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        horario,
        status: { not: 'CANCELADO' },
      },
    });
  }

  async getSlotCounts(data: Date): Promise<Record<string, number>> {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELADO' },
      },
      select: { horario: true },
    });

    const counts: Record<string, number> = {};
    for (const a of agendamentos) {
      counts[a.horario] = (counts[a.horario] || 0) + 1;
    }
    return counts;
  }
}
