/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Contexto de Autenticação
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, Admin } from '../services/authService';

interface AuthContextData {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('@barbearia:token');
    const storedAdmin = localStorage.getItem('@barbearia:admin');

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await authService.login(email, senha);
    const { admin: adminData, token: tokenData } = response.data.data;

    localStorage.setItem('@barbearia:token', tokenData);
    localStorage.setItem('@barbearia:admin', JSON.stringify(adminData));

    setAdmin(adminData);
    setToken(tokenData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('@barbearia:token');
    localStorage.removeItem('@barbearia:admin');
    setAdmin(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
