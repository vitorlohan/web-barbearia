/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 *
 * Hook - Aplica paleta de cores dinâmica nas CSS custom properties
 */

import { useEffect, useRef } from 'react';
import { ConfiguracaoWeb } from '../services/configWebService';

function darkenColor(hex: string, amount = 30): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lightenColor(hex: string, amount = 10): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyColorPalette(cfg: ConfiguracaoWeb) {
  const root = document.documentElement;

  // Mapeamento direto: campos do config → variáveis CSS
  if (cfg.corPrimaria) {
    root.style.setProperty('--color-primary', cfg.corPrimaria);
    root.style.setProperty('--color-primary-dark', darkenColor(cfg.corPrimaria, 30));
    root.style.setProperty('--shadow-gold', `0 4px 15px ${hexToRgba(cfg.corPrimaria, 0.3)}`);
  }

  if (cfg.corPrimariaLight) {
    root.style.setProperty('--color-primary-light', cfg.corPrimariaLight);
  }

  if (cfg.corBackground) {
    root.style.setProperty('--color-bg-dark', cfg.corBackground);
    root.style.setProperty('--color-bg-section', lightenColor(cfg.corBackground, 10));
  }

  if (cfg.corBackgroundCard) {
    root.style.setProperty('--color-bg-card', cfg.corBackgroundCard);
    root.style.setProperty('--color-bg-card-hover', lightenColor(cfg.corBackgroundCard, 15));
  }

  if (cfg.corTexto) {
    root.style.setProperty('--color-text-white', cfg.corTexto);
  }

  if (cfg.corTextoMuted) {
    root.style.setProperty('--color-text-muted', cfg.corTextoMuted);
  }

  if (cfg.corBorda) {
    root.style.setProperty('--color-border', cfg.corBorda);
  }
}

/**
 * Hook que carrega a paleta de cores do backend e aplica ao :root.
 * Deve ser usado no componente App (nível raiz).
 */
export function useColorPalette(config: ConfiguracaoWeb | null) {
  const applied = useRef(false);

  useEffect(() => {
    if (config) {
      applyColorPalette(config);
      applied.current = true;
    }
  }, [config]);
}
