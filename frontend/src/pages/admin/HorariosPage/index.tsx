/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Horários Bloqueados (Admin)
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaTrash, FaCalendarTimes } from 'react-icons/fa';
import api from '../../../services/api';

interface HorarioBloqueado {
  id: string;
  data: string;
  horario: string;
  motivo?: string;
  criadoEm: string;
}

export function HorariosPage() {
  const [horarios, setHorarios] = useState<HorarioBloqueado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [motivo, setMotivo] = useState('');

  const loadHorarios = async () => {
    try {
      const response = await api.get('/horarios-bloqueados');
      setHorarios(response.data.data);
    } catch {
      setHorarios([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  const resetForm = () => {
    setData('');
    setHorario('');
    setMotivo('');
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !horario) {
      toast.warning('Preencha data e horário');
      return;
    }

    try {
      await api.post('/horarios-bloqueados', {
        data,
        horario,
        motivo: motivo || undefined,
      });
      toast.success('Horário bloqueado com sucesso!');
      resetForm();
      loadHorarios();
    } catch {
      toast.error('Erro ao bloquear horário');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja desbloquear este horário?')) return;

    try {
      await api.delete(`/horarios-bloqueados/${id}`);
      toast.success('Horário desbloqueado!');
      loadHorarios();
    } catch {
      toast.error('Erro ao desbloquear horário');
    }
  };

  const formatDate = (dateStr: string) => {
    const dateOnly = dateStr.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
  };

  // Gerar opções de horário
  const timeSlots: string[] = [];
  for (let h = 8; h <= 20; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    timeSlots.push(`${String(h).padStart(2, '0')}:30`);
  }

  // Obter data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="admin-header">
        <h1>Horários Bloqueados</h1>
        <button
          className="btn-admin btn-admin-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? <><FaTimes /> Cancelar</> : <><FaPlus /> Bloquear Horário</>}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  value={data}
                  min={today}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Horário *</label>
                <select value={horario} onChange={(e) => setHorario(e.target.value)}>
                  <option value="">Selecione</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Motivo (opcional)</label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Reunião, Almmoço, Manutenção..."
                />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-admin btn-admin-outline" onClick={resetForm}>
                Cancelar
              </button>
              <button type="submit" className="btn-admin btn-admin-primary">
                Bloquear Horário
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de horários bloqueados */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Motivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : horarios.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
                    <FaCalendarTimes size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                    <p>Nenhum horário bloqueado</p>
                  </div>
                </td>
              </tr>
            ) : (
              horarios.map((h) => (
                <tr key={h.id}>
                  <td>{formatDate(h.data)}</td>
                  <td>{h.horario}</td>
                  <td>{h.motivo || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn danger" onClick={() => handleDelete(h.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
