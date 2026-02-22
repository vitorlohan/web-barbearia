/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - Serviços
 */

import api from './api';

export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracaoMinutos: number;
  imagem?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const servicoService = {
  listarPublico: () => api.get<{ status: string; data: Servico[] }>('/servicos/public'),
  listarTodos: () => api.get<{ status: string; data: Servico[] }>('/servicos'),
  buscarPorId: (id: string) => api.get<{ status: string; data: Servico }>(`/servicos/${id}`),
  criar: (data: Partial<Servico>) => api.post<{ status: string; data: Servico }>('/servicos', data),
  atualizar: (id: string, data: Partial<Servico>) => api.put<{ status: string; data: Servico }>(`/servicos/${id}`, data),
  deletar: (id: string) => api.delete(`/servicos/${id}`),
  uploadImagem: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('imagem', file);
    return api.post<{ status: string; data: Servico }>(`/servicos/${id}/imagem`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removerImagem: (id: string) => api.delete<{ status: string; data: Servico }>(`/servicos/${id}/imagem`),
};
