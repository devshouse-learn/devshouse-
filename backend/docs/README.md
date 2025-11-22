# 📚 Documentación DevsHouse# DevsHouse Backend



Esta carpeta contiene toda la documentación del proyecto DevsHouse.API REST para DevsHouse - Plataforma de Conexión Educativa y Laboral



---## 🚀 Características



## 🚀 Inicio Rápido- ✅ Autenticación con JWT

- ✅ Gestión de usuarios con roles (Admin, Moderador, Usuario)

**Para comenzar inmediatamente:**- ✅ CRUD para Convenios Educativos

- 📖 Lee **[QUICK_START.md](./QUICK_START.md)** - Inicio en 5 minutos- ✅ CRUD para Emprendimientos

- ✅ CRUD para Ofertas de Empleo

**Para documentación completa:**- ✅ CRUD para Candidatos

- 📘 Lee **[SISTEMA_COMPLETO.md](./SISTEMA_COMPLETO.md)** - Todo el sistema explicado- ✅ Validación de datos

- ✅ Manejo de errores centralizado

---- ✅ CORS configurado



## 📑 Índice de Documentos## 🛠️ Tecnologías



### Documentación Principal- **Node.js** - Runtime JavaScript

- **Express.js** - Framework web

| Documento | Descripción |- **MongoDB** - Base de datos NoSQL

|-----------|-------------|- **Mongoose** - ODM para MongoDB

| **[INDEX.md](./INDEX.md)** | Índice maestro de toda la documentación |- **JWT** - Autenticación

| **[QUICK_START.md](./QUICK_START.md)** | Guía de inicio rápido en 5 minutos |- **bcryptjs** - Encriptación de contraseñas

| **[SISTEMA_COMPLETO.md](./SISTEMA_COMPLETO.md)** | Documentación completa del sistema (1500 líneas) |

| **[FILE_MAP.md](./FILE_MAP.md)** | Mapa de todos los archivos del proyecto |## 📁 Estructura del Proyecto

| **[VERIFICATION.md](./VERIFICATION.md)** | Verificación de que todo está guardado |

| **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** | Resumen ejecutivo del sistema |```

backend/

### Guías Específicas por Sistema├── src/

│   ├── index.js                 # Punto de entrada

| Guía | Sistema | Descripción |│   ├── config/                  # Configuración

|------|---------|-------------|│   │   └── database.js

| **[MONITORING_SYSTEM.md](./MONITORING_SYSTEM.md)** | Logging y Monitoreo | Sistema de logs, errores y alertas |│   ├── models/                  # Modelos de datos

| **[AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md)** | Asistente AI | Diagnóstico automático y ayuda |│   │   ├── User.js

| **[EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md)** | Verificación Email | Sistema de verificación con nodemailer |│   │   ├── Agreement.js

| **[EMAIL_VALIDATION_REAL_GUIDE.md](./EMAIL_VALIDATION_REAL_GUIDE.md)** | Validación Email | Validación real con DNS/SMTP |│   │   ├── Venture.js

│   │   ├── Job.js

### Documentación por Componente│   │   └── Candidate.js

│   ├── routes/                  # Rutas API

| Documento | Componente |│   │   ├── auth.js

|-----------|-----------|│   │   ├── users.js

| **[backend-README.md](./backend-README.md)** | Backend | Documentación técnica del backend |│   │   ├── agreements.js

| **[frontend-README.md](./frontend-README.md)** | Frontend | Documentación del frontend |│   │   ├── ventures.js

│   │   ├── jobs.js

---│   │   └── candidates.js

│   ├── controllers/             # Lógica de negocio

## 📂 Carpeta Archive│   │   ├── authController.js

│   │   ├── userController.js

La carpeta `archive/` contiene documentación antigua o histórica que ya no está en uso activo pero se mantiene como referencia.│   │   ├── agreementController.js

│   │   ├── ventureController.js

---│   │   ├── jobController.js

│   │   └── candidateController.js

## 🎯 Guía de Uso│   ├── middleware/              # Middlewares

│   │   ├── auth.js

### Si eres nuevo en el proyecto:│   │   ├── errorHandler.js

│   │   └── validation.js

1. **Empieza aquí:** [QUICK_START.md](./QUICK_START.md)│   └── utils/                   # Utilidades

2. **Navega el código:** [FILE_MAP.md](./FILE_MAP.md)│       ├── logger.js

3. **Aprende un sistema específico:** Lee la guía correspondiente│       └── validators.js

4. **Detalles profundos:** [SISTEMA_COMPLETO.md](./SISTEMA_COMPLETO.md)├── .env.example                 # Variables de entorno (ejemplo)

├── package.json

### Si buscas información específica:└── README.md

```

**¿Cómo funciona el logging?**  

→ [MONITORING_SYSTEM.md](./MONITORING_SYSTEM.md)## 🚀 Inicio Rápido



**¿Cómo usar el asistente AI?**  ### Prerrequisitos

→ [AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md)

- Node.js >= 16

**¿Cómo configurar emails?**  - npm o yarn

→ [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md)- MongoDB (local o Atlas)



**¿Cómo validar emails reales?**  ### Instalación

→ [EMAIL_VALIDATION_REAL_GUIDE.md](./EMAIL_VALIDATION_REAL_GUIDE.md)

```bash

**¿Dónde está cada archivo?**  # Clonar repositorio

→ [FILE_MAP.md](./FILE_MAP.md)git clone <url-del-repositorio>

cd devshouse-/backend

---

# Instalar dependencias

## 📊 Estadísticas de Documentaciónnpm install



- **Total de documentos:** 11# Crear archivo .env

- **Líneas de documentación:** ~4,300cp .env.example .env

- **Sistemas documentados:** 4

- **Guías específicas:** 4# Ejecutar en desarrollo

npm run dev

---```



## 🔄 Última Actualización### Scripts Disponibles



**Fecha:** 22 de noviembre de 2025  ```bash

**Versión:** 1.0.0  npm run start    # Ejecutar en producción

**Estado:** ✅ Completonpm run dev      # Ejecutar con hot-reload (nodemon)

npm run lint     # Ejecutar linter

---npm run test     # Ejecutar tests

```

Volver a: [README principal](../README.md)

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
