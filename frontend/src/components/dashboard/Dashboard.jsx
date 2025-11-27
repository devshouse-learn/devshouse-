import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCardClick = (item) => {
    navigate(item.path);
  };

  const menuItems = [
    {
      id: 1,
      path: '/agreements',
      title: 'Convenios Educativos',
      description: 'Accede a convenios educativos y conexiones académicas',
      icon: '📋',
      color: 'blue',
      roles: ['usuario', 'moderador', 'admin'],
      category: 'modules'
    },
    {
      id: 2,
      path: '/ventures',
      title: 'Emprendimientos',
      description: 'Crea y gestiona tus proyectos emprendedores',
      icon: '🚀',
      color: 'purple',
      roles: ['usuario', 'moderador', 'admin'],
      category: 'modules'
    },
    {
      id: 4,
      path: '/recruiting',
      title: 'Centro de Reclutamiento',
      description: 'Busca talentos o publica oportunidades laborales',
      icon: '💼',
      color: 'orange',
      roles: ['usuario', 'moderador', 'admin'],
      category: 'modules'
    },
    {
      id: 6,
      path: '/admin',
      title: 'Panel de Administración',
      description: 'Gestiona usuarios, permisos y configuraciones',
      icon: '⚙️',
      color: 'red',
      roles: ['admin', 'moderador'],
      category: 'admin'
    },
    {
      id: 7,
      path: '/moderation-panel',
      title: 'Panel de Moderación',
      description: 'Revisa y modera contenido de la plataforma',
      icon: '🛡️',
      color: 'green',
      roles: ['moderador', 'admin'],
      category: 'admin'
    }
  ];

  // Filtrar menú según el rol del usuario
  const availableItems = menuItems.filter(item => item.roles.includes(user?.role));
  const adminItems = availableItems.filter(item => item.category === 'admin');
  const moduleItems = availableItems.filter(item => item.category === 'modules');

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Dropdown de Módulos */}
        <div className="dropdown-container">
          <button 
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="dropdown-label">📚 Módulos</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {moduleItems.map((item) => (
                <div
                  key={item.id}
                  className="dropdown-item"
                  onClick={() => {
                    handleCardClick(item);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="item-icon">{item.icon}</span>
                  <div className="item-content">
                    <div className="item-title">{item.title}</div>
                    <div className="item-description">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Items como tarjetas */}
        {adminItems.length > 0 && (
          <div className="dashboard-grid">
            {adminItems.map((item) => (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
