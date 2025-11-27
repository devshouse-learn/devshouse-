import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate(item.path);
  };

  const menuItems = [
    {
      id: 6,
      path: '/admin',
      title: 'Panel de Administración',
      description: 'Gestiona usuarios, permisos y configuraciones',
      icon: '⚙️',
      color: 'red',
      roles: ['admin', 'moderador']
    }
  ];

  // Filtrar menú según el rol del usuario
  const availableItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>👋 Bienvenido, {user?.name}!</h1>
        <p className="dashboard-subtitle">Selecciona qué deseas hacer</p>
      </div>

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
