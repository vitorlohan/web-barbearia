/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Configuração Web (Admin) - Painel completo
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  FaSave,
  FaPalette,
  FaImage,
  FaUsers,
  FaMapMarkerAlt,
  FaShareAlt,
  FaInfoCircle,
  FaUpload,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaCut,
} from 'react-icons/fa';
import {
  configWebService,
  ConfiguracaoWeb,
  MembroEquipe,
  Unidade,
} from '../../../services/configWebService';
import { servicoWebService, ServicoWeb } from '../../../services/servicoWebService';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';
import { applyColorPalette } from '../../../hooks/useColorPalette';
import '../../../styles/configWeb.css';

type Tab = 'logo' | 'cores' | 'sobre' | 'equipe' | 'unidades' | 'social' | 'servicos';

const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: 'logo', label: 'Logo', icon: <FaImage /> },
  { id: 'cores', label: 'Cores', icon: <FaPalette /> },
  { id: 'sobre', label: 'Sobre', icon: <FaInfoCircle /> },
  { id: 'servicos', label: 'Serviços', icon: <FaCut /> },
  { id: 'equipe', label: 'Equipe', icon: <FaUsers /> },
  { id: 'unidades', label: 'Unidades', icon: <FaMapMarkerAlt /> },
  { id: 'social', label: 'Redes Sociais', icon: <FaShareAlt /> },
];

