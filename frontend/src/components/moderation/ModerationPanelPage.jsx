import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../common/PageWrapper';
import ModerationPanel from './ModerationPanel';
import './AccessDenied.css';

const ModerationPanelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Solo moderadores y admins pueden acceder
  if (!user || !['admin', 'moderador'].includes(user.role)) {
    return (
      <PageWrapper
        title="Acceso Denegado"
        icon=""
        showBackButton={false}
      >
        <div className="access-denied-container">
          <h2>No tienes permisos para acceder a este panel.</h2>
          <button onClick={() => navigate('/')} className="btn-home">
             Volver al inicio
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Panel de Moderación"
      subtitle="Revisa y modera el contenido de la plataforma"
      icon=""
    >
      <ModerationPanel />
    </PageWrapper>
  );
};

export default ModerationPanelPage;
