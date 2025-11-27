import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DASHBOARD_MENU_ITEMS } from '../../config/menuConfig';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate(item.path);
  };

  // Filtrar menú según el rol del usuario
  const availableItems = DASHBOARD_MENU_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {availableItems.map((item) => (
          <div
            key={item.id}
            className={`dashboard-card dashboard-${item.color}`}
            onClick={() => handleCardClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="card-arrow">▶</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