export function ConfigWebPage() {
  const [activeTab, setActiveTab] = useState<Tab>('logo');
  const [config, setConfig] = useState<ConfiguracaoWeb | null>(null);
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [servicos, setServicos] = useState<ServicoWeb[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ConfiguracaoWeb>>({});

  // Modal states
  const [membroModal, setMembroModal] = useState<{ open: boolean; membro?: MembroEquipe }>({ open: false });
  const [unidadeModal, setUnidadeModal] = useState<{ open: boolean; unidade?: Unidade }>({ open: false });
  const [servicoModal, setServicoModal] = useState<{ open: boolean; servico?: ServicoWeb }>({ open: false });

  const loadData = useCallback(async () => {
    try {
      const [configRes, equipeRes, unidadesRes, servicosRes] = await Promise.all([
        configWebService.obter(),
        configWebService.listarEquipe(),
        configWebService.listarUnidades(),
        servicoWebService.listarTodos(),
      ]);
      const c = configRes.data.data;
      setConfig(c);
      setFormData(c);
      setMembros(equipeRes.data.data);
      setUnidades(unidadesRes.data.data);
      setServicos(servicosRes.data.data);
    } catch {
      toast.error('Erro ao carregar configurações');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { reloadConfig } = useSiteConfig();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Enviar apenas campos editáveis (sem id, createdAt, updatedAt)
      const { id, createdAt, updatedAt, ...editableData } = formData as any;
      const res = await configWebService.atualizar(editableData);
      setConfig(res.data.data);
      setFormData(res.data.data);

      // Aplicar cores imediatamente + atualizar contexto global
      applyColorPalette(res.data.data);
      reloadConfig();

      toast.success('Configurações salvas com sucesso!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="config-web-page" style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="config-web-page">
      <div className="admin-page-header">
        <h1>⚙️ Configuração Web</h1>
      </div>

      <div className="config-web-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`config-web-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'logo' && (
        <TabLogo config={config} formData={formData} onChange={handleChange} onReload={loadData} />
      )}
      {activeTab === 'cores' && (
        <TabCores formData={formData} onChange={handleChange} onSave={handleSave} saving={saving} />
      )}
      {activeTab === 'sobre' && (
        <TabSobre config={config} formData={formData} onChange={handleChange} onSave={handleSave} saving={saving} onReload={loadData} />
      )}
      {activeTab === 'servicos' && (
        <TabServicos servicos={servicos} servicoModal={servicoModal} setServicoModal={setServicoModal} onReload={loadData} />
      )}
      {activeTab === 'equipe' && (
        <TabEquipe membros={membros} modal={membroModal} setModal={setMembroModal} onReload={loadData} />
      )}
      {activeTab === 'unidades' && (
        <TabUnidades unidades={unidades} modal={unidadeModal} setModal={setUnidadeModal} onReload={loadData} />
      )}
      {activeTab === 'social' && (
        <TabSocial formData={formData} onChange={handleChange} onSave={handleSave} saving={saving} />
      )}
    </div>
  );
}

/* ============== TAB: LOGO ============== */
function TabLogo({
  config,
  formData,
  onChange,
  onReload,
}: {
  config: ConfiguracaoWeb | null;
  formData: Partial<ConfiguracaoWeb>;
  onChange: (f: string, v: string | number | null) => void;
  onReload: () => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);
  const headerRef = useRef<HTMLInputElement>(null);
  const footerRef = useRef<HTMLInputElement>(null);

  const handleUploadLogo = async (tipo: 'header' | 'footer', file: File) => {
    setUploading(tipo);
    try {
      await configWebService.uploadLogo(tipo, file);
      toast.success(`Logo ${tipo} atualizada!`);
      onReload();
    } catch {
      toast.error('Erro ao fazer upload do logo');
    }
    setUploading(null);
  };

  return (
    <div className="config-web-form-section">
      <h3>Logo do Header</h3>
      <div className="config-web-image-upload">
        <div className="config-web-logo-preview">
          {config?.logoHeaderUrl ? (
            <img src={config.logoHeaderUrl} alt="Logo header" />
          ) : (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Sem logo</span>
          )}
        </div>
        <input
          ref={headerRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUploadLogo('header', f);
          }}
        />
        <button
          className={`upload-btn ${uploading === 'header' ? 'uploading' : ''}`}
          onClick={() => headerRef.current?.click()}
        >
          <FaUpload />
          {uploading === 'header' ? 'Enviando...' : 'Enviar logo header'}
        </button>

        <div className="config-web-form-grid" style={{ marginTop: '0.75rem' }}>
          <div className="config-web-form-group">
            <label>Largura (px)</label>
            <input
              type="number"
              value={formData.logoHeaderWidth || 150}
              onChange={(e) => onChange('logoHeaderWidth', parseInt(e.target.value) || 150)}
            />
          </div>
          <div className="config-web-form-group">
            <label>Altura (px)</label>
            <input
              type="number"
              value={formData.logoHeaderHeight || 50}
              onChange={(e) => onChange('logoHeaderHeight', parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Logo do Footer</h3>
      <div className="config-web-image-upload">
        <div className="config-web-logo-preview">
          {config?.logoFooterUrl ? (
            <img src={config.logoFooterUrl} alt="Logo footer" />
          ) : (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Sem logo</span>
          )}
        </div>
        <input
          ref={footerRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUploadLogo('footer', f);
          }}
        />
        <button
          className={`upload-btn ${uploading === 'footer' ? 'uploading' : ''}`}
          onClick={() => footerRef.current?.click()}
        >
          <FaUpload />
          {uploading === 'footer' ? 'Enviando...' : 'Enviar logo footer'}
        </button>

        <div className="config-web-form-grid" style={{ marginTop: '0.75rem' }}>
          <div className="config-web-form-group">
            <label>Largura (px)</label>
            <input
              type="number"
              value={formData.logoFooterWidth || 150}
              onChange={(e) => onChange('logoFooterWidth', parseInt(e.target.value) || 150)}
            />
          </div>
          <div className="config-web-form-group">
            <label>Altura (px)</label>
            <input
              type="number"
              value={formData.logoFooterHeight || 50}
              onChange={(e) => onChange('logoFooterHeight', parseInt(e.target.value) || 50)}
            />
          </div>
        </div>
      </div>

      <div className="config-web-save-bar">
        <button className="config-web-save-btn" onClick={async () => {
          try {
            await configWebService.atualizar({
              logoHeaderWidth: formData.logoHeaderWidth,
              logoHeaderHeight: formData.logoHeaderHeight,
              logoFooterWidth: formData.logoFooterWidth,
              logoFooterHeight: formData.logoFooterHeight,
            });
            toast.success('Dimensões salvas!');
          } catch {
            toast.error('Erro ao salvar');
          }
        }}>
          <FaSave />
          Salvar dimensões
        </button>
      </div>
    </div>
  );
}

/* ============== TAB: CORES ============== */
function TabCores({
  formData,
  onChange,
  onSave,
  saving,
}: {
  formData: Partial<ConfiguracaoWeb>;
  onChange: (f: string, v: string | number | null) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const colors = [
    { field: 'corPrimaria', label: 'Primária (Ouro)' },
    { field: 'corPrimariaLight', label: 'Primária Light' },
    { field: 'corBackground', label: 'Background' },
    { field: 'corBackgroundCard', label: 'Background Card' },
    { field: 'corTexto', label: 'Texto' },
    { field: 'corTextoMuted', label: 'Texto Muted' },
    { field: 'corBorda', label: 'Borda' },
  ];

  return (
    <div className="config-web-form-section">
      <h3>Paleta de Cores</h3>

      <div className="config-web-palette-preview">
        {colors.map((c) => (
          <div
            key={c.field}
            className="config-web-palette-swatch"
            style={{ background: (formData as any)[c.field] || '#000' }}
          >
            <span>{c.label.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div className="config-web-form-grid" style={{ marginTop: '1.5rem' }}>
        {colors.map((c) => (
          <div key={c.field} className="config-web-form-group">
            <label>{c.label}</label>
            <div className="config-web-color-row">
              <input
                type="color"
                value={(formData as any)[c.field] || '#000000'}
                onChange={(e) => onChange(c.field, e.target.value)}
              />
              <input
                type="text"
                value={(formData as any)[c.field] || ''}
                onChange={(e) => onChange(c.field, e.target.value)}
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="config-web-save-bar">
        <button className="config-web-save-btn" onClick={onSave} disabled={saving}>
          <FaSave />
          {saving ? 'Salvando...' : 'Salvar cores'}
        </button>
      </div>
    </div>
  );
}

/* ============== TAB: SOBRE ============== */
function TabSobre({
  config,
  formData,
  onChange,
  onSave,
  saving,
  onReload,
}: {
  config: ConfiguracaoWeb | null;
  formData: Partial<ConfiguracaoWeb>;
  onChange: (f: string, v: string | number | null) => void;
  onSave: () => void;
  saving: boolean;
  onReload: () => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleUploadImagem = async (posicao: number, file: File) => {
    setUploading(posicao);
    try {
      await configWebService.uploadSobreImagem(posicao, file);
      toast.success(`Imagem ${posicao} atualizada!`);
      onReload();
    } catch {
      toast.error('Erro ao fazer upload da imagem');
    }
    setUploading(null);
  };

  const imagens = [config?.sobreImagem1, config?.sobreImagem2, config?.sobreImagem3];

  return (
    <div className="config-web-form-section">
      <h3>Seção Sobre</h3>

      <div className="config-web-form-grid">
        <div className="config-web-form-group full-width">
          <label>Subtítulo</label>
          <input
            type="text"
            value={formData.sobreTitulo || ''}
            onChange={(e) => onChange('sobreTitulo', e.target.value)}
            placeholder="Tradição e Estilo desde 2010"
          />
        </div>
        <div className="config-web-form-group full-width">
          <label>Texto 1</label>
          <textarea
            value={formData.sobreTexto1 || ''}
            onChange={(e) => onChange('sobreTexto1', e.target.value)}
            placeholder="Primeiro parágrafo da seção sobre..."
            rows={4}
          />
        </div>
        <div className="config-web-form-group full-width">
          <label>Texto 2</label>
          <textarea
            value={formData.sobreTexto2 || ''}
            onChange={(e) => onChange('sobreTexto2', e.target.value)}
            placeholder="Segundo parágrafo da seção sobre..."
            rows={4}
          />
        </div>
        <div className="config-web-form-group">
          <label>Horário de funcionamento</label>
          <input
            type="text"
            value={formData.sobreHorario || ''}
            onChange={(e) => onChange('sobreHorario', e.target.value)}
            placeholder="Seg à Sex: 9h às 20h | Sáb: 8h às 18h"
          />
        </div>
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>Imagens da Seção Sobre</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[1, 2, 3].map((pos) => (
          <div key={pos} className="config-web-image-upload">
            <div className="config-web-image-preview">
              {imagens[pos - 1] ? (
                <img src={imagens[pos - 1]!} alt={`Sobre ${pos}`} />
              ) : (
                <div className="placeholder">
                  <FaImage />
                  Imagem {pos}
                </div>
              )}
            </div>
            <input
              ref={fileRefs[pos - 1]}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadImagem(pos, f);
              }}
            />
            <button
              className={`upload-btn ${uploading === pos ? 'uploading' : ''}`}
              onClick={() => fileRefs[pos - 1].current?.click()}
            >
              <FaUpload />
              {uploading === pos ? 'Enviando...' : `Imagem ${pos}`}
            </button>
          </div>
        ))}
      </div>

      <div className="config-web-save-bar">
        <button className="config-web-save-btn" onClick={onSave} disabled={saving}>
          <FaSave />
          {saving ? 'Salvando...' : 'Salvar textos'}
        </button>
      </div>
    </div>
  );
}

/* ============== TAB: EQUIPE ============== */
function TabEquipe({
  membros,
  modal,
  setModal,
  onReload,
}: {
  membros: MembroEquipe[];
  modal: { open: boolean; membro?: MembroEquipe };
  setModal: (m: { open: boolean; membro?: MembroEquipe }) => void;
  onReload: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      await configWebService.deletarMembro(id);
      toast.success('Membro excluído');
      onReload();
    } catch {
      toast.error('Erro ao excluir membro');
    }
  };

  return (
    <div className="config-web-form-section">
      <div className="config-web-crud-header">
        <h3>Membros da Equipe</h3>
        <button className="config-web-add-btn" onClick={() => setModal({ open: true })}>
          <FaPlus />
          Novo membro
        </button>
      </div>

      <div className="config-web-size-hint">
        Tamanho recomendado da imagem: <strong>480 × 560 px</strong> (proporção 240×280). Formatos: JPG, PNG ou WebP.
      </div>

      <div className="config-web-crud-list">
        {membros.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Nenhum membro cadastrado.
          </p>
        )}
        {membros.map((m) => (
          <div key={m.id} className="config-web-crud-item">
            <div className="config-web-crud-item-img">
              {m.imagem ? (
                <img src={m.imagem} alt={m.nome} />
              ) : (
                <FaUser className="no-img" />
              )}
            </div>
            <div className="config-web-crud-item-info">
              <h4>{m.nome}</h4>
              <p>{m.cargo || 'Sem cargo'} · Ordem: {m.ordem}</p>
            </div>
            <span className={m.ativo ? 'badge-active' : 'badge-inactive'}>
              {m.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <div className="config-web-crud-item-actions">
              <button onClick={() => setModal({ open: true, membro: m })} title="Editar">
                <FaEdit />
              </button>
              <button className="delete" onClick={() => handleDelete(m.id)} title="Excluir">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <MembroEquipeModal
          membro={modal.membro}
          onClose={() => setModal({ open: false })}
          onSaved={() => {
            setModal({ open: false });
            onReload();
          }}
        />
      )}
    </div>
  );
}

/* Modal: Membro da equipe */
function MembroEquipeModal({
  membro,
  onClose,
  onSaved,
}: {
  membro?: MembroEquipe;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState(membro?.nome || '');
  const [cargo, setCargo] = useState(membro?.cargo || '');
  const [instagramUrl, setInstagramUrl] = useState(membro?.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(membro?.facebookUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(membro?.twitterUrl || '');
  const [ordem, setOrdem] = useState(membro?.ordem || 0);
  const [ativo, setAtivo] = useState(membro?.ativo ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast.warning('Informe o nome do membro');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('cargo', cargo);
      formData.append('instagramUrl', instagramUrl);
      formData.append('facebookUrl', facebookUrl);
      formData.append('twitterUrl', twitterUrl);
      formData.append('ordem', String(ordem));
      formData.append('ativo', String(ativo));
      if (file) formData.append('imagem', file);

      if (membro) {
        await configWebService.atualizarMembro(membro.id, formData);
        toast.success('Membro atualizado!');
      } else {
        await configWebService.criarMembro(formData);
        toast.success('Membro criado!');
      }
      onSaved();
    } catch {
      toast.error('Erro ao salvar membro');
    }
    setSaving(false);
  };

  return (
    <div className="config-web-modal-overlay" onClick={onClose}>
      <div className="config-web-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{membro ? 'Editar Membro' : 'Novo Membro'}</h3>

        <div className="config-web-form-group">
          <label>Nome *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do profissional" />
        </div>
        <div className="config-web-form-group">
          <label>Cargo</label>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Master Barber" />
        </div>
        <div className="config-web-form-group">
          <label>Foto</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(membro?.imagem || file) && (
              <div className="config-web-crud-item-img">
                <img src={file ? URL.createObjectURL(file) : membro?.imagem || ''} alt="Preview" />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="upload-btn" onClick={() => fileRef.current?.click()}>
              <FaUpload />
              {file ? file.name : 'Selecionar foto'}
            </button>
          </div>
        </div>
        <div className="config-web-form-group">
          <label>Instagram URL</label>
          <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
        </div>
        <div className="config-web-form-group">
          <label>Facebook URL</label>
          <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." />
        </div>
        <div className="config-web-form-group">
          <label>Twitter URL</label>
          <input type="url" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/..." />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="config-web-form-group" style={{ flex: 1 }}>
            <label>Ordem</label>
            <input type="number" value={ordem} onChange={(e) => setOrdem(parseInt(e.target.value) || 0)} />
          </div>
          <div className="config-web-form-group" style={{ flex: 1 }}>
            <label>Status</label>
            <label className="config-web-toggle">
              <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
              <span className="toggle-track" />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{ativo ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>
        </div>

        <div className="config-web-modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== TAB: UNIDADES ============== */
function TabUnidades({
  unidades,
  modal,
  setModal,
  onReload,
}: {
  unidades: Unidade[];
  modal: { open: boolean; unidade?: Unidade };
  setModal: (m: { open: boolean; unidade?: Unidade }) => void;
  onReload: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta unidade?')) return;
    try {
      await configWebService.deletarUnidade(id);
      toast.success('Unidade excluída');
      onReload();
    } catch {
      toast.error('Erro ao excluir unidade');
    }
  };

  return (
    <div className="config-web-form-section">
      <div className="config-web-crud-header">
        <h3>Unidades / Locais</h3>
        <button className="config-web-add-btn" onClick={() => setModal({ open: true })}>
          <FaPlus />
          Nova unidade
        </button>
      </div>

      <p className="config-web-size-hint">
        📐 Tamanho recomendado da imagem: <strong>680 × 600 px</strong> (proporção 340×300). Formatos: JPG, PNG ou WebP.
      </p>

      <div className="config-web-crud-list">
        {unidades.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Nenhuma unidade cadastrada.
          </p>
        )}
        {unidades.map((u) => (
          <div key={u.id} className="config-web-crud-item unidade-item">
            <div className="config-web-crud-item-img">
              {u.imagem ? (
                <img src={u.imagem} alt={u.nome} />
              ) : (
                <FaMapMarkerAlt className="no-img" />
              )}
            </div>
            <div className="config-web-crud-item-info">
              <h4>{u.nome}</h4>
              <p>{u.cidade}{u.endereco ? ` · ${u.endereco}` : ''} · Ordem: {u.ordem}</p>
            </div>
            <span className={u.ativo ? 'badge-active' : 'badge-inactive'}>
              {u.ativo ? 'Ativa' : 'Inativa'}
            </span>
            <div className="config-web-crud-item-actions">
              <button onClick={() => setModal({ open: true, unidade: u })} title="Editar">
                <FaEdit />
              </button>
              <button className="delete" onClick={() => handleDelete(u.id)} title="Excluir">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <UnidadeModal
          unidade={modal.unidade}
          onClose={() => setModal({ open: false })}
          onSaved={() => {
            setModal({ open: false });
            onReload();
          }}
        />
      )}
    </div>
  );
}

/* Modal: Unidade */
function UnidadeModal({
  unidade,
  onClose,
  onSaved,
}: {
  unidade?: Unidade;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState(unidade?.nome || '');
  const [cidade, setCidade] = useState(unidade?.cidade || '');
  const [endereco, setEndereco] = useState(unidade?.endereco || '');
  const [ordem, setOrdem] = useState(unidade?.ordem || 0);
  const [ativo, setAtivo] = useState(unidade?.ativo ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!nome.trim() || !cidade.trim()) {
      toast.warning('Informe nome e cidade');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('cidade', cidade);
      formData.append('endereco', endereco);
      formData.append('ordem', String(ordem));
      formData.append('ativo', String(ativo));
      if (file) formData.append('imagem', file);

      if (unidade) {
        await configWebService.atualizarUnidade(unidade.id, formData);
        toast.success('Unidade atualizada!');
      } else {
        await configWebService.criarUnidade(formData);
        toast.success('Unidade criada!');
      }
      onSaved();
    } catch {
      toast.error('Erro ao salvar unidade');
    }
    setSaving(false);
  };

  return (
    <div className="config-web-modal-overlay" onClick={onClose}>
      <div className="config-web-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{unidade ? 'Editar Unidade' : 'Nova Unidade'}</h3>

        <div className="config-web-form-group">
          <label>Nome *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Unidade Centro" />
        </div>
        <div className="config-web-form-group">
          <label>Cidade *</label>
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Campo Grande - MS" />
        </div>
        <div className="config-web-form-group">
          <label>Endereço</label>
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Ex: Rua 14 de Julho, 1234" />
        </div>
        <div className="config-web-form-group">
          <label>Foto</label>
          <p className="config-web-size-hint" style={{ marginBottom: '0.5rem' }}>
            📐 Recomendado: <strong>680 × 600 px</strong> (proporção 340×300)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(unidade?.imagem || file) && (
              <div className="config-web-crud-item-img" style={{ borderRadius: '8px' }}>
                <img src={file ? URL.createObjectURL(file) : unidade?.imagem || ''} alt="Preview" />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="upload-btn" onClick={() => fileRef.current?.click()}>
              <FaUpload />
              {file ? file.name : 'Selecionar foto'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="config-web-form-group" style={{ flex: 1 }}>
            <label>Ordem</label>
            <input type="number" value={ordem} onChange={(e) => setOrdem(parseInt(e.target.value) || 0)} />
          </div>
          <div className="config-web-form-group" style={{ flex: 1 }}>
            <label>Status</label>
            <label className="config-web-toggle">
              <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
              <span className="toggle-track" />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{ativo ? 'Ativa' : 'Inativa'}</span>
            </label>
          </div>
        </div>

        <div className="config-web-modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== TAB: SERVIÇOS ============== */
function TabServicos({
  servicos,
  servicoModal,
  setServicoModal,
  onReload,
}: {
  servicos: ServicoWeb[];
  servicoModal: { open: boolean; servico?: ServicoWeb };
  setServicoModal: (m: { open: boolean; servico?: ServicoWeb }) => void;
  onReload: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await servicoWebService.deletar(id);
      toast.success('Serviço excluído');
      onReload();
    } catch {
      toast.error('Erro ao excluir serviço');
    }
  };

  const formatPreco = (preco: number) =>
    preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="config-web-form-section">
      <div className="config-web-crud-header">
        <h3>Serviços (Visual do site)</h3>
        <button className="config-web-add-btn" onClick={() => setServicoModal({ open: true })}>
          <FaPlus />
          Novo serviço
        </button>
      </div>

      <p className="config-web-size-hint">
        📐 Tamanho recomendado da imagem: <strong>600 × 440 px</strong> (proporção 300×220). Formatos: JPG, PNG ou WebP.
      </p>
      <p className="config-web-size-hint" style={{ marginTop: '0.25rem' }}>
        ⚠️ Esses serviços controlam os <strong>cards visuais</strong> exibidos no site público. Para gerenciar o <strong>dropdown de agendamento</strong>, use a página "Serviços" no menu lateral.
      </p>

      <div className="config-web-crud-list">
        {servicos.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Nenhum serviço visual cadastrado.
          </p>
        )}
        {servicos.map((s) => (
          <div key={s.id} className="config-web-crud-item">
            <div className="config-web-crud-item-img">
              {s.imagem ? (
                <img src={s.imagem} alt={s.nome} />
              ) : (
                <FaCut className="no-img" />
              )}
            </div>
            <div className="config-web-crud-item-info">
              <h4>{s.nome}</h4>
              <p>{formatPreco(s.preco)}{s.descricao ? ` · ${s.descricao}` : ''}</p>
            </div>
            <span className={s.ativo ? 'badge-active' : 'badge-inactive'}>
              {s.ativo ? 'Ativo' : 'Inativo'}
            </span>
            <div className="config-web-crud-item-actions">
              <button onClick={() => setServicoModal({ open: true, servico: s })} title="Editar">
                <FaEdit />
              </button>
              <button className="delete" onClick={() => handleDelete(s.id)} title="Excluir">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {servicoModal.open && (
        <ServicoWebModal
          servico={servicoModal.servico}
          onClose={() => setServicoModal({ open: false })}
          onSaved={() => {
            setServicoModal({ open: false });
            onReload();
          }}
        />
      )}
    </div>
  );
}

/* Modal: Serviço Web */
function ServicoWebModal({
  servico,
  onClose,
  onSaved,
}: {
  servico?: ServicoWeb;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nome, setNome] = useState(servico?.nome || '');
  const [descricao, setDescricao] = useState(servico?.descricao || '');
  const [preco, setPreco] = useState(servico ? String(servico.preco) : '');
  const [ativo, setAtivo] = useState(servico?.ativo ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!nome.trim() || !preco) {
      toast.warning('Preencha nome e preço');
      return;
    }
    setSaving(true);
    try {
      const data = {
        nome,
        descricao: descricao || undefined,
        preco: Number(preco),
        ativo,
      };

      let savedServico: ServicoWeb;
      if (servico) {
        const res = await servicoWebService.atualizar(servico.id, data);
        savedServico = res.data.data;
        toast.success('Serviço atualizado!');
      } else {
        const res = await servicoWebService.criar(data);
        savedServico = res.data.data;
        toast.success('Serviço criado!');
      }

      if (file) {
        setUploadingImg(true);
        try {
          await servicoWebService.uploadImagem(savedServico.id, file);
          toast.success('Imagem enviada!');
        } catch {
          toast.error('Serviço salvo, mas erro ao enviar imagem');
        }
        setUploadingImg(false);
      }

      onSaved();
    } catch {
      toast.error('Erro ao salvar serviço');
    }
    setSaving(false);
  };

  const handleRemoverImagem = async () => {
    if (!servico) return;
    if (!confirm('Remover imagem deste serviço?')) return;
    try {
      await servicoWebService.removerImagem(servico.id);
      toast.success('Imagem removida!');
      onSaved();
    } catch {
      toast.error('Erro ao remover imagem');
    }
  };

  return (
    <div className="config-web-modal-overlay" onClick={onClose}>
      <div className="config-web-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{servico ? 'Editar Serviço' : 'Novo Serviço'}</h3>

        <div className="config-web-form-group">
          <label>Nome *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Corte de cabelo" />
        </div>
        <div className="config-web-form-group">
          <label>Preço (R$) *</label>
          <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="55.90" />
        </div>
        <div className="config-web-form-group">
          <label>Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição do serviço..." rows={3} />
        </div>
        <div className="config-web-form-group">
          <label>Imagem do serviço</label>
          <p className="config-web-size-hint" style={{ marginBottom: '0.5rem' }}>
            📐 Recomendado: <strong>600 × 440 px</strong> (proporção 300×220)
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(servico?.imagem || file) && (
              <div className="config-web-crud-item-img" style={{ borderRadius: '8px' }}>
                <img src={file ? URL.createObjectURL(file) : servico?.imagem || ''} alt="Preview" />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button className="upload-btn" onClick={() => fileRef.current?.click()}>
              <FaUpload />
              {file ? file.name : 'Selecionar imagem'}
            </button>
            {servico?.imagem && !file && (
              <button className="upload-btn" style={{ background: 'transparent', border: '1px solid rgba(220,53,69,0.4)', color: '#dc3545' }} onClick={handleRemoverImagem}>
                <FaTrash />
                Remover
              </button>
            )}
          </div>
        </div>
        <div className="config-web-form-group">
          <label>Status</label>
          <label className="config-web-toggle">
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
            <span className="toggle-track" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{ativo ? 'Ativo' : 'Inativo'}</span>
          </label>
        </div>

        <div className="config-web-modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={handleSubmit} disabled={saving || uploadingImg}>
            {saving ? 'Salvando...' : uploadingImg ? 'Enviando imagem...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== TAB: SOCIAL ============== */
function TabSocial({
  formData,
  onChange,
  onSave,
  saving,
}: {
  formData: Partial<ConfiguracaoWeb>;
  onChange: (f: string, v: string | number | null) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="config-web-form-section">
      <h3>Redes Sociais</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        URLs das redes sociais exibidas no header e footer do site. Deixe vazio para não exibir.
      </p>

      <div className="config-web-form-grid">
        <div className="config-web-form-group">
          <label>Instagram</label>
          <input
            type="url"
            value={formData.instagramUrl || ''}
            onChange={(e) => onChange('instagramUrl', e.target.value || null)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div className="config-web-form-group">
          <label>Facebook</label>
          <input
            type="url"
            value={formData.facebookUrl || ''}
            onChange={(e) => onChange('facebookUrl', e.target.value || null)}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div className="config-web-form-group">
          <label>YouTube</label>
          <input
            type="url"
            value={formData.youtubeUrl || ''}
            onChange={(e) => onChange('youtubeUrl', e.target.value || null)}
            placeholder="https://youtube.com/..."
          />
        </div>
        <div className="config-web-form-group">
          <label>Twitter / X</label>
          <input
            type="url"
            value={formData.twitterUrl || ''}
            onChange={(e) => onChange('twitterUrl', e.target.value || null)}
            placeholder="https://twitter.com/..."
          />
        </div>
      </div>

      <div className="config-web-save-bar">
        <button className="config-web-save-btn" onClick={onSave} disabled={saving}>
          <FaSave />
          {saving ? 'Salvando...' : 'Salvar redes sociais'}
        </button>
      </div>
    </div>
  );
}
