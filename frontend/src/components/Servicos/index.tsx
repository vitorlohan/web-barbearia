/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Serviços (público)
 */

import { useEffect, useState } from 'react';
import { servicoService, Servico } from '../../services/servicoService';
import '../../styles/servicos.css';

export function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await servicoService.listarPublico();
        setServicos(response.data.data.filter((s: Servico) => s.imagem));
      } catch {
        setServicos([]);
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
          {servicos.map((servico) => (
            <div key={servico.id} className="servico-card">
              <div className="servico-card-image">
                <img
                  src={servico.imagem!}
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
