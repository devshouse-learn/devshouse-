import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Permisos por defecto según rol
const DEFAULT_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_roles',
    'manage_permissions',
    'post_jobs',
    'edit_agreements',
    'edit_ventures',
    'delete_content',
    'view_analytics',
    'manage_moderators',
  ],
  moderador: [
    'edit_agreements',
    'edit_ventures',
    'moderate_content',
    'view_analytics',
  ],
  usuario: [
    'post_ventures',
    'search_jobs',
    'view_agreements',
  ],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]); // Lista de usuarios (solo para admin)

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUsers = localStorage.getItem('users');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithPermissions = {
      ...userData,
      permissions: DEFAULT_PERMISSIONS[userData.role] || [],
    };
    setUser(userWithPermissions);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithPermissions));
    
    // Guardar contraseña si es el admin (para poder asignar roles después)
    if (userData.email === 'kelib@gmail.com') {
      localStorage.setItem('adminPassword', userData.password || '');
    }
  };

  const register = (userData) => {
    const userWithPermissions = {
      ...userData,
      permissions: DEFAULT_PERMISSIONS[userData.role] || [],
    };
    setUser(userWithPermissions);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithPermissions));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('adminPassword');
  };

  // Función para asignar permisos (solo admin)
  const assignPermission = (userId, permission) => {
    if (user?.role !== 'admin') {
      console.error('Solo administradores pueden asignar permisos');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const permissions = new Set(u.permissions || []);
        permissions.add(permission);
        return { ...u, permissions: Array.from(permissions) };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Función para revocar permisos (solo admin)
  const revokePermission = (userId, permission) => {
    if (user?.role !== 'admin') {
      console.error('Solo administradores pueden revocar permisos');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const permissions = new Set(u.permissions || []);
        permissions.delete(permission);
        return { ...u, permissions: Array.from(permissions) };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Función para verificar permiso
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  // Función para obtener todos los usuarios (solo admin)
  const getAllUsers = () => {
    if (user?.role !== 'admin') {
      return [];
    }
    return users;
  };

  // Función para actualizar permisos de un usuario
  const updateUserPermissions = (userId, permissions) => {
    if (user?.role !== 'admin') {
      console.error('Solo administradores pueden actualizar permisos');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, permissions };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    assignPermission,
    revokePermission,
    hasPermission,
    getAllUsers,
    updateUserPermissions,
    users,
    DEFAULT_PERMISSIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
