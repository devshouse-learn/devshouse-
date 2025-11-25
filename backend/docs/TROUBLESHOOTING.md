# 🔧 Troubleshooting - Resolución de Problemas

Guía para resolver los problemas más comunes en DevsHouse.

---

## 📋 Índice Rápido

1. [Problemas de Instalación](#problemas-de-instalación)
2. [Errores de Desarrollo](#errores-de-desarrollo)
3. [Problemas de Base de Datos](#problemas-de-base-de-datos)
4. [Errores de Frontend](#errores-de-frontend)
5. [Errores de Backend](#errores-de-backend)
6. [Problemas de Puerto](#problemas-de-puerto)

---

## 🔨 Problemas de Instalación

### ❌ "npm install falla"

**Síntoma:**
```
npm ERR! code E404
npm ERR! 404 Not Found - GET ...
```

**Solución:**

```bash
# 1. Limpiar caché
npm cache clean --force

# 2. Eliminar node_modules
rm -rf node_modules package-lock.json

# 3. Reinstalar
npm install

# 4. Si persiste, usar npm ci (versión exacta)
npm ci
```

### ❌ "Node version incompatible"

**Síntoma:**
```
This version of npm is only compatible with Node v18.x or higher
```

**Solución:**

```bash
# Verificar versión
node --version

# Actualizar Node.js
# macOS: brew upgrade node
# Ubuntu: sudo apt-get upgrade nodejs
# Windows: Descargar desde nodejs.org

# O usar nvm (recomendado)
nvm install 18
nvm use 18
```

### ❌ "npm: command not found"

**Solución:**
```bash
# Reinstalar Node.js
# macOS: brew install node
# Ubuntu: sudo apt-get install nodejs npm
# Windows: Descargar desde nodejs.org
```

---

## 🚨 Errores de Desarrollo

### ❌ "Cannot find module '@/...'"

**Síntoma:**
```
Module not found: Error: Can't resolve '@/components/...'
```

**Solución:**

```bash
# 1. Limpiar caché Vite
rm -rf frontend/node_modules/.vite

# 2. Verificar alias en vite.config.js
# Debe tener: alias { '@': resolve(__dirname, './src') }

# 3. Reinstalar
cd frontend
npm install

# 4. Reiniciar dev server
npm run dev
```

### ❌ "Módulo cargado pero no funciona"

**Síntoma:**
```
ReferenceError: Cannot find name 'useState'
```

**Solución:**

```javascript
// ❌ INCORRECTO - falta import
const [count, setCount] = useState(0);

// ✅ CORRECTO - agregar import
import { useState } from 'react';
const [count, setCount] = useState(0);
```

### ❌ "Componente no renderiza"

**Checklist:**

```javascript
// 1. ¿Tiene export default?
export default MiComponente;

// 2. ¿Se importa correctamente?
import MiComponente from '@/components/MiComponente';

// 3. ¿Se usa en JSX?
<MiComponente />

// 4. ¿Tiene props requeridos?
<MiComponente prop1="valor" />

// 5. ¿No hay errores en console?
// Abre DevTools (F12) y revisa
```

---

## 💾 Problemas de Base de Datos

### ❌ "psql: command not found"

**Solución:**

```bash
# macOS
brew install postgresql@15

# Ubuntu
sudo apt-get install postgresql-15

# Agregar a PATH (si es necesario)
export PATH=/usr/local/opt/postgresql@15/bin:$PATH
```

### ❌ "FATAL: database does not exist"

**Síntoma:**
```
error: database "devshouse" does not exist
```

**Solución:**

```bash
# 1. Conectar a postgres
psql -U postgres

# 2. En psql, crear base de datos
CREATE DATABASE devshouse;

# 3. Salir
\q

# 4. Ejecutar migraciones
cd backend
npm run migrate
```

### ❌ "Cannot connect to database"

**Síntoma:**
```
connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:**

```bash
# 1. Verificar que PostgreSQL está corriendo
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql

# 2. Verificar puerto (debería ser 5432)
netstat -an | grep 5432

# 3. Verificar credenciales en backend/.env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432

# 4. Test de conexión
psql -h localhost -U postgres -d devshouse
```

### ❌ "Authentication failed"

**Síntoma:**
```
error: role "postgres" does not exist
```

**Solución:**

```bash
# 1. En macOS, el usuario default es diferente
# En lugar de "postgres", puede ser tu usuario del sistema

# 2. Verificar usuarios
psql -U postgres -c "SELECT rolname FROM pg_roles;"

# 3. Actualizar .env
DB_USER=tu_usuario

# 4. O crear usuario postgres
createuser postgres
```

---

## 🎨 Errores de Frontend

### ❌ "Styles no aplican"

**Checklist:**

```javascript
// 1. ¿Se importó el CSS?
import './MiComponente.css';

// 2. ¿Existe el archivo?
// Verificar que MiComponente.css existe

// 3. ¿El className es correcto?
<div className="mi-componente">  {/* ✅ */}
<div className="miComponente">  {/* ❌ */}

// 4. ¿Sin conflictos de CSS?
// Usar BEM: .component-name, .component-name__element
```

### ❌ "CORS error"

**Síntoma:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:**

```javascript
// 1. Verificar VITE_API_URL en .env
VITE_API_URL=http://localhost:3001/api

// 2. Backend debe permitir CORS
// En backend/src/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 3. Request debe incluir credenciales si es necesario
fetch(url, {
  credentials: 'include'
});
```

### ❌ "AuthModal no cierra"

**Solución:**

```javascript
// 1. Verificar que setIsOpen se llama
const handleSuccess = () => {
  setIsOpen(false);  // ← Debe estar
  // Redireccionar si es necesario
};

// 2. Verificar que AuthModal recibe isOpen y setIsOpen
<AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />

// 3. Verificar que AuthContext actualiza user
const { user } = useAuth();
useEffect(() => {
  if (user) setIsOpen(false);
}, [user]);
```

---

## ⚙️ Errores de Backend

### ❌ "Cannot find module 'express'"

**Solución:**

```bash
cd backend
npm install
```

### ❌ "Nodemon no reinicia"

**Síntoma:**
```
Cambios no se reflejan automáticamente
```

**Solución:**

```bash
# 1. Verificar que nodemon está instalado
npm list nodemon

# 2. Reinstalar si es necesario
npm install --save-dev nodemon

# 3. Verificar package.json
"scripts": {
  "dev": "nodemon src/server.js"
}

# 4. Reiniciar
npm run dev

# 5. Si persiste, usar node puro
# node src/server.js
```

### ❌ "Route not found (404)"

**Solución:**

```javascript
// 1. Verificar que la ruta existe
// backend/src/routes/users.js
router.get('/:id', getUser);

// 2. Verificar que está registrada
// backend/src/server.js
app.use('/api/users', userRoutes);

// 3. URL completa sería
GET http://localhost:3001/api/users/1

// 4. Verificar método HTTP
// ¿Es GET? ¿POST?
```

### ❌ "Port already in use"

**Síntoma:**
```
Error: listen EADDRINUSE :::3001
```

**Solución:**

```bash
# Opción 1: Cambiar puerto en .env
API_PORT=3002

# Opción 2: Liberar el puerto
# macOS/Ubuntu
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Opción 3: Usar script para empezar desde cero
./scripts/start-all.sh
```

---

## 🔌 Problemas de Puerto

### ❌ "Port 5173 already in use"

**Solución:**

```bash
# Opción 1: Usar puerto diferente
npm run dev -- --port 5174

# Opción 2: Matar proceso
# macOS/Ubuntu
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### ❌ "Cannot reach localhost:5173"

**Checklist:**

```bash
# 1. Verificar que server está corriendo
# Debería ver algo como:
# Local: http://127.0.0.1:5173/

# 2. Acceder por URL correcta
http://localhost:5173  ✅
http://127.0.0.1:5173  ✅
http://192.168.1.x:5173 (otro dispositivo) ✅

# 3. Firewall (si en red corporativa)
# Contactar a IT para abrir puerto 5173
```

---

## 🔍 Debugging

### Ver logs del servidor

```bash
# Backend
cd backend
npm run dev
# Ver output en terminal

# Frontend (DevTools)
F12 → Console
```

### Verificar variables de entorno

```bash
# Backend
echo $VITE_API_URL

# Frontend (en browser console)
console.log(import.meta.env.VITE_API_URL)
```

### Probar API directamente

```bash
# GET
curl http://localhost:3001/api/agreements

# POST
curl -X POST http://localhost:3001/api/agreements \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

---

## 📞 Escalación

Si el problema persiste:

1. **Revisar logs completos**
   ```bash
   npm run dev 2>&1 | tee logs.txt
   ```

2. **Abrir issue en GitHub**
   - Adjuntar logs
   - Describir pasos exactos
   - Incluir versiones (node --version, npm --version)

3. **Contactar soporte**
   - support@devshouse.com
   - Discord: [enlace]

---

## ✅ Checklist de Verificación

- [ ] Node.js 18+
- [ ] PostgreSQL corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada
- [ ] Puertos disponibles (5173, 3001, 5432)
- [ ] Sin errores en console
- [ ] Frontend carga en http://localhost:5173
- [ ] Backend responde en http://localhost:3001/api

---

**¿Aún hay problema? Lee [`docs/guides/ERROR_HANDLING_GUIDE.md`](./docs/guides/ERROR_HANDLING_GUIDE.md)**
