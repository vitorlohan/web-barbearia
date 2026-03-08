/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Unidades
 */

import { Unidade as UnidadeType } from '../../services/configWebService';
import '../../styles/unidades.css';

const fallbackUnidades = [
  {
    id: '1',
    nome: 'Rua Aguiar, n 120',
    cidade: 'Campo Grande - MS',
    endereco: null,
    imagem: 'https://images.unsplash.com/photo-1585747860873-cf6d02f8f7d1?w=600&q=80',
    ordem: 1,
    ativo: true,
  },
  {
    id: '2',
    nome: 'Rua Centro, n 10',
    cidade: 'Campo Grande - MS',
    endereco: null,
    imagem: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80',
    ordem: 2,
    ativo: true,
  },
];

interface UnidadesProps {
  unidades?: UnidadeType[];
}

export function Unidades({ unidades }: UnidadesProps) {
  const lista = unidades && unidades.length > 0 ? unidades : fallbackUnidades;

  return (
    <section className="unidades" id="contato">
      <div className="container">
        <h2 className="section-title">NOSSAS UNIDADES</h2>
        <div className="gold-line" />

        <div className="unidades-grid">
          {lista.map((unidade) => (
            <div key={unidade.id} className="unidade-card">
              <div className="unidade-card-img">
                <img
                  src={unidade.imagem || 'https://images.unsplash.com/photo-1585747860873-cf6d02f8f7d1?w=600&q=80'}
                  alt={unidade.nome}
                />
              </div>
              <div className="unidade-card-info">
                <h3>{unidade.nome}</h3>
                <p>{unidade.cidade}</p>
                {unidade.endereco && (
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{unidade.endereco}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
