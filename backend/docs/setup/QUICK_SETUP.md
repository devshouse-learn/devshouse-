# 🎯 Configuración Rápida - 5 Minutos

Guía ultra-rápida para empezar a desarrollar en DevsHouse.

---

## ⚡ 5 Pasos para Empezar

### 1️⃣ Clonar y Dependencias (1 min)

```bash
git clone https://github.com/devshouse-learn/devshouse-.git
cd devshouse-
cd frontend && npm install
cd ../backend && npm install
```

### 2️⃣ Variables de Entorno (1 min)

**Backend (backend/.env):**
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=devshouse
DB_PORT=5432
NODE_ENV=development
API_PORT=3001
```

**Frontend (frontend/.env):**
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=DevsHouse
```

### 3️⃣ Base de Datos (1 min)

```bash
# Si no tienes PostgreSQL, instálalo:
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql
# Windows: Descargar desde postgresql.org

# Crear base de datos
createdb devshouse

# Ejecutar migraciones
cd backend
npm run migrate  # (si está configurado)
```

### 4️⃣ Iniciar Proyecto (1 min)

```bash
# Opción A: Ambos servicios en una terminal
./scripts/start-all.sh

# Opción B: Cada uno en una terminal
# Terminal 1:
cd frontend && npm run dev

# Terminal 2:
cd backend && npm run dev
```

### 5️⃣ Verificar (1 min)

- Frontend: http://localhost:5173 ✅
- Backend: http://localhost:3001/api ✅
- Consola: Sin errores ✅

---

## 🚀 Listo para Desarrollar

```bash
# Crear rama de feature
git checkout -b feature/mi-feature

# Hacer cambios
# ... editar archivos ...

# Verificar calidad
npm run lint      # Frontend
npm run build     # Frontend

# Commit
git add .
git commit -m "feat: descripción"
git push origin feature/mi-feature

# Abrir PR en GitHub
```

---

## 📁 Estructura Mínima que Necesitas

### Frontend

```
frontend/src/
├── components/        ← Aquí van los componentes
│   ├── agreements/
│   ├── ventures/
│   └── layout/
├── services/          ← Aquí van las llamadas API
├── styles/            ← CSS global
└── App.jsx           ← Enrutador principal
```

### Backend

```
backend/src/
├── routes/            ← Definir rutas
├── models/            ← Definir esquemas
└── server.js          ← Punto de entrada
```

---

## ⚠️ Problemas Comunes

### ❌ "Cannot find module '@/...'"
```bash
# Probablemente falta instalar dependencias
cd frontend
npm install
```

### ❌ "Port 5173 already in use"
```bash
# Cambiar puerto
npm run dev -- --port 5174
```

### ❌ "Cannot connect to database"
```bash
# Verificar que PostgreSQL está corriendo
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Verificar credenciales en .env
```

### ❌ "CORS error"
```bash
# Verificar VITE_API_URL en frontend/.env
# Debe ser: http://localhost:3001/api
```

---

## 📚 Links Importantes

- 📖 [Documentación Completa](./docs/INDEX.md)
- 🚀 [Guía Rápida](./docs/guides/QUICK_START.md)
- ❌ [Manejo de Errores](./docs/guides/ERROR_HANDLING_GUIDE.md)
- 📝 [Guía de Contribución](./CONTRIBUTING.md)
- 🔗 [API Endpoints](./docs/api/README.md)

---

## 💡 Próximos Pasos

1. Lee [`docs/guides/QUICK_START.md`](./docs/guides/QUICK_START.md)
2. Explora los componentes en `frontend/src/components/`
3. Mira cómo funcionan los servicios en `frontend/src/services/`
4. Haz tu primer commit en una rama `feature/test`
5. Abre un PR dummy para practicar el flujo

---

## ✅ Checklist de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] `npm install` completado (both folders)
- [ ] `.env` archivos creados
- [ ] Base de datos `devshouse` creada
- [ ] `npm run dev` funciona
- [ ] http://localhost:5173 carga
- [ ] http://localhost:3001/api responde
- [ ] Sin errores en console

---

**¡Listo! Ahora a codear 🚀**

*¿Preguntas? Lee [`docs/INDEX.md`](./docs/INDEX.md) o abre un issue.*
