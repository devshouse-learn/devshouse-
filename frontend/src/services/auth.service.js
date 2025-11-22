const ADMIN_EMAIL = 'kelib@gmail.com';
const ADMIN_PASSWORD = '03v5h0u53';
const REGISTERED_USERS_KEY = 'devshouse_registered_users';

// Función helper para obtener usuarios registrados
const getRegisteredUsers = () => {
  try {
    const users = localStorage.getItem(REGISTERED_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error al obtener usuarios registrados:', error);
    return [];
  }
};

// Función helper para guardar usuario registrado
const saveRegisteredUser = (user) => {
  try {
    const users = getRegisteredUsers();
    users.push({
      email: user.email,
      name: user.name,
      password: user.password, // En producción esto NO se haría, pero para desarrollo local está bien
      role: user.role,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuario registrado:', error);
  }
};

// Función helper para verificar si un usuario existe
const findUserByEmail = (email) => {
  const users = getRegisteredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const authService = {
  // Simulamos un login (cuando backend esté listo, descomentar la llamada API)
  login: async (email, password) => {
    try {
      // Cuando backend esté listo, descomentar:
      // return await apiService.post('/auth/login', { email, password });

      // Limpiar espacios en blanco
      email = email?.trim().toLowerCase() || '';
      password = password?.trim() || '';

      // Simulación local para desarrollo
      if (!email || !password) {
        throw new Error('Email y contraseña requeridos');
      }

      // Validación básica
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido. Verifica el formato');
      }

      // Verificar si es el admin
      if (email === ADMIN_EMAIL) {
        if (password !== ADMIN_PASSWORD) {
          throw new Error('Contraseña incorrecta para el administrador');
        }
        return {
          id: 'admin-id',
          email,
          name: 'Administrador',
          role: 'admin',
          token: 'mock-token-admin',
        };
      }

      // Verificar si el usuario existe en localStorage
      const existingUser = findUserByEmail(email);
      
      if (!existingUser) {
        throw new Error('Esta cuenta no está registrada. Por favor, crea una cuenta primero.');
      }

      // Verificar contraseña
      if (existingUser.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      // Simular respuesta exitosa
      return {
        id: Math.random().toString(36).substr(2, 9),
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Simulamos un registro
  register: async (name, email, password, confirmPassword, role = 'usuario') => {
    try {
      // Cuando backend esté listo, descomentar:
      // return await apiService.post('/auth/register', { name, email, password, role });

      // Limpiar espacios en blanco de todos los campos
      name = name?.trim() || '';
      email = email?.trim().toLowerCase() || '';
      password = password?.trim() || '';
      confirmPassword = confirmPassword?.trim() || '';

      // Validaciones básicas
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar que el nombre tenga al menos 2 caracteres
      if (name.length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido. Verifica el formato (ejemplo: usuario@dominio.com)');
      }

      // Verificar si el email ya está registrado (incluyendo el admin)
      if (email === ADMIN_EMAIL) {
        throw new Error('Este correo electrónico ya está registrado como administrador');
      }

      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.');
      }

      // Validar contraseñas
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (role !== 'usuario') {
        throw new Error('Solo se puede registrar como usuario. Los moderadores son asignados por el administrador');
      }

      // Crear usuario y guardarlo
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password, // Solo para desarrollo local
        role: role,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };

      // Guardar en localStorage
      saveRegisteredUser(newUser);

      // Retornar sin la contraseña
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: newUser.token,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: () => {
    // Cuando backend esté listo:
    // return await apiService.post('/auth/logout');
    return Promise.resolve();
  },

  // Validar si el token es válido
  validateToken: async (token) => {
    try {
      // Cuando backend esté listo:
      // return await apiService.post('/auth/validate', { token });
      return !!token;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Función para que el admin asigne rol de administrador a otro usuario
  assignAdminRole: async (currentUserEmail, currentUserPassword, targetUserEmail) => {
    try {
      // Validar que quien intenta asignar sea el admin
      if (currentUserEmail !== ADMIN_EMAIL || currentUserPassword !== ADMIN_PASSWORD) {
        throw new Error('Solo el administrador puede asignar roles de administrador');
      }

      // Validar email del usuario a promover
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(targetUserEmail)) {
        throw new Error('Email inválido');
      }

      // Simular actualización exitosa
      return {
        success: true,
        message: `Usuario ${targetUserEmail} promovido a administrador exitosamente`,
        userEmail: targetUserEmail,
        newRole: 'admin',
      };
    } catch (error) {
      console.error('Assign admin role error:', error);
      throw error;
    }
  },

  // Función para que el admin asigne rol de moderador a otro usuario
  assignModeratorRole: async (currentUserEmail, currentUserPassword, targetUserEmail) => {
    try {
      // Validar que quien intenta asignar sea el admin
      if (currentUserEmail !== ADMIN_EMAIL || currentUserPassword !== ADMIN_PASSWORD) {
        throw new Error('Solo el administrador puede asignar roles de moderador');
      }

      // Validar email del usuario a promover
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(targetUserEmail)) {
        throw new Error('Email inválido');
      }

      // Simular actualización exitosa
      return {
        success: true,
        message: `Usuario ${targetUserEmail} promovido a moderador exitosamente`,
        userEmail: targetUserEmail,
        newRole: 'moderador',
      };
    } catch (error) {
      console.error('Assign moderator role error:', error);
      throw error;
    }
  },

  // Función para que el admin revoque rol de administrador a otro usuario
  revokeAdminRole: async (currentUserEmail, currentUserPassword, targetUserEmail) => {
    try {
      // Validar que quien intenta revocar sea el admin
      if (currentUserEmail !== ADMIN_EMAIL || currentUserPassword !== ADMIN_PASSWORD) {
        throw new Error('Solo el administrador puede revocar roles de administrador');
      }

      // No permitir revocar admin a kelib@gmail.com
      if (targetUserEmail === ADMIN_EMAIL) {
        throw new Error('No se puede revocar el rol de administrador al propietario de la plataforma');
      }

      // Validar email del usuario
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(targetUserEmail)) {
        throw new Error('Email inválido');
      }

      // Simular actualización exitosa
      return {
        success: true,
        message: `Rol de administrador revocado a ${targetUserEmail} exitosamente`,
        userEmail: targetUserEmail,
        newRole: 'usuario',
      };
    } catch (error) {
      console.error('Revoke admin role error:', error);
      throw error;
    }
  },

  // Función para que el admin revoque rol de moderador a otro usuario
  revokeModeratorRole: async (currentUserEmail, currentUserPassword, targetUserEmail) => {
    try {
      // Validar que quien intenta revocar sea el admin
      if (currentUserEmail !== ADMIN_EMAIL || currentUserPassword !== ADMIN_PASSWORD) {
        throw new Error('Solo el administrador puede revocar roles de moderador');
      }

      // Validar email del usuario
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(targetUserEmail)) {
        throw new Error('Email inválido');
      }

      // Simular actualización exitosa
      return {
        success: true,
        message: `Rol de moderador revocado a ${targetUserEmail} exitosamente`,
        userEmail: targetUserEmail,
        newRole: 'usuario',
      };
    } catch (error) {
      console.error('Revoke moderator role error:', error);
      throw error;
    }
  },
};
