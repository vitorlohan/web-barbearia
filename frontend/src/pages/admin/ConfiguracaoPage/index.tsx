/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Configurações (Admin)
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaWhatsapp, FaPlus, FaTimes } from 'react-icons/fa';
import { configuracaoService } from '../../../services/configuracaoService';

interface Configuracao {
  id: string;
  whatsappPrincipal: string;
  whatsappSecundarios: string[];
  enviarLembrete: boolean;
  mensagemPersonalizada: string;
}

export function ConfiguracaoPage() {
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [whatsappPrincipal, setWhatsappPrincipal] = useState('');
  const [whatsappSecundarios, setWhatsappSecundarios] = useState<string[]>([]);
  const [novoNumero, setNovoNumero] = useState('');
  const [enviarLembrete, setEnviarLembrete] = useState(true);
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('');

  const loadConfig = async () => {
    try {
      const response = await configuracaoService.buscar();
      const data = response.data.data;
      setConfig(data);
      setWhatsappPrincipal(data.whatsappPrincipal || '');
      setWhatsappSecundarios(data.whatsappSecundarios || []);
      setEnviarLembrete(data.enviarLembrete ?? true);
      setMensagemPersonalizada(data.mensagemPersonalizada || '');
    } catch {
      toast.error('Erro ao carregar configurações');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleAddNumero = () => {
    const numero = novoNumero.replace(/\D/g, '');
    if (!numero || numero.length < 10) {
      toast.warning('Digite um número válido com DDD');
      return;
    }
    if (whatsappSecundarios.includes(numero)) {
      toast.warning('Este número já foi adicionado');
      return;
    }
    setWhatsappSecundarios([...whatsappSecundarios, numero]);
    setNovoNumero('');
  };

  const handleRemoveNumero = (index: number) => {
    setWhatsappSecundarios(whatsappSecundarios.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappPrincipal) {
      toast.warning('Preencha o WhatsApp principal');
      return;
    }

    setSaving(true);

    try {
      await configuracaoService.atualizar({
        whatsappPrincipal: whatsappPrincipal.replace(/\D/g, ''),
        whatsappSecundarios,
        enviarLembrete,
        mensagemPersonalizada: mensagemPersonalizada || undefined,
      });
      toast.success('Configurações salvas!');
      loadConfig();
    } catch {
      toast.error('Erro ao salvar configurações');
    }

    setSaving(false);
  };

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
        Carregando configurações...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Configurações</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* WhatsApp Principal */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaWhatsapp color="#25D366" /> WhatsApp Principal
          </h3>
          <div className="form-group">
            <label>Número com DDD (ex: 11999999999)</label>
            <input
              type="text"
              value={whatsappPrincipal}
              onChange={(e) => setWhatsappPrincipal(e.target.value)}
              placeholder="11999999999"
              maxLength={15}
            />
            <small style={{ color: 'var(--color-text-muted)' }}>
              Este número será usado no botão flutuante do WhatsApp no site.
            </small>
          </div>
        </div>

        {/* WhatsApp Secundários - Notificações */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Números para Notificações</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Números que receberão notificações de novos agendamentos via WhatsApp.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={novoNumero}
              onChange={(e) => setNovoNumero(e.target.value)}
              placeholder="11999999999"
              maxLength={15}
              style={{ flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNumero())}
            />
            <button type="button" className="btn-admin btn-admin-primary" onClick={handleAddNumero}>
              <FaPlus /> Adicionar
            </button>
          </div>

          {whatsappSecundarios.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {whatsappSecundarios.map((num, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2rem',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <FaWhatsapp color="#25D366" size={14} />
                  {formatPhone(num)}
                  <button
                    type="button"
                    onClick={() => handleRemoveNumero(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                    }}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lembretes */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Lembretes Automáticos</h3>
          <div className="form-group">
            <div className="toggle-wrapper">
              <div
                className={`toggle ${enviarLembrete ? 'active' : ''}`}
                onClick={() => setEnviarLembrete(!enviarLembrete)}
              />
              <span className="toggle-label">
                {enviarLembrete
                  ? 'Lembretes ativados — Clientes receberão lembrete 30 min antes'
                  : 'Lembretes desativados'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensagem Personalizada */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Mensagem Personalizada</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Mensagem de confirmação enviada ao cliente. Use as variáveis: {'{nome}'}, {'{servico}'}, {'{data}'}, {'{horario}'}, {'{preco}'}
          </p>
          <div className="form-group">
            <textarea
              value={mensagemPersonalizada}
              onChange={(e) => setMensagemPersonalizada(e.target.value)}
              placeholder={`Olá {nome}! 👋\n\nSeu agendamento foi confirmado:\n📋 Serviço: {servico}\n📅 Data: {data}\n⏰ Horário: {horario}\n💰 Valor: {preco}\n\nAguardamos você! 💈`}
              rows={8}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>
            <FaSave /> {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
