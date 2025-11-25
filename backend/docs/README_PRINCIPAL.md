# 🎓 DevsHouse - Plataforma de Conexión Educativa y Laboral

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-red)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-✅%20Production%20Ready-brightgreen)](https://github.com)

Plataforma digital que conecta instituciones educativas, emprendedores y empresas en un ecosistema colaborativo.

---

## 📋 Tabla de Contenidos

1. [Empezar Rápido](#-empezar-rápido)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Tecnologías](#-tecnologías)
4. [Documentación](#-documentación)
5. [Desarrollo](#-desarrollo)
6. [Despliegue](#-despliegue)
7. [Soporte](#-soporte)

---

## 🚀 Empezar Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/devshouse-learn/devshouse-.git
cd devshouse-

# 2. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Iniciar el proyecto
./scripts/start-all.sh
```

**Resultado:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api

---

## 📁 Estructura del Proyecto

```
devshouse-/
├── 📁 docs/                    ← Documentación completa
│   ├── guides/                 ← Guías de desarrollo
│   ├── reports/                ← Reportes técnicos
│   ├── api/                    ← Documentación de API
│   └── INDEX.md                ← Índice de documentación
│
├── 📁 scripts/                 ← Scripts automáticos
│   ├── start-all.sh
│   ├── start-backend.sh
│   ├── start-frontend.sh
│   └── start-dev.sh
│
├── 📁 frontend/                ← Aplicación React
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/                 ← Servidor Node.js
│   ├── src/
│   ├── package.json
│   └── .env
│
└── 📄 README.md                ← Este archivo
```

**Para más detalles:** Consulta [`docs/STRUCTURE.md`](./docs/STRUCTURE.md)

---

## 🛠️ Tecnologías

### Frontend
- **React 19.2** - UI moderna y reactiva
- **Vite 7.2** - Build tool rápido
- **React Router** - Navegación
- **CSS Grid/Flexbox** - Responsive design

### Backend
- **Node.js + Express** - Servidor HTTP
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **AWS RDS** - Base de datos en producción

### DevOps
- **ESLint** - Análisis de código
- **Vitest** (próximo) - Testing
- **Docker** (futuro) - Containerización

---

## 📚 Documentación

### 🎓 Para Empezar
1. [`docs/guides/QUICK_START.md`](./docs/guides/QUICK_START.md) - Guía de 30 segundos
2. [`docs/guides/ERROR_HANDLING_GUIDE.md`](./docs/guides/ERROR_HANDLING_GUIDE.md) - Cómo manejar errores
3. [`docs/INDEX.md`](./docs/INDEX.md) - Índice completo

### 📊 Reportes
- [`docs/reports/FINAL_REPORT.md`](./docs/reports/FINAL_REPORT.md) - Reporte completo
- [`docs/reports/FIXES_SUMMARY.md`](./docs/reports/FIXES_SUMMARY.md) - Errores arreglados

### 🔍 Referencias
- [`docs/guides/REFERENCE.md`](./docs/guides/REFERENCE.md) - Referencia rápida
- [`docs/guides/TESTING_GUIDE.md`](./docs/guides/TESTING_GUIDE.md) - Guía de testing
- [`docs/api/README.md`](./docs/api/README.md) - Documentación de API

---

## 💻 Desarrollo

### Estructura de Carpetas (Frontend)

```
frontend/src/
├── components/        → Componentes React
│   ├── agreements/   → Convenios
│   ├── ventures/     → Emprendimientos
│   ├── jobs/         → Empleos
│   ├── layout/       → Layout principal
│   └── common/       → Componentes reutilizables
├── services/          → API y servicios
├── hooks/             → Hooks personalizados
├── context/           → Context API
└── styles/            → CSS global
```

### Estructura de Carpetas (Backend)

```
backend/src/
├── routes/            → Rutas de API
├── models/            → Modelos de Sequelize
├── services/          → Lógica de negocio
├── middleware/        → Middleware Express
├── config/            → Configuración
└── utils/             → Utilidades
```

### Comandos Útiles

```bash
# Frontend
cd frontend
npm run dev          # Iniciar desarrollo
npm run build        # Build para producción
npm run lint         # ESLint check
npm run preview      # Preview de build

# Backend
cd backend
npm run dev          # Iniciar con nodemon
npm start            # Iniciar producción

# Ambos
./scripts/start-all.sh      # Iniciar todo
./scripts/start-backend.sh  # Solo backend
./scripts/start-frontend.sh # Solo frontend
```

---

## 📈 Estado del Proyecto

### ✅ Completado
- [x] Autenticación básica con contexto
- [x] CRUD de convenios, emprendimientos, empleos
- [x] Validación de formularios
- [x] Error handling global (ErrorBoundary)
- [x] Documentación completa (7,000+ palabras)
- [x] 6 errores arreglados
- [x] 6 herramientas preventivas creadas

### 🚧 En Progreso
- [ ] Tests automáticos (Vitest)
- [ ] Autenticación JWT
- [ ] Búsqueda avanzada
- [ ] Dashboard de administrador

### 📋 Próximo
- [ ] Mobile app (React Native)
- [ ] Notificaciones en tiempo real
- [ ] Sistema de mensajería
- [ ] Integraciones externas

---

## 🔒 Seguridad

### Configuración Recomendada

```bash
# Backend .env
DB_HOST=rds-endpoint
DB_USER=postgres
DB_PASSWORD=secure_password
DB_NAME=devshouse
NODE_ENV=production
JWT_SECRET=your_secret_key

# Frontend .env
VITE_API_URL=https://api.devshouse.com
VITE_APP_NAME=DevsHouse
```

### Best Practices
- ✅ Validar entrada del usuario
- ✅ Usar HTTPS en producción
- ✅ Variables de entorno para secretos
- ✅ CORS configurado correctamente
- ✅ Rate limiting en API

---

## 🚀 Despliegue

### Desarrollo
```bash
./scripts/start-all.sh
```

### Producción
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

### Con Docker (Futuro)
```bash
docker-compose up -d
```

---

## 📞 Soporte

### Documentación
- 📚 [`docs/INDEX.md`](./docs/INDEX.md) - Índice completo
- 🔍 [`docs/guides/REFERENCE.md`](./docs/guides/REFERENCE.md) - Referencia rápida
- ❌ [`docs/guides/ERROR_HANDLING_GUIDE.md`](./docs/guides/ERROR_HANDLING_GUIDE.md) - Manejo de errores
- 🧪 [`docs/guides/TESTING_GUIDE.md`](./docs/guides/TESTING_GUIDE.md) - Testing

### Contacto
- **Email:** support@devshouse.com
- **WhatsApp:** [Links en plataforma]
- **Discord:** [Comunidad]

### Reportar Errores
1. Documenta exactamente qué hiciste
2. Adjunta screenshot del error
3. Incluye logs del navegador (F12)
4. Abre issue en GitHub

---

## 📄 Licencia

Este proyecto es propiedad de DevsHouse. Todos los derechos reservados.

---

## 👥 Contribuyentes

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Sequelize
- **DevOps:** AWS RDS

---

## 📊 Estadísticas

- **Componentes:** 20+
- **Endpoints API:** 15+
- **Documentación:** 7,000+ palabras
- **Herramientas:** 6
- **Errores Arreglados:** 6
- **Líneas de Código:** 5,000+

---

## ✨ Próximas Funcionalidades

- [ ] Búsqueda por IA
- [ ] Recomendaciones personalizadas
- [ ] Sistema de calificaciones
- [ ] Certificaciones digitales
- [ ] Integraciones con universidades
- [ ] Portal de empleador mejorado

---

**Última actualización:** 25 de Noviembre 2025
**Status:** ✅ Producción Ready
**Version:** 1.0.0

---

*Para empezar, lee [`docs/guides/QUICK_START.md`](./docs/guides/QUICK_START.md)*
