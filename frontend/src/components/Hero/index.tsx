/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Hero
 */

import { FaChevronDown, FaArrowRight } from 'react-icons/fa';
import '../../styles/hero.css';

interface HeroProps {
  onAgendarClick: () => void;
}

export function Hero({ onAgendarClick }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-badge">SINCE 1990</span>
        <h1>
          ESTILO É UM REFLEXO DA SUA <span>ATITUDE</span> E SUA{' '}
          <span>PERSONALIDADE</span>
        </h1>
        <p className="hero-subtitle">
          Transforme seu visual com estilo! Na nossa barbearia, você encontra
          cortes modernos, barba impecável e um atendimento de primeira.
          Agende agora e sinta a diferença!
        </p>
        <p className="hero-hours">
          Horário de funcionamento: <strong>09:00 às 18:00</strong>
        </p>
        <button className="hero-btn" onClick={onAgendarClick}>
          <FaArrowRight />
          Agendar horário
        </button>
      </div>

      <a href="#sobre" className="hero-scroll">
        <FaChevronDown />
      </a>
    </section>
  );
}
