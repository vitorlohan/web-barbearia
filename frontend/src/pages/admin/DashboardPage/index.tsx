/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Dashboard (Admin)
 */

import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek, FaClock } from 'react-icons/fa';
import { agendamentoService, DashboardData, Agendamento } from '../../../services/agendamentoService';
import '../../../styles/admin.css';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await agendamentoService.dashboard();
        setStats(response.data.data);
      } catch {
        // Fallback
        setStats({
          totalAgendamentos: 0,
          agendamentosHoje: 0,
          agendamentosSemana: 0,
          proximosAgendamentos: [],
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      AGENDADO: 'badge badge-agendado',
      FINALIZADO: 'badge badge-finalizado',
      CANCELADO: 'badge badge-cancelado',
    };
    return classes[status] || 'badge';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Carregando...</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon gold"><FaCalendarAlt /></div>
          </div>
          <div className="stat-card-value">{stats?.totalAgendamentos || 0}</div>
          <div className="stat-card-label">Total de Agendamentos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon blue"><FaCalendarDay /></div>
          </div>
          <div className="stat-card-value">{stats?.agendamentosHoje || 0}</div>
          <div className="stat-card-label">Agendamentos Hoje</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green"><FaCalendarWeek /></div>
          </div>
          <div className="stat-card-value">{stats?.agendamentosSemana || 0}</div>
          <div className="stat-card-label">Agendamentos esta Semana</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon red"><FaClock /></div>
          </div>
          <div className="stat-card-value">{stats?.proximosAgendamentos?.length || 0}</div>
          <div className="stat-card-label">Próximos Agendamentos</div>
        </div>
      </div>

      {/* Tabela de próximos agendamentos */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>Próximos Agendamentos</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.proximosAgendamentos && stats.proximosAgendamentos.length > 0 ? (
              stats.proximosAgendamentos.map((ag: Agendamento) => (
                <tr key={ag.id}>
                  <td>{ag.nomeCliente}</td>
                  <td>{ag.servico?.nome || '-'}</td>
                  <td>{formatDate(ag.data)}</td>
                  <td>{ag.horario}</td>
                  <td><span className={getStatusBadge(ag.status)}>{ag.status}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Nenhum agendamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
