/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Serviços da API - ServicoWeb (cards visuais do site)
 */

import api from './api';

export interface ServicoWeb {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string;
  ordem: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const servicoWebService = {
  listarPublico: () => api.get<{ status: string; data: ServicoWeb[] }>('/servicos-web/public'),
  listarTodos: () => api.get<{ status: string; data: ServicoWeb[] }>('/servicos-web'),
  criar: (data: Partial<ServicoWeb>) => api.post<{ status: string; data: ServicoWeb }>('/servicos-web', data),
  atualizar: (id: string, data: Partial<ServicoWeb>) => api.put<{ status: string; data: ServicoWeb }>(`/servicos-web/${id}`, data),
  deletar: (id: string) => api.delete(`/servicos-web/${id}`),
  uploadImagem: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('imagem', file);
    return api.post<{ status: string; data: ServicoWeb }>(`/servicos-web/${id}/imagem`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removerImagem: (id: string) => api.delete<{ status: string; data: ServicoWeb }>(`/servicos-web/${id}/imagem`),
};
