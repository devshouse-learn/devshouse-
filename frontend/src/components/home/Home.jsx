import { useAuth } from '../../context/AuthContext';
import Hero from './Hero';
import Description from './Description';
import Dashboard from '../dashboard/Dashboard';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {!isAuthenticated ? (
        <>
          <Hero />
          <Description />
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Home;
