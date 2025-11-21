import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '../ai-assistant/AIAssistant';
import AuthModal from '../auth/AuthModal';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);

  const handleAuthModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container content-wrapper">
          <Outlet />
        </div>
      </main>
      <Footer />
      {!isAuthenticated && !loading && showModal && (
        <AuthModal onClose={handleAuthModalClose} />
      )}
      <AIAssistant />
    </div>
  );
};

export default Layout;
