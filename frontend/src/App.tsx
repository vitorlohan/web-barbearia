/**
 * Sistema desenvolvido por Vitor Lohan
 * Todos os direitos reservados.
 * 
 * App.tsx - Componente raiz
 */

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { AppRoutes } from './routes/AppRoutes';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/sobre.css';
import './styles/servicos.css';
import './styles/equipe.css';
import './styles/unidades.css';
import './styles/footer.css';
import './styles/modal.css';
import './styles/whatsapp.css';
import './styles/admin.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteConfigProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </SiteConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
