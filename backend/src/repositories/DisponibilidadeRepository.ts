/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Repository - DisponibilidadeSemanal
 */

import prisma from '../prisma/client';

export class DisponibilidadeRepository {
  async findAll() {
    return prisma.disponibilidadeSemanal.findMany({
      orderBy: { diaSemana: 'asc' },
    });
  }

  async findByDia(diaSemana: number) {
    return prisma.disponibilidadeSemanal.findUnique({
      where: { diaSemana },
    });
  }

  async findAtivos() {
    return prisma.disponibilidadeSemanal.findMany({
      where: { ativo: true },
      orderBy: { diaSemana: 'asc' },
    });
  }

  async upsert(diaSemana: number, data: {
    horaInicio: string;
    horaFim: string;
    intervaloMinutos?: number;
    maxAgendamentos?: number;
    ativo?: boolean;
  }) {
    return prisma.disponibilidadeSemanal.upsert({
      where: { diaSemana },
      update: data,
      create: { diaSemana, ...data },
    });
  }

  async updateAtivo(diaSemana: number, ativo: boolean) {
    return prisma.disponibilidadeSemanal.update({
      where: { diaSemana },
      data: { ativo },
    });
  }

  async delete(diaSemana: number) {
    return prisma.disponibilidadeSemanal.delete({
      where: { diaSemana },
    });
  }

  async salvarTodos(dias: Array<{
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
    intervaloMinutos: number;
    maxAgendamentos: number;
    ativo: boolean;
  }>) {
    const operations = dias.map((dia) =>
      prisma.disponibilidadeSemanal.upsert({
        where: { diaSemana: dia.diaSemana },
        update: {
          horaInicio: dia.horaInicio,
          horaFim: dia.horaFim,
          intervaloMinutos: dia.intervaloMinutos,
          maxAgendamentos: dia.maxAgendamentos,
          ativo: dia.ativo,
        },
        create: dia,
      })
    );

    return prisma.$transaction(operations);
  }
}
