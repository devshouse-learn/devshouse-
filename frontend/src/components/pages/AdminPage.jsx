import { useAuth } from '../../context/AuthContext';
import AdminPanel from '../admin/AdminPanel';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-page">
      <AdminPanel />
    </div>
  );
}
