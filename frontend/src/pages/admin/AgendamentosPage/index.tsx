/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Agendamentos (Admin)
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFilter, FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { agendamentoService, Agendamento } from '../../../services/agendamentoService';

export function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const loadAgendamentos = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (filtroStatus) params.status = filtroStatus;
      if (filtroData) params.data = filtroData;

      const response = await agendamentoService.listarTodos(params);
      setAgendamentos(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch {
      setAgendamentos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAgendamentos();
  }, [page, filtroStatus, filtroData]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await agendamentoService.atualizarStatus(id, status);
      toast.success(`Agendamento ${status.toLowerCase()}`);
      loadAgendamentos();
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await agendamentoService.exportarCSV();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exportado com sucesso!');
    } catch {
      toast.error('Erro ao exportar CSV');
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      AGENDADO: 'badge badge-agendado',
      FINALIZADO: 'badge badge-finalizado',
      CANCELADO: 'badge badge-cancelado',
    };
    return classes[status] || 'badge';
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Agendamentos</h1>
        <div className="admin-header-actions">
          <button className="btn-admin btn-admin-outline" onClick={handleExportCSV}>
            <FaDownload /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="admin-filters">
        <FaFilter style={{ color: 'var(--color-text-muted)' }} />
        <select
          value={filtroStatus}
          onChange={(e) => { setFiltroStatus(e.target.value); setPage(1); }}
        >
          <option value="">Todos os status</option>
          <option value="AGENDADO">Agendado</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <input
          type="date"
          value={filtroData}
          onChange={(e) => { setFiltroData(e.target.value); setPage(1); }}
        />
        {(filtroStatus || filtroData) && (
          <button
            className="btn-admin btn-admin-outline btn-admin-sm"
            onClick={() => { setFiltroStatus(''); setFiltroData(''); setPage(1); }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : agendamentos.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Nenhum agendamento encontrado
                </td>
              </tr>
            ) : (
              agendamentos.map((ag) => (
                <tr key={ag.id}>
                  <td>{ag.nomeCliente}</td>
                  <td>{ag.telefoneCliente}</td>
                  <td>{ag.servico?.nome || '-'}</td>
                  <td>{formatDate(ag.data)}</td>
                  <td>{ag.horario}</td>
                  <td><span className={getStatusBadge(ag.status)}>{ag.status}</span></td>
                  <td>
                    <div className="table-actions">
                      {ag.status === 'AGENDADO' && (
                        <>
                          <button
                            className="table-action-btn"
                            title="Finalizar"
                            onClick={() => handleStatusChange(ag.id, 'FINALIZADO')}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="table-action-btn danger"
                            title="Cancelar"
                            onClick={() => handleStatusChange(ag.id, 'CANCELADO')}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={page === p ? 'active' : ''}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
