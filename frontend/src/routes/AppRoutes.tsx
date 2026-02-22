/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Rotas da aplicação
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/admin/LoginPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { AgendamentosPage } from '../pages/admin/AgendamentosPage';
import { ServicosPage } from '../pages/admin/ServicosPage';
import { HorariosPage } from '../pages/admin/HorariosPage';
import { ConfiguracaoPage } from '../pages/admin/ConfiguracaoPage';
import { ConfigWebPage } from '../pages/admin/ConfigWebPage';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />

      {/* Login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Rotas admin protegidas */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="agendamentos" element={<AgendamentosPage />} />
        <Route path="servicos" element={<ServicosPage />} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="configuracoes" element={<ConfiguracaoPage />} />
        <Route path="config-web" element={<ConfigWebPage />} />
      </Route>

      {/* Rota 404 - redireciona para home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
