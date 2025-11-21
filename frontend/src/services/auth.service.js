import apiService from './api.service';

const ADMIN_EMAIL = 'kelib@gmail.com';
const ADMIN_PASSWORD = '03v5h0u53';

export const authService = {
  // Simulamos un login (cuando backend esté listo, descomentar la llamada API)
  login: async (email, password) => {
    try {
      // Cuando backend esté listo, descomentar:
      // return await apiService.post('/auth/login', { email, password });

      // Simulación local para desarrollo
      if (!email || !password) {
        throw new Error('Email y contraseña requeridos');
      }

      // Validación básica
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      // Determinar rol: solo kelib@gmail.com con contraseña correcta es admin
      let role = 'usuario';
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        role = 'admin';
      }

      // Simular respuesta exitosa
      return {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: role,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Simulamos un registro
  register: async (name, email, password, confirmPassword, role = 'usuario', adminCode = '') => {
    try {
      // Cuando backend esté listo, descomentar:
      // return await apiService.post('/auth/register', { name, email, password, role, adminCode });

      // Validaciones básicas
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Todos los campos son requeridos');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      if (role !== 'usuario') {
        throw new Error('Solo se puede registrar como usuario. Los moderadores son asignados por el administrador');
      }

      // Simular respuesta exitosa
      return {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: role,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
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
