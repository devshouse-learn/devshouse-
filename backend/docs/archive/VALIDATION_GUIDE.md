# 🔒 Guía de Validaciones - User Model

## ✅ Validaciones Implementadas

### 1. **Email Único (No Repetido)**

#### Validación Automática:
```javascript
email: {
  unique: true,
  validate: {
    validator: async function(email) {
      const user = await mongoose.models.User.findOne({ email });
      if (user && user._id.toString() !== this._id?.toString()) {
        return false;
      }
      return true;
    },
    message: 'Este correo electrónico ya está registrado',
  },
}
```

#### Cómo Funciona:
- ✅ Verifica si ya existe un usuario con ese email
- ✅ Permite actualizar el mismo usuario sin error
- ✅ Mensaje claro: "Este correo electrónico ya está registrado"

#### Método Estático:
```javascript
// Verificar si email está en uso
const emailTaken = await User.isEmailTaken('test@example.com');
// Verificar excluyendo un usuario específico
const emailTaken = await User.isEmailTaken('test@example.com', userId);
```

---

### 2. **Contraseña Única (No Repetida)**

#### Validación Automática:
```javascript
password: {
  validate: {
    validator: async function(password) {
      const users = await mongoose.models.User.find({}).select('+password');
      
      for (const user of users) {
        if (user._id.toString() === this._id?.toString()) continue;
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) return false;
      }
      
      return true;
    },
    message: 'Esta contraseña ya está en uso por otro usuario',
  },
}
```

#### Cómo Funciona:
- ✅ Compara la nueva contraseña con todas las contraseñas hasheadas
- ✅ Usa bcrypt para comparación segura
- ✅ Excluye al usuario actual de la comparación
- ✅ Mensaje claro: "Esta contraseña ya está en uso por otro usuario"

#### Método Estático:
```javascript
// Verificar si contraseña está en uso
const passwordInUse = await User.isPasswordInUse('myPassword123');
// Verificar excluyendo un usuario específico
const passwordInUse = await User.isPasswordInUse('myPassword123', userId);
```

---

### 3. **Hash Automático de Contraseñas**

#### Middleware Pre-Save:
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

#### Cómo Funciona:
- ✅ Solo hashea si la contraseña fue modificada
- ✅ Detecta si ya está hasheada (evita doble hash)
- ✅ Usa bcrypt con salt de factor 10

---

## 📋 Ejemplos de Uso

### Crear Usuario
```javascript
import User from './models/User.js';

// Intento 1: Usuario nuevo
const user1 = new User({
  name: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'password123',
  role: 'usuario'
});

await user1.save(); // ✅ Éxito - Email y contraseña únicos

// Intento 2: Email duplicado
const user2 = new User({
  name: 'María García',
  email: 'juan@example.com', // ❌ Email ya existe
  password: 'differentPassword',
  role: 'usuario'
});

await user2.save(); // ❌ Error: "Este correo electrónico ya está registrado"

// Intento 3: Contraseña duplicada
const user3 = new User({
  name: 'Carlos López',
  email: 'carlos@example.com',
  password: 'password123', // ❌ Contraseña ya en uso
  role: 'usuario'
});

await user3.save(); // ❌ Error: "Esta contraseña ya está en uso por otro usuario"
```

---

### Verificar Antes de Crear

```javascript
// Verificar email antes de crear usuario
const emailExists = await User.isEmailTaken('test@example.com');
if (emailExists) {
  throw new Error('El email ya está registrado');
}

// Verificar contraseña antes de crear usuario
const passwordExists = await User.isPasswordInUse('myPassword123');
if (passwordExists) {
  throw new Error('Esta contraseña ya está en uso');
}

// Si todo está bien, crear usuario
const newUser = new User({
  name: 'Usuario Nuevo',
  email: 'test@example.com',
  password: 'myPassword123',
});

await newUser.save();
```

---

### Actualizar Usuario

```javascript
// Actualizar email (verificar que no esté en uso)
const userId = '507f1f77bcf86cd799439011';
const newEmail = 'newemail@example.com';

const emailTaken = await User.isEmailTaken(newEmail, userId);
if (emailTaken) {
  throw new Error('El email ya está en uso por otro usuario');
}

const user = await User.findById(userId);
user.email = newEmail;
await user.save(); // ✅ Actualización exitosa

// Actualizar contraseña (verificar que no esté en uso)
const newPassword = 'newPassword123';

const passwordInUse = await User.isPasswordInUse(newPassword, userId);
if (passwordInUse) {
  throw new Error('Esta contraseña ya está en uso');
}

user.password = newPassword;
await user.save(); // ✅ Se hashea automáticamente
```

---

### Comparar Contraseñas (Login)

```javascript
// Encontrar usuario por email
const user = await User.findOne({ email: 'juan@example.com' })
  .select('+password'); // Incluir contraseña (por defecto está oculta)

if (!user) {
  throw new Error('Usuario no encontrado');
}

// Comparar contraseña
const isMatch = await user.comparePassword('password123');

if (!isMatch) {
  throw new Error('Contraseña incorrecta');
}

// Login exitoso
console.log('Login exitoso');
```

---

## 🔐 Seguridad Implementada

### Email:
- ✅ Único en la base de datos (índice único)
- ✅ Validación de formato con regex
- ✅ Convertido a minúsculas automáticamente
- ✅ Trimmed (sin espacios)
- ✅ Verificación personalizada contra duplicados

### Contraseña:
- ✅ Mínimo 6 caracteres
- ✅ Hasheada con bcrypt (salt factor 10)
- ✅ No incluida en consultas por defecto (select: false)
- ✅ Verificación contra duplicados con comparación segura
- ✅ Método de comparación integrado

---

## ⚠️ Consideraciones de Rendimiento

### Validación de Contraseña Duplicada:
La validación de contraseña duplicada requiere:
1. Cargar todos los usuarios con contraseñas
2. Comparar cada una con bcrypt

**Impacto**: Puede ser lento con muchos usuarios.

**Soluciones**:
1. Limitar a los últimos N usuarios
2. Usar caché de contraseñas comunes
3. Hacer la validación opcional según el tamaño de la BD

**Alternativa Optimizada**:
```javascript
// Solo validar contra los últimos 1000 usuarios
const users = await mongoose.models.User.find({})
  .sort({ createdAt: -1 })
  .limit(1000)
  .select('+password');
```

---

## 📊 Mensajes de Error

| Validación | Mensaje |
|-----------|---------|
| Email duplicado | "Este correo electrónico ya está registrado" |
| Email inválido | "Por favor proporciona un email válido" |
| Contraseña duplicada | "Esta contraseña ya está en uso por otro usuario. Por favor elige una diferente" |
| Contraseña corta | "La contraseña debe tener al menos 6 caracteres" |
| Email requerido | "Por favor proporciona un email" |
| Contraseña requerida | "Por favor proporciona una contraseña" |

---

## ✅ Estado

**Validaciones**: ✅ Completamente implementadas
**Hash automático**: ✅ Funcionando
**Métodos estáticos**: ✅ Disponibles
**Seguridad**: ✅ Nivel alto

---

**Última actualización**: 22 de noviembre de 2025
**Versión**: 1.0
