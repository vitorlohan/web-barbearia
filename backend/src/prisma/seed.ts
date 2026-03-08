/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Seed - Dados iniciais do banco de dados
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar admin padrão
  const senhaHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@barbearia.com' },
    update: {},
    create: {
      nome: process.env.ADMIN_NAME || 'Administrador',
      email: process.env.ADMIN_EMAIL || 'admin@barbearia.com',
      senha: senhaHash,
    },
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // Criar serviços padrão (apenas se não existirem)
  const servicosExistentes = await prisma.servico.count();

  if (servicosExistentes === 0) {
    const servicos = [
      {
        nome: 'Corte de cabelo',
        descricao: 'Corte masculino moderno com acabamento profissional',
        preco: 55.90,
        duracaoMinutos: 40,
        ativo: true,
      },
      {
        nome: 'Corte completo',
        descricao: 'Corte completo com lavagem, secagem e finalização',
        preco: 75.90,
        duracaoMinutos: 60,
        ativo: true,
      },
      {
        nome: 'Corte & Barba',
        descricao: 'Combo de corte de cabelo com barba completa',
        preco: 85.90,
        duracaoMinutos: 70,
        ativo: true,
      },
      {
        nome: 'Barba',
        descricao: 'Barba feita com navalha e toalha quente',
        preco: 35.90,
        duracaoMinutos: 30,
        ativo: true,
      },
      {
        nome: 'Sobrancelha',
        descricao: 'Design de sobrancelha masculina',
        preco: 15.00,
        duracaoMinutos: 15,
        ativo: true,
      },
    ];

    for (const servico of servicos) {
      await prisma.servico.create({ data: servico });
    }
    console.log(`✅ ${servicos.length} serviços criados`);
  } else {
    console.log(`⏩ ${servicosExistentes} serviços já existem, pulando...`);
  }

  // Criar configuração padrão (apenas se não existir)
  const configExistente = await prisma.configuracao.findFirst();

  if (!configExistente) {
    const config = await prisma.configuracao.create({
      data: {
        whatsappPrincipal: '+5567999999999',
        whatsappSecundarios: [],
        enviarLembrete: true,
        mensagemPersonalizada: '📋 *Novo Agendamento!*\n\n👤 Cliente: {nome}\n💇 Serviço: {servico}\n📅 Data: {data}\n🕐 Horário: {horario}\n📱 Telefone: {telefone}',
      },
    });
    console.log(`✅ Configuração criada: ${config.id}`);
  } else {
    console.log('⏩ Configuração já existe, pulando...');
  }

  // Criar configuração web padrão (apenas se não existir)
  const configWebExistente = await prisma.configuracaoWeb.findFirst();

  if (!configWebExistente) {
    await prisma.configuracaoWeb.create({
      data: {
        corPrimaria: '#D4A843',
        corPrimariaLight: '#E8C76A',
        corBackground: '#0D0D0D',
        corBackgroundCard: '#1A1A1A',
        corTexto: '#F5F5F5',
        corTextoMuted: '#8A8A8A',
        corBorda: '#2A2A2A',
        sobreTitulo: 'Tradição e Estilo desde 2010',
        sobreTexto1: 'A Navalha de Ouro nasceu da paixão pela arte da barbearia. Com mais de uma década de experiência, nos tornamos referência em cuidados masculinos, unindo técnicas tradicionais com as tendências mais modernas.',
        sobreTexto2: 'Nosso compromisso é oferecer uma experiência única a cada visita. Cada detalhe do nosso espaço foi pensado para proporcionar conforto e relaxamento enquanto nossos profissionais trabalham para realçar o seu melhor.',
        sobreHorario: 'Seg à Sex: 9h às 20h | Sáb: 8h às 18h',
        instagramUrl: 'https://instagram.com/navalhadeourobarbearia',
      },
    });
    console.log('✅ Configuração web criada');
  } else {
    console.log('⏩ Configuração web já existe, pulando...');
  }

  // Criar membros de equipe padrão (apenas se não existirem)
  const membrosExistentes = await prisma.membroEquipe.count();

  if (membrosExistentes === 0) {
    const membros = [
      { nome: 'Carlos Silva', cargo: 'Master Barber', ordem: 1 },
      { nome: 'André Santos', cargo: 'Barber', ordem: 2 },
      { nome: 'Lucas Oliveira', cargo: 'Barber', ordem: 3 },
    ];

    for (const membro of membros) {
      await prisma.membroEquipe.create({ data: membro });
    }
    console.log(`✅ ${membros.length} membros da equipe criados`);
  } else {
    console.log(`⏩ ${membrosExistentes} membros já existem, pulando...`);
  }

  // Criar unidades padrão (apenas se não existirem)
  const unidadesExistentes = await prisma.unidade.count();

  if (unidadesExistentes === 0) {
    const unidades = [
      { nome: 'Unidade Centro', cidade: 'Campo Grande - MS', endereco: 'Rua 14 de Julho, 1234', ordem: 1 },
      { nome: 'Unidade Shopping', cidade: 'Campo Grande - MS', endereco: 'Shopping Campo Grande, Loja 42', ordem: 2 },
    ];

    for (const unidade of unidades) {
      await prisma.unidade.create({ data: unidade });
    }
    console.log(`✅ ${unidades.length} unidades criadas`);
  } else {
    console.log(`⏩ ${unidadesExistentes} unidades já existem, pulando...`);
  }

  // Criar disponibilidade semanal padrão (apenas se não existir)
  const disponibilidadeExistente = await prisma.disponibilidadeSemanal.count();

  if (disponibilidadeExistente === 0) {
    const diasPadrao = [
      { diaSemana: 0, horaInicio: '09:00', horaFim: '18:00', intervaloMinutos: 30, maxAgendamentos: 1, ativo: false }, // Domingo
      { diaSemana: 1, horaInicio: '09:00', horaFim: '20:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Segunda
      { diaSemana: 2, horaInicio: '09:00', horaFim: '20:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Terça
      { diaSemana: 3, horaInicio: '09:00', horaFim: '20:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Quarta
      { diaSemana: 4, horaInicio: '09:00', horaFim: '20:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Quinta
      { diaSemana: 5, horaInicio: '09:00', horaFim: '20:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Sexta
      { diaSemana: 6, horaInicio: '08:00', horaFim: '18:00', intervaloMinutos: 30, maxAgendamentos: 2, ativo: true },  // Sábado
    ];

    for (const dia of diasPadrao) {
      await prisma.disponibilidadeSemanal.create({ data: dia });
    }
    console.log('✅ Disponibilidade semanal criada (Seg-Sáb ativo, Dom fechado)');
  } else {
    console.log(`⏩ ${disponibilidadeExistente} disponibilidades já existem, pulando...`);
  }

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
