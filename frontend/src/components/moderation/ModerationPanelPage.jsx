import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../common/PageWrapper';
import ModerationPanel from './ModerationPanel';
import './AccessDenied.css';

const ModerationPanelPage = () => {
  return (
    <div>
      <h1>Panel de Moderación</h1>
      <ModerationPanel />
    </div>
  );
};

export default ModerationPanelPage;
