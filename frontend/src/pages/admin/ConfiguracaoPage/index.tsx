/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Configurações (Admin)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaWhatsapp, FaPlus, FaTimes, FaCircle, FaSyncAlt, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { configuracaoService } from '../../../services/configuracaoService';

interface Configuracao {
  id: string;
  whatsappPrincipal: string;
  whatsappSecundarios: string[];
  enviarLembrete: boolean;
  mensagemPersonalizada?: string;
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
  const [wppConnected, setWppConnected] = useState<boolean | null>(null);
  const [wppInitializing, setWppInitializing] = useState(false);
  const [wppQrCode, setWppQrCode] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [wppError, setWppError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    loadWppStatus();
    return () => stopPolling();
  }, []);

  const loadWppStatus = useCallback(async () => {
    try {
      const response = await configuracaoService.getWhatsAppStatus();
      const { connected, initializing, hasQrCode, error } = response.data.data;
      setWppConnected(connected);
      setWppInitializing(initializing);

      if (connected) {
        setWppQrCode(null);
        setWppError(null);
        setReconnecting(false);
        stopPolling();
        return;
      }

      // Se houve erro, parar polling e mostrar
      if (error && !initializing) {
        setWppError(error);
        setReconnecting(false);
        stopPolling();
        return;
      }

      setWppError(null);

      // Se tem QR Code disponível, buscar
      if (hasQrCode) {
        const qrResponse = await configuracaoService.getWhatsAppQrCode();
        setWppQrCode(qrResponse.data.data.qrCode);
      }

      // Se está inicializando ou tem QR, manter polling
      if (initializing || hasQrCode) {
        startPolling();
      }
    } catch {
      setWppConnected(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      try {
        const response = await configuracaoService.getWhatsAppStatus();
        const { connected, initializing, hasQrCode, error } = response.data.data;
        setWppConnected(connected);
        setWppInitializing(initializing);

        if (connected) {
          setWppQrCode(null);
          setWppError(null);
          setReconnecting(false);
          stopPolling();
          toast.success('WhatsApp conectado!');
          return;
        }

        // Se houve erro, parar polling
        if (error && !initializing) {
          setWppError(error);
          setReconnecting(false);
          stopPolling();
          return;
        }

        if (hasQrCode) {
          setWppError(null);
          const qrResponse = await configuracaoService.getWhatsAppQrCode();
          setWppQrCode(qrResponse.data.data.qrCode);
        }
      } catch {
        // silencioso
      }
    }, 2000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const handleReconnect = async () => {
    setReconnecting(true);
    setWppQrCode(null);
    setWppError(null);
    try {
      await configuracaoService.reconnectWhatsApp();
      toast.info('Reconexão iniciada. Aguarde o QR Code...');
      startPolling();
    } catch {
      toast.error('Erro ao reconectar WhatsApp');
      setReconnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await configuracaoService.disconnectWhatsApp();
      setWppConnected(false);
      setWppQrCode(null);
      toast.success('WhatsApp desconectado!');
    } catch {
      toast.error('Erro ao desconectar WhatsApp');
    }
  };

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
        {/* Status do WhatsApp */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaWhatsapp color="#25D366" /> Status do WhatsApp
          </h3>

          {/* Barra de status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '1rem',
            background: 'var(--color-bg-card)',
            border: `1px solid ${wppConnected ? '#25D366' : 'var(--color-border)'}`,
            borderRadius: '0.5rem',
            marginBottom: wppQrCode || wppInitializing || reconnecting || wppError ? '1rem' : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaCircle
                size={10}
                color={wppConnected === null ? '#8A8A8A' : wppConnected ? '#25D366' : wppInitializing || reconnecting ? '#f39c12' : wppError ? '#dc3545' : '#e74c3c'}
              />
              <span style={{ fontSize: '0.95rem' }}>
                {wppConnected === null
                  ? 'Verificando conexão...'
                  : wppConnected
                    ? 'WhatsApp conectado — Mensagens ativas'
                    : wppInitializing || reconnecting
                      ? 'Aguardando conexão...'
                      : wppError
                        ? 'Erro na conexão'
                        : 'WhatsApp desconectado'}
              </span>
            </div>
            {wppConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  background: 'rgba(220, 53, 69, 0.15)',
                  color: '#dc3545',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <FaSignOutAlt /> Desconectar
              </button>
            )}
            {!wppConnected && !wppInitializing && !reconnecting && !wppError && (
              <button
                type="button"
                onClick={handleReconnect}
                className="btn-admin btn-admin-primary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                <FaSyncAlt /> Conectar
              </button>
            )}
          </div>

          {/* QR Code */}
          {wppQrCode && !wppConnected && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '2rem',
              background: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-border)',
            }}>
              <img
                src={wppQrCode}
                alt="QR Code WhatsApp"
                style={{
                  width: '280px',
                  height: '280px',
                  imageRendering: 'pixelated',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#333', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                  Escaneie com o WhatsApp
                </p>
                <p style={{ color: '#666', fontSize: '0.85rem' }}>
                  Abra o WhatsApp &gt; Menu &gt; Aparelhos conectados &gt; Conectar dispositivo
                </p>
              </div>
            </div>
          )}

          {/* Estado de carregamento */}
          {(wppInitializing || reconnecting) && !wppQrCode && !wppConnected && !wppError && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--color-text-muted)',
              background: 'var(--color-bg-card)',
              borderRadius: '0.5rem',
              border: '1px solid var(--color-border)',
            }}>
              <FaSyncAlt style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} size={24} />
              <p>Iniciando WPPConnect... Aguarde o QR Code.</p>
            </div>
          )}

          {/* Estado de erro */}
          {wppError && !wppConnected && !wppInitializing && !reconnecting && (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(220, 53, 69, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(220, 53, 69, 0.3)',
            }}>
              <FaTimesCircle color="#dc3545" size={28} style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: '#dc3545', fontWeight: 600, marginBottom: '0.5rem' }}>
                Falha ao conectar o WhatsApp
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {wppError}
              </p>
              <button
                onClick={handleReconnect}
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

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
                  ? 'Lembretes ativados — Clientes receberão lembrete 1 hora antes'
                  : 'Lembretes desativados'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensagem Personalizada */}
        <div className="admin-form" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Mensagem Personalizada</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Mensagem de notificação enviada para os números acima quando um novo agendamento é criado.
            Use as variáveis: {'{nome}'}, {'{servico}'}, {'{data}'}, {'{horario}'}, {'{preco}'}
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
