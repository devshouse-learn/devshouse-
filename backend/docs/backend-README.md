# DevsHouse Backend

API REST para DevsHouse - Plataforma de Conexión Educativa y Laboral

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Gestión de usuarios con roles (Admin, Moderador, Usuario)
- ✅ CRUD para Convenios Educativos
- ✅ CRUD para Emprendimientos
- ✅ CRUD para Ofertas de Empleo
- ✅ CRUD para Candidatos
- ✅ Validación de datos
- ✅ Manejo de errores centralizado
- ✅ CORS configurado

## 🛠️ Tecnologías

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── index.js                 # Punto de entrada
│   ├── config/                  # Configuración
│   │   └── database.js
│   ├── models/                  # Modelos de datos
│   │   ├── User.js
│   │   ├── Agreement.js
│   │   ├── Venture.js
│   │   ├── Job.js
│   │   └── Candidate.js
│   ├── routes/                  # Rutas API
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── agreements.js
│   │   ├── ventures.js
│   │   ├── jobs.js
│   │   └── candidates.js
│   ├── controllers/             # Lógica de negocio
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── agreementController.js
│   │   ├── ventureController.js
│   │   ├── jobController.js
│   │   └── candidateController.js
│   ├── middleware/              # Middlewares
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   └── utils/                   # Utilidades
│       ├── logger.js
│       └── validators.js
├── .env.example                 # Variables de entorno (ejemplo)
├── package.json
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 16
- npm o yarn
- MongoDB (local o Atlas)

### Instalación

```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd devshouse-/backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run start    # Ejecutar en producción
npm run dev      # Ejecutar con hot-reload (nodemon)
npm run lint     # Ejecutar linter
npm run test     # Ejecutar tests
```

## 🔐 Autenticación

El API utiliza JWT (JSON Web Tokens) para la autenticación.

### Obtener Token

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Respuesta

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "usuario@example.com",
    "role": "usuario"
  }
}
```

### Usar Token

```bash
GET /api/users/profile
Authorization: Bearer <token>
```

## 🔗 Endpoints Principales

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh-token` - Refrescar token

### Usuarios

- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Convenios

- `GET /api/agreements` - Listar convenios
- `POST /api/agreements` - Crear convenio
- `GET /api/agreements/:id` - Obtener convenio
- `PUT /api/agreements/:id` - Actualizar convenio
- `DELETE /api/agreements/:id` - Eliminar convenio

### Emprendimientos

- `GET /api/ventures` - Listar emprendimientos
- `POST /api/ventures` - Crear emprendimiento
- `GET /api/ventures/:id` - Obtener emprendimiento
- `PUT /api/ventures/:id` - Actualizar emprendimiento
- `DELETE /api/ventures/:id` - Eliminar emprendimiento

### Ofertas de Empleo

- `GET /api/jobs` - Listar empleos
- `POST /api/jobs` - Crear empleo (admin)
- `GET /api/jobs/:id` - Obtener empleo
- `PUT /api/jobs/:id` - Actualizar empleo (admin)
- `DELETE /api/jobs/:id` - Eliminar empleo (admin)

### Candidatos

- `GET /api/candidates` - Listar candidatos
- `POST /api/candidates` - Crear candidato
- `GET /api/candidates/:id` - Obtener candidato
- `PUT /api/candidates/:id` - Actualizar candidato
- `DELETE /api/candidates/:id` - Eliminar candidato

## 📊 Roles y Permisos

### Admin
- Gestión completa de usuarios
- Asignación de roles
- CRUD completo en todas las entidades
- Acceso a estadísticas

### Moderador
- Moderación de contenido
- Visualización de estadísticas
- Edición limitada

### Usuario
- Crear y editar sus propios registros
- Búsqueda de empleos
- Acceso a convenios

## 🔧 Variables de Entorno

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/devshouse

# JWT
JWT_SECRET=tu-super-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# API
API_VERSION=v1
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Equipo

DevsHouse - Conectando talento con oportunidades

---

**Desarrollado con ❤️ por DevsHouse**
