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
      id: 1,
      path: '/agreements',
      title: 'Convenios Educativos',
      description: 'Accede a convenios educativos y conexiones académicas',
      icon: '🎓',
      color: 'blue',
      roles: ['usuario', 'moderador', 'admin']
    },
    {
      id: 2,
      path: '/ventures',
      title: 'Emprendimientos',
      description: 'Crea y gestiona tus proyectos emprendedores',
      icon: '🚀',
      color: 'purple',
      roles: ['usuario', 'moderador', 'admin']
    },
    {
      id: 4,
      path: '/recruiting',
      title: 'Centro de Reclutamiento',
      description: 'Busca talentos o publica oportunidades laborales',
      icon: '�',
      color: 'orange',
      roles: ['usuario', 'moderador', 'admin']
    },
    {
      id: 6,
      path: '/admin',
      title: 'Panel de Administración',
      description: 'Gestiona usuarios, permisos y configuraciones',
      icon: '⚙️',
      color: 'red',
      roles: ['admin']
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
