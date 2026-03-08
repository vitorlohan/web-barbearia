/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Serviços (Admin)
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { servicoService, Servico } from '../../../services/servicoService';

export function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);

  // Form state
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [ativo, setAtivo] = useState(true);

  const loadServicos = async () => {
    try {
      const response = await servicoService.listarTodos();
      setServicos(response.data.data);
    } catch {
      setServicos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServicos();
  }, []);

  const resetForm = () => {
    setNome('');
    setPreco('');
    setDuracaoMinutos('');
    setAtivo(true);
    setEditando(null);
    setShowForm(false);
  };

  const handleEdit = (servico: Servico) => {
    setEditando(servico);
    setNome(servico.nome);
    setPreco(String(servico.preco));
    setDuracaoMinutos(String(servico.duracaoMinutos));
    setAtivo(servico.ativo);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !preco || !duracaoMinutos) {
      toast.warning('Preencha os campos obrigatórios');
      return;
    }

    const data = {
      nome,
      preco: Number(preco),
      duracaoMinutos: Number(duracaoMinutos),
      ativo,
    };

    try {
      if (editando) {
        await servicoService.atualizar(editando.id, data);
        toast.success('Serviço atualizado!');
      } else {
        await servicoService.criar(data);
        toast.success('Serviço criado!');
      }
      resetForm();
      loadServicos();
    } catch {
      toast.error('Erro ao salvar serviço');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;

    try {
      await servicoService.deletar(id);
      toast.success('Serviço deletado!');
      loadServicos();
    } catch {
      toast.error('Erro ao deletar serviço');
    }
  };

  const formatPreco = (preco: number) =>
    preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      <div className="admin-header">
        <h1>Serviços</h1>
        <button
          className="btn-admin btn-admin-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? <><FaTimes /> Cancelar</> : <><FaPlus /> Novo Serviço</>}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Corte de cabelo"
                />
              </div>
              <div className="form-group">
                <label>Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="55.90"
                />
              </div>
              <div className="form-group">
                <label>Duração (minutos) *</label>
                <input
                  type="number"
                  value={duracaoMinutos}
                  onChange={(e) => setDuracaoMinutos(e.target.value)}
                  placeholder="40"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <div className="toggle-wrapper" style={{ marginTop: '0.5rem' }}>
                  <div
                    className={`toggle ${ativo ? 'active' : ''}`}
                    onClick={() => setAtivo(!ativo)}
                  />
                  <span className="toggle-label">{ativo ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-admin btn-admin-outline" onClick={resetForm}>
                Cancelar
              </button>
              <button type="submit" className="btn-admin btn-admin-primary">
                {editando ? 'Atualizar' : 'Criar Serviço'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Duração</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : servicos.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Nenhum serviço cadastrado
                </td>
              </tr>
            ) : (
              servicos.map((s) => (
                <tr key={s.id}>
                  <td>{s.nome}</td>
                  <td>{formatPreco(s.preco)}</td>
                  <td>{s.duracaoMinutos} min</td>
                  <td>
                    <span className={`badge ${s.ativo ? 'badge-finalizado' : 'badge-cancelado'}`}>
                      {s.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleEdit(s)}>
                        <FaEdit />
                      </button>
                      <button className="table-action-btn danger" onClick={() => handleDelete(s.id)}>
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
