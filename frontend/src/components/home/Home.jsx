import { useAuth } from '../../context/AuthContext';
import AllContent from './AllContent';
import Dashboard from '../dashboard/Dashboard';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {!isAuthenticated ? (
        <AllContent />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Home;
