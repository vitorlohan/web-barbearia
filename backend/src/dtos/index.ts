/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * DTOs - Validação com Zod
 */

import { z } from 'zod';

// ==================== AUTH ====================
export const loginDTO = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// ==================== SERVICO ====================
export const createServicoDTO = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser positivo'),
  duracaoMinutos: z.number().int().positive('Duração deve ser positiva'),
  imagem: z.string().optional(),
  ativo: z.boolean().optional().default(true),
});

export const updateServicoDTO = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().optional(),
  preco: z.number().positive().optional(),
  duracaoMinutos: z.number().int().positive().optional(),
  imagem: z.string().optional(),
  ativo: z.boolean().optional(),
});

// ==================== AGENDAMENTO ====================
export const createAgendamentoDTO = z.object({
  nomeCliente: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  telefoneCliente: z.string().min(10, 'Telefone inválido'),
  servicoId: z.string().uuid('ID do serviço inválido'),
  data: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  horario: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
});

export const updateAgendamentoStatusDTO = z.object({
  status: z.enum(['AGENDADO', 'CANCELADO', 'FINALIZADO']),
});

// ==================== CONFIGURACAO ====================
export const updateConfiguracaoDTO = z.object({
  whatsappPrincipal: z.string().min(10, 'WhatsApp inválido').optional(),
  whatsappSecundarios: z.array(z.string()).optional(),
  enviarLembrete: z.boolean().optional(),
  mensagemPersonalizada: z.string().optional(),
});

// ==================== HORARIO BLOQUEADO ====================
export const createHorarioBloqueadoDTO = z.object({
  data: z.string().refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  horario: z.string().regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
  motivo: z.string().optional(),
});

// ==================== CONFIGURACAO WEB ====================
export const updateConfiguracaoWebDTO = z.object({
  logoHeaderUrl: z.string().optional().nullable(),
  logoHeaderWidth: z.number().int().positive().optional(),
  logoHeaderHeight: z.number().int().positive().optional(),
  logoFooterUrl: z.string().optional().nullable(),
  logoFooterWidth: z.number().int().positive().optional(),
  logoFooterHeight: z.number().int().positive().optional(),
  corPrimaria: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corPrimariaLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corBackgroundCard: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corTexto: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corTextoMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  corBorda: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  sobreTitulo: z.string().optional().nullable(),
  sobreTexto1: z.string().optional().nullable(),
  sobreTexto2: z.string().optional().nullable(),
  sobreImagem1: z.string().optional().nullable(),
  sobreImagem2: z.string().optional().nullable(),
  sobreImagem3: z.string().optional().nullable(),
  sobreHorario: z.string().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
  facebookUrl: z.string().url().optional().nullable().or(z.literal('')),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal('')),
  twitterUrl: z.string().url().optional().nullable().or(z.literal('')),
});

// ==================== MEMBRO EQUIPE ====================
export const createMembroEquipeDTO = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  cargo: z.string().optional(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

export const updateMembroEquipeDTO = z.object({
  nome: z.string().min(2).optional(),
  cargo: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

// ==================== UNIDADE ====================
export const createUnidadeDTO = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  cidade: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres'),
  endereco: z.string().optional().nullable(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

export const updateUnidadeDTO = z.object({
  nome: z.string().min(2).optional(),
  cidade: z.string().min(2).optional(),
  endereco: z.string().optional().nullable(),
  ordem: z.number().int().optional(),
  ativo: z.boolean().optional(),
});

// ==================== TYPES ====================
export type LoginDTO = z.infer<typeof loginDTO>;
export type CreateServicoDTO = z.infer<typeof createServicoDTO>;
export type UpdateServicoDTO = z.infer<typeof updateServicoDTO>;
export type CreateAgendamentoDTO = z.infer<typeof createAgendamentoDTO>;
export type UpdateAgendamentoStatusDTO = z.infer<typeof updateAgendamentoStatusDTO>;
export type UpdateConfiguracaoDTO = z.infer<typeof updateConfiguracaoDTO>;
export type CreateHorarioBloqueadoDTO = z.infer<typeof createHorarioBloqueadoDTO>;
export type UpdateConfiguracaoWebDTO = z.infer<typeof updateConfiguracaoWebDTO>;
export type CreateMembroEquipeDTO = z.infer<typeof createMembroEquipeDTO>;
export type UpdateMembroEquipeDTO = z.infer<typeof updateMembroEquipeDTO>;
export type CreateUnidadeDTO = z.infer<typeof createUnidadeDTO>;
export type UpdateUnidadeDTO = z.infer<typeof updateUnidadeDTO>;
