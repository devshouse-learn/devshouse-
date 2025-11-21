import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Hero from './Hero';
import Description from './Description';
import Impact from './Impact';
import Dashboard from '../dashboard/Dashboard';
import AuthModal from '../auth/AuthModal';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="home">
      {!isAuthenticated ? (
        <>
          <Hero onShowAuthModal={handleShowAuthModal} />
          <Description />
          <Impact />
          {showAuthModal && <AuthModal onClose={handleCloseAuthModal} />}
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Home;
