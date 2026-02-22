/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Sobre
 */

import { FaClock } from 'react-icons/fa';
import { ConfiguracaoWeb } from '../../services/configWebService';
import '../../styles/sobre.css';

const fallbackImages = [
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80',
];

interface SobreProps {
  config?: ConfiguracaoWeb | null;
}

export function Sobre({ config }: SobreProps) {
  const images = [
    config?.sobreImagem1 || fallbackImages[0],
    config?.sobreImagem2 || fallbackImages[1],
    config?.sobreImagem3 || fallbackImages[2],
  ];

  const subtitulo = config?.sobreTitulo || 'Tradição e Estilo desde 2010';
  const texto1 = config?.sobreTexto1 || 'Há mais de 30 anos, a Barber Shop Navalha de Ouro é referência em barbearia premium. Nosso compromisso é oferecer uma experiência única, combinando técnicas tradicionais com tendências modernas.';
  const texto2 = config?.sobreTexto2 || 'Nossa equipe é formada por profissionais altamente qualificados, apaixonados pelo que fazem e dedicados a transformar seu visual. Cada detalhe é pensado para garantir sua satisfação.';
  const horario = config?.sobreHorario || 'Horário de funcionamento: 08:00 às 18:00';

  return (
    <section className="sobre" id="sobre">
      <div className="container">
        <div className="sobre-images">
          <img src={images[0]} alt="Barbeiro atendendo cliente" />
          <img src={images[1]} alt="Interior da barbearia" />
          <img src={images[2]} alt="Corte de cabelo detalhado" />
        </div>

        <div className="sobre-content">
          <h2>Sobre</h2>
          <h3 className="sobre-subtitulo">{subtitulo}</h3>
          <p>{texto1}</p>
          <p>{texto2}</p>
          <div className="sobre-horario">
            <FaClock />
            <span>{horario}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
