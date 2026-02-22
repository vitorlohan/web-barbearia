/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Modal de Agendamento
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { agendamentoService } from '../../services/agendamentoService';
import { servicoService, Servico } from '../../services/servicoService';
import '../../styles/modal.css';

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  nomeCliente: string;
  telefoneCliente: string;
  servicoId: string;
  data: string;
}

export function AgendamentoModal({ isOpen, onClose }: AgendamentoModalProps) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>();
  const dataSelecionada = watch('data');

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      try {
        const response = await servicoService.listarPublico();
        setServicos(response.data.data);
      } catch {
        setServicos([
          { id: '1', nome: 'Corte de cabelo', descricao: '', preco: 55.90, duracaoMinutos: 40, ativo: true, createdAt: '', updatedAt: '' },
          { id: '2', nome: 'Corte completo', descricao: '', preco: 75.90, duracaoMinutos: 60, ativo: true, createdAt: '', updatedAt: '' },
          { id: '3', nome: 'Corte & Barba', descricao: '', preco: 85.90, duracaoMinutos: 70, ativo: true, createdAt: '', updatedAt: '' },
        ]);
      }
    }
    load();
  }, [isOpen]);

  useEffect(() => {
    if (!dataSelecionada) return;
    
    async function loadHorarios() {
      setLoadingHorarios(true);
      setHorarioSelecionado('');
      try {
        const response = await agendamentoService.horariosDisponiveis(dataSelecionada);
        setHorarios(response.data.data);
      } catch {
        // Fallback com horários padrão
        setHorarios(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']);
      }
      setLoadingHorarios(false);
    }
    loadHorarios();
  }, [dataSelecionada]);

  const onSubmit = async (data: FormData) => {
    if (!horarioSelecionado) {
      toast.warning('Selecione um horário');
      return;
    }

    setLoading(true);
    try {
      await agendamentoService.criar({
        ...data,
        horario: horarioSelecionado,
      });
      setSucesso(true);
      toast.success('Agendamento realizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar agendamento';
      toast.error(message);
    }
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    setHorarioSelecionado('');
    setHorarios([]);
    setSucesso(false);
    onClose();
  };

  if (!isOpen) return null;

  // Tela de sucesso
  if (sucesso) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-sucesso">
            <div className="modal-sucesso-icon">💈</div>
            <h2>Agendamento realizado com sucesso!</h2>
            <p>Você receberá uma confirmação por WhatsApp.</p>
            <button className="btn-voltar" onClick={handleClose}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Data mínima (hoje)
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <FaTimes />
        </button>

        <h2>Agendar horário</h2>

        <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              {...register('nomeCliente', {
                required: 'Nome é obrigatório',
                minLength: { value: 2, message: 'Mín. 2 caracteres' },
              })}
            />
            {errors.nomeCliente && <span className="form-error">{errors.nomeCliente.message}</span>}
          </div>

          <div className="form-group">
            <label>Telefone (WhatsApp)</label>
            <input
              type="tel"
              placeholder="(67) 99999-9999"
              {...register('telefoneCliente', {
                required: 'Telefone é obrigatório',
                minLength: { value: 10, message: 'Telefone inválido' },
              })}
            />
            {errors.telefoneCliente && <span className="form-error">{errors.telefoneCliente.message}</span>}
          </div>

          <div className="form-group">
            <label>Selecione o serviço</label>
            <select
              {...register('servicoId', { required: 'Selecione um serviço' })}
            >
              <option value="">Escolha um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} - R$ {s.preco.toFixed(2).replace('.', ',')}
                </option>
              ))}
            </select>
            {errors.servicoId && <span className="form-error">{errors.servicoId.message}</span>}
          </div>

          <div className="form-group">
            <label>Selecione a data</label>
            <input
              type="date"
              min={hoje}
              {...register('data', { required: 'Data é obrigatória' })}
            />
            {errors.data && <span className="form-error">{errors.data.message}</span>}
          </div>

          {dataSelecionada && (
            <div>
              <p className="horarios-label">Selecione um horário</p>
              {loadingHorarios ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Carregando horários...</p>
              ) : horarios.length === 0 ? (
                <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem' }}>Nenhum horário disponível nesta data</p>
              ) : (
                <div className="horarios-grid">
                  {horarios.map((h) => (
                    <button
                      key={h}
                      type="button"
                      className={`horario-btn ${horarioSelecionado === h ? 'selected' : ''}`}
                      onClick={() => setHorarioSelecionado(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-agendar"
            disabled={loading || !horarioSelecionado}
          >
            {loading ? 'Agendando...' : 'Agendar horário'}
          </button>
        </form>
      </div>
    </div>
  );
}
