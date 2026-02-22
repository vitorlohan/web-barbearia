/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Configuração Web
 */

import api from './api';

export interface ConfiguracaoWeb {
  id: string;
  logoHeaderUrl: string | null;
  logoHeaderWidth: number;
  logoHeaderHeight: number;
  logoFooterUrl: string | null;
  logoFooterWidth: number;
  logoFooterHeight: number;
  corPrimaria: string;
  corPrimariaLight: string;
  corBackground: string;
  corBackgroundCard: string;
  corTexto: string;
  corTextoMuted: string;
  corBorda: string;
  sobreTitulo: string | null;
  sobreTexto1: string | null;
  sobreTexto2: string | null;
  sobreImagem1: string | null;
  sobreImagem2: string | null;
  sobreImagem3: string | null;
  sobreHorario: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
}

export interface MembroEquipe {
  id: string;
  nome: string;
  cargo: string | null;
  imagem: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  ordem: number;
  ativo: boolean;
}

export interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  endereco: string | null;
  imagem: string | null;
  ordem: number;
  ativo: boolean;
}

type Res<T> = { status: string; data: T };

export const configWebService = {
  // Config Web
  obter: () => api.get<Res<ConfiguracaoWeb>>('/config-web'),
  obterPublico: () => api.get<Res<ConfiguracaoWeb>>('/config-web/public'),
  atualizar: (data: Partial<ConfiguracaoWeb>) => api.put<Res<ConfiguracaoWeb>>('/config-web', data),

  uploadLogo: (tipo: 'header' | 'footer', file: File) => {
    const formData = new FormData();
    formData.append('imagem', file);
    return api.post<Res<ConfiguracaoWeb>>(`/config-web/logo/${tipo}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadSobreImagem: (posicao: number, file: File) => {
    const formData = new FormData();
    formData.append('imagem', file);
    return api.post<Res<ConfiguracaoWeb>>(`/config-web/sobre-imagem/${posicao}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Equipe
  listarEquipe: () => api.get<Res<MembroEquipe[]>>('/equipe'),
  listarEquipePublico: () => api.get<Res<MembroEquipe[]>>('/equipe/public'),
  criarMembro: (formData: FormData) =>
    api.post<Res<MembroEquipe>>('/equipe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  atualizarMembro: (id: string, formData: FormData) =>
    api.put<Res<MembroEquipe>>(`/equipe/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletarMembro: (id: string) => api.delete(`/equipe/${id}`),

  // Unidades
  listarUnidades: () => api.get<Res<Unidade[]>>('/unidades'),
  listarUnidadesPublico: () => api.get<Res<Unidade[]>>('/unidades/public'),
  criarUnidade: (formData: FormData) =>
    api.post<Res<Unidade>>('/unidades', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  atualizarUnidade: (id: string, formData: FormData) =>
    api.put<Res<Unidade>>(`/unidades/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletarUnidade: (id: string) => api.delete(`/unidades/${id}`),
};
