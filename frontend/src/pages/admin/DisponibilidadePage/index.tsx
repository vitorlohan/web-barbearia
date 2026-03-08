/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Disponibilidade Semanal (Admin)
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaClock, FaUsers } from 'react-icons/fa';
import { disponibilidadeService, DisponibilidadeSemanal } from '../../../services/disponibilidadeService';

const DIAS_SEMANA = [
  { valor: 0, nome: 'Domingo' },
  { valor: 1, nome: 'Segunda-feira' },
  { valor: 2, nome: 'Terça-feira' },
  { valor: 3, nome: 'Quarta-feira' },
  { valor: 4, nome: 'Quinta-feira' },
  { valor: 5, nome: 'Sexta-feira' },
  { valor: 6, nome: 'Sábado' },
];

const DEFAULT_CONFIG: Omit<DisponibilidadeSemanal, 'diaSemana'> = {
  horaInicio: '09:00',
  horaFim: '18:00',
  intervaloMinutos: 30,
  maxAgendamentos: 1,
  ativo: false,
};

export function DisponibilidadePage() {
  const [dias, setDias] = useState<DisponibilidadeSemanal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDisponibilidade();
  }, []);

  const loadDisponibilidade = async () => {
    try {
      const response = await disponibilidadeService.listarTodos();
      const existentes = response.data.data;

      // Montar array com todos os 7 dias, preenchendo os que não existem
      const completo = DIAS_SEMANA.map((dia) => {
        const existente = existentes.find((e) => e.diaSemana === dia.valor);
        if (existente) return existente;
        return { diaSemana: dia.valor, ...DEFAULT_CONFIG };
      });

      setDias(completo);
    } catch {
      // Se não tem nenhum, inicializar com defaults
      setDias(DIAS_SEMANA.map((dia) => ({ diaSemana: dia.valor, ...DEFAULT_CONFIG })));
    }
    setLoading(false);
  };

  const updateDia = (diaSemana: number, field: keyof DisponibilidadeSemanal, value: any) => {
    setDias((prev) =>
      prev.map((d) => (d.diaSemana === diaSemana ? { ...d, [field]: value } : d))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await disponibilidadeService.salvarTodos(dias);
      toast.success('Disponibilidade salva com sucesso!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao salvar disponibilidade';
      toast.error(msg);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
        Carregando disponibilidade...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Dias & Horários de Funcionamento</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Configure os dias da semana, horários e quantidade de atendimentos simultâneos.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dias.map((dia) => {
            const nomeDia = DIAS_SEMANA.find((d) => d.valor === dia.diaSemana)?.nome || '';

            return (
              <div
                key={dia.diaSemana}
                className="admin-form"
                style={{
                  opacity: dia.ativo ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: dia.ativo ? '1rem' : 0,
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    userSelect: 'none',
                  }}>
                    <input
                      type="checkbox"
                      checked={dia.ativo}
                      onChange={(e) => updateDia(dia.diaSemana, 'ativo', e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                    />
                    {nomeDia}
                  </label>

                  {dia.ativo && (
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-primary)',
                      background: 'rgba(212, 168, 67, 0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                    }}>
                      {dia.horaInicio} - {dia.horaFim} • {dia.maxAgendamentos} vaga{dia.maxAgendamentos > 1 ? 's' : ''}/horário
                    </span>
                  )}
                </div>

                {dia.ativo && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                  }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaClock size={12} /> Hora Início
                      </label>
                      <input
                        type="time"
                        value={dia.horaInicio}
                        onChange={(e) => updateDia(dia.diaSemana, 'horaInicio', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaClock size={12} /> Hora Fim
                      </label>
                      <input
                        type="time"
                        value={dia.horaFim}
                        onChange={(e) => updateDia(dia.diaSemana, 'horaFim', e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Intervalo (min)</label>
                      <select
                        value={dia.intervaloMinutos}
                        onChange={(e) => updateDia(dia.diaSemana, 'intervaloMinutos', Number(e.target.value))}
                      >
                        <option value={15}>15 minutos</option>
                        <option value={20}>20 minutos</option>
                        <option value={30}>30 minutos</option>
                        <option value={45}>45 minutos</option>
                        <option value={60}>60 minutos</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FaUsers size={12} /> Vagas por Horário
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={dia.maxAgendamentos}
                        onChange={(e) => updateDia(dia.diaSemana, 'maxAgendamentos', Number(e.target.value))}
                      />
                      <small style={{ color: 'var(--color-text-muted)' }}>
                        Nº de barbeiros / atendimentos simultâneos
                      </small>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="btn-admin btn-admin-primary"
            disabled={saving}
          >
            <FaSave /> {saving ? 'Salvando...' : 'Salvar Disponibilidade'}
          </button>
        </div>
      </form>
    </div>
  );
}
