/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * Layout Admin (Sidebar + Main)
 */

import { useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaHome,
  FaCut,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaClock,
  FaGlobe,
} from 'react-icons/fa';
import '../../styles/admin.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { path: '/admin/agendamentos', label: 'Agendamentos', icon: <FaCalendarAlt /> },
  { path: '/admin/servicos', label: 'Serviços', icon: <FaCut /> },
  { path: '/admin/horarios', label: 'Horários Bloqueados', icon: <FaClock /> },
  { path: '/admin/configuracoes', label: 'Configurações', icon: <FaCog /> },
  { path: '/admin/config-web', label: 'Configuração Web', icon: <FaGlobe /> },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <h2>💈 Barber Shop</h2>
          <span>Painel Administrativo</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            {admin?.nome}
          </p>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
