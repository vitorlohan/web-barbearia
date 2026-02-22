/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Footer
 */

import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { ConfiguracaoWeb } from '../../services/configWebService';
import '../../styles/footer.css';

interface FooterProps {
  config?: ConfiguracaoWeb | null;
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-social">
          {config?.instagramUrl && (
            <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          )}
          {config?.twitterUrl && (
            <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          )}
          {config?.facebookUrl && (
            <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          )}
          {config?.youtubeUrl && (
            <a href={config.youtubeUrl} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          )}
          {!config && (
            <>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            </>
          )}
        </div>

        <div className="footer-logo">
          {config?.logoFooterUrl ? (
            <img
              src={config.logoFooterUrl}
              alt="Logo"
              style={{
                width: config.logoFooterWidth || 150,
                height: config.logoFooterHeight || 50,
                objectFit: 'contain',
              }}
            />
          ) : (
            <>Barber<span>Shop</span></>
          )}
        </div>

        <p className="footer-dev">
          Desenvolvido por{' '}
          <a href="https://vitorlohan.github.io/" target="_blank" rel="noopener noreferrer">
            Vitor Lohan
          </a>
        </p>
      </div>
    </footer>
  );
}
