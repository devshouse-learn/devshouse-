import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../common/PageWrapper';
import AdminPanel from './AdminPanel';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <PageWrapper
      title="Panel de Administración"
      subtitle="Gestiona la plataforma y el contenido"
      icon=""
    >
      <AdminPanel />
    </PageWrapper>
  );
}
