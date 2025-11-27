const ADMIN_EMAIL = 'kelib@gmail.com';
const ADMIN_PASSWORD = '03v5h0u53';
const REGISTERED_USERS_KEY = 'devshouse_registered_users';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== HELPER FUNCTIONS =====

const getRegisteredUsers = () => {
  try {
    const users = localStorage.getItem(REGISTERED_USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error al obtener usuarios registrados:', error);
    return [];
  }
};

const saveRegisteredUser = (user) => {
  try {
    const users = getRegisteredUsers();
    users.push({
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuario registrado:', error);
  }
};

const findUserByEmail = (email) => {
  const users = getRegisteredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const validateAdminAccess = (email, password) => {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new Error('Solo el administrador puede realizar esta acción');
  }
};

const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Email inválido');
  }
};

// ===== ROLE MANAGEMENT FACTORY =====

const createRoleChangeFunction = (roleToAssign, description) => async (currentUserEmail, currentUserPassword, targetUserEmail) => {
  try {
    validateAdminAccess(currentUserEmail, currentUserPassword);
    validateEmail(targetUserEmail);

    if (roleToAssign === 'admin' && targetUserEmail === ADMIN_EMAIL) {
      throw new Error('No se puede revocar el rol de administrador al propietario de la plataforma');
    }

    return {
      success: true,
      message: `${description} exitosamente para ${targetUserEmail}`,
      userEmail: targetUserEmail,
      newRole: roleToAssign,
    };
  } catch (error) {
    console.error(`${description} error:`, error);
    throw error;
  }
};

export const authService = {
  login: async (email, password) => {
    try {
      email = email?.trim().toLowerCase() || '';
      password = password?.trim() || '';

      if (!email || !password) {
        throw new Error('Email y contraseña requeridos');
      }

      validateEmail(email);

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

      const existingUser = findUserByEmail(email);
      if (!existingUser) {
        throw new Error('Esta cuenta no está registrada. Por favor, crea una cuenta primero.');
      }

      if (existingUser.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

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

  register: async (name, email, password, confirmPassword, role = 'usuario') => {
    try {
      name = name?.trim() || '';
      email = email?.trim().toLowerCase() || '';
      password = password?.trim() || '';
      confirmPassword = confirmPassword?.trim() || '';

      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Todos los campos son requeridos');
      }

      if (name.length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }

      validateEmail(email);

      if (email === ADMIN_EMAIL) {
        throw new Error('Este correo electrónico ya está registrado como administrador');
      }

      if (findUserByEmail(email)) {
        throw new Error('Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (role !== 'usuario') {
        throw new Error('Solo se puede registrar como usuario. Los moderadores son asignados por el administrador');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };

      saveRegisteredUser(newUser);

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

  logout: () => Promise.resolve(),

  validateToken: async (token) => {
    try {
      return !!token;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  assignAdminRole: createRoleChangeFunction('admin', 'Rol de administrador asignado'),
  assignModeratorRole: createRoleChangeFunction('moderador', 'Rol de moderador asignado'),
  revokeAdminRole: createRoleChangeFunction('usuario', 'Rol de administrador revocado'),
  revokeModeratorRole: createRoleChangeFunction('usuario', 'Rol de moderador revocado'),
};
