/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Equipe
 */

import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { MembroEquipe } from '../../services/configWebService';
import '../../styles/equipe.css';

const fallbackMembros = [
  {
    id: '1',
    nome: 'Lucas Silva',
    cargo: null,
    imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    instagramUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    ordem: 1,
    ativo: true,
  },
  {
    id: '2',
    nome: 'Henrique Souza',
    cargo: null,
    imagem: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    instagramUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    ordem: 2,
    ativo: true,
  },
  {
    id: '3',
    nome: 'Tiago Mendes',
    cargo: null,
    imagem: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    instagramUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    ordem: 3,
    ativo: true,
  },
];

interface EquipeProps {
  membros?: MembroEquipe[];
}

export function Equipe({ membros }: EquipeProps) {
  const lista = membros && membros.length > 0 ? membros : fallbackMembros;

  return (
    <section className="equipe" id="equipe">
      <div className="container">
        <div className="equipe-wrapper">
          <span className="equipe-label">Nossa Equipe</span>
          <div className="equipe-grid">
            {lista.map((membro) => (
              <div key={membro.id} className="equipe-card">
                <div className="equipe-card-img">
                  <img
                    src={membro.imagem || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
                    alt={membro.nome}
                  />
                </div>
                <div className="equipe-card-info">
                  <h3>{membro.nome}</h3>
                  {membro.cargo && <p className="equipe-card-cargo">{membro.cargo}</p>}
                  <div className="equipe-card-social">
                    {membro.twitterUrl && (
                      <a href={membro.twitterUrl} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    )}
                    {membro.instagramUrl && (
                      <a href={membro.instagramUrl} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    )}
                    {membro.facebookUrl && (
                      <a href={membro.facebookUrl} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    )}
                    {!membro.twitterUrl && !membro.instagramUrl && !membro.facebookUrl && (
                      <>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaFacebook /></a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
