/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Serviços (público)
 */

import { useEffect, useState } from 'react';
import { servicoService, Servico } from '../../services/servicoService';
import '../../styles/servicos.css';

const imagensPadrao = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80',
  'https://images.unsplash.com/photo-1585747860873-cf6d02f8f7d1?w=500&q=80',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80',
];

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await servicoService.listarPublico();
        setServicos(response.data.data);
      } catch {
        // Fallback data caso API não esteja disponível
        setServicos([
          { id: '1', nome: 'Corte de cabelo', descricao: '', preco: 55.90, duracaoMinutos: 40, ativo: true, createdAt: '', updatedAt: '' },
          { id: '2', nome: 'Corte completo', descricao: '', preco: 75.90, duracaoMinutos: 60, ativo: true, createdAt: '', updatedAt: '' },
          { id: '3', nome: 'Corte & Barba', descricao: '', preco: 85.90, duracaoMinutos: 70, ativo: true, createdAt: '', updatedAt: '' },
        ]);
      }
    }
    load();
  }, []);

  const formatPreco = (preco: number) =>
    preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <section className="servicos" id="servicos">
      <div className="container">
        <h2 className="section-title">Serviços</h2>
        <div className="gold-line" />
        <p className="section-subtitle">
          Oferecemos uma variedade de serviços premium para transformar seu
          visual. Confira nossos cortes e tratamentos especiais.
        </p>

        <div className="servicos-grid">
          {servicos.map((servico, index) => (
            <div key={servico.id} className="servico-card">
              <div className="servico-card-image">
                <img
                  src={servico.imagem || imagensPadrao[index % imagensPadrao.length]}
                  alt={servico.nome}
                />
              </div>
              <div className="servico-card-body">
                <h3>{servico.nome}</h3>
                <span className="preco">{formatPreco(servico.preco)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
