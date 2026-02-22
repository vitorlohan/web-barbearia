/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Header / Navbar
 */

import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import { ConfiguracaoWeb } from '../../services/configWebService';
import '../../styles/header.css';

interface HeaderProps {
  onAgendarClick: () => void;
  config?: ConfiguracaoWeb | null;
}

export function Header({ onAgendarClick, config }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-logo">
          {config?.logoHeaderUrl ? (
            <img
              src={config.logoHeaderUrl}
              alt="Logo"
              style={{
                width: config.logoHeaderWidth || 150,
                height: config.logoHeaderHeight || 50,
                objectFit: 'contain',
              }}
            />
          ) : (
            <>
              <span className="header-logo-icon">💈</span>
              <h1>
                BARBER
                <span>SHOP</span>
              </h1>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => scrollTo('home')}>Home</a>
          <a href="#sobre" onClick={() => scrollTo('sobre')}>Sobre</a>
          <a href="#servicos" onClick={() => scrollTo('servicos')}>Serviços</a>
          <a href="#contato" onClick={() => scrollTo('contato')}>Contato</a>
        </nav>

        <div className="header-social">
          {config?.facebookUrl && (
            <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          )}
          {config?.youtubeUrl && (
            <a href={config.youtubeUrl} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          )}
          {config?.instagramUrl && (
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          )}
          {config?.twitterUrl && (
            <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          )}
          {!config && (
            <>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </>
          )}
        </div>

        <div className="header-cta-wrapper">
          <button className="header-cta" onClick={onAgendarClick}>
            Agendar horário
          </button>
        </div>
      </div>
    </header>
  );
}
