/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 *
 * Contexto global para ConfiguracaoWeb - carrega configuração uma vez
 * e aplica a paleta de cores ao :root automaticamente.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { configWebService, ConfiguracaoWeb } from '../services/configWebService';
import { applyColorPalette } from '../hooks/useColorPalette';

interface SiteConfigContextData {
  config: ConfiguracaoWeb | null;
  reloadConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextData>({
  config: null,
  reloadConfig: async () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ConfiguracaoWeb | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      const res = await configWebService.obterPublico();
      const cfg = res.data.data;
      setConfig(cfg);
      applyColorPalette(cfg);
    } catch {
      // Fallback: use CSS defaults from global.css
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Re-apply palette whenever config changes
  useEffect(() => {
    if (config) {
      applyColorPalette(config);
    }
  }, [config]);

  const reloadConfig = useCallback(async () => {
    await loadConfig();
  }, [loadConfig]);

  return (
    <SiteConfigContext.Provider value={{ config, reloadConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
