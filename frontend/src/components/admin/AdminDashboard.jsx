import { useAuth } from '../../context/AuthContext';
import AdminPanel from './AdminPanel';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminPanel />
  );
}
