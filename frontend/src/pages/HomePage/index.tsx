/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Página Principal (Pública)
 */

import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Hero } from '../../components/Hero';
import { Sobre } from '../../components/Sobre';
import { Servicos } from '../../components/Servicos';
import { Equipe } from '../../components/Equipe';
import { Unidades } from '../../components/Unidades';
import { Footer } from '../../components/Footer';
import { WhatsAppWidget } from '../../components/WhatsAppWidget';
import { AgendamentoModal } from '../../components/AgendamentoModal';
import { configWebService, MembroEquipe, Unidade as UnidadeType } from '../../services/configWebService';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

export function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { config } = useSiteConfig();
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [unidades, setUnidades] = useState<UnidadeType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [equipeRes, unidadesRes] = await Promise.all([
          configWebService.listarEquipePublico(),
          configWebService.listarUnidadesPublico(),
        ]);
        setMembros(equipeRes.data.data);
        setUnidades(unidadesRes.data.data);
      } catch {
        // Silently fail - components will use fallback data
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Header onAgendarClick={() => setModalOpen(true)} config={config} />
      <Hero onAgendarClick={() => setModalOpen(true)} />
      <Sobre config={config} />
      <Servicos />
      <Equipe membros={membros} />
      <Unidades unidades={unidades} />
      <Footer config={config} />
      <WhatsAppWidget />
      <AgendamentoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
