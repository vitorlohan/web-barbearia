/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Componente Widget WhatsApp
 */

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { configuracaoService } from '../../services/configuracaoService';
import '../../styles/whatsapp.css';

export function WhatsAppWidget() {
  const [telefone, setTelefone] = useState('+5567999999999');

  useEffect(() => {
    async function load() {
      try {
        const response = await configuracaoService.getWhatsApp();
        if (response.data.data.whatsapp) {
          setTelefone(response.data.data.whatsapp);
        }
      } catch {
        // Mantém o número padrão
      }
    }
    load();
  }, []);

  const numero = telefone.replace(/\D/g, '');
  const url = `https://wa.me/${numero}?text=${encodeURIComponent('Olá! Gostaria de agendar um horário na barbearia.')}`;

  return (
    <div className="whatsapp-widget">
      <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" title="Fale conosco no WhatsApp">
        <FaWhatsapp />
      </a>
    </div>
  );
}
