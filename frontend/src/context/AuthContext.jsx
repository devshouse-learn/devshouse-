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
    let storedUsers = localStorage.getItem('users');
    
    // Crear usuarios iniciales si no existen
    if (!storedUsers) {
      const initialUsers = [
        {
          id: '1',
          name: 'Admin',
          email: 'kelib@gmail.com',
          password: '03v5h0u53',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Usuario Test',
          email: 'test@gmail.com',
          password: 'test123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('users', JSON.stringify(initialUsers));
      storedUsers = JSON.stringify(initialUsers);
    }
    
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

  const login = (email, password) => {
    // Buscar usuario registrado
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userWithPermissions = {
        ...user,
        permissions: DEFAULT_PERMISSIONS[user.role] || [],
      };
      setUser(userWithPermissions);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Verificar que el email no esté registrado
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = storedUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      return false; // Email ya registrado
    }

    // Crear nuevo usuario con ID único
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Guardar en lista de usuarios
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Iniciar sesión automáticamente
    const userWithPermissions = {
      ...newUser,
      permissions: DEFAULT_PERMISSIONS[userData.role] || [],
    };
    setUser(userWithPermissions);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithPermissions));
    return true;
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
