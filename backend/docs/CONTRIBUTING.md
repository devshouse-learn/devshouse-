# 📝 Guía de Contribución

Gracias por interesarte en contribuir a **DevsHouse**. Esta guía te ayudará a colaborar de manera efectiva.

---

## 📋 Tabla de Contenidos

1. [Antes de Empezar](#antes-de-empezar)
2. [Flujo de Desarrollo](#flujo-de-desarrollo)
3. [Estándares de Código](#estándares-de-código)
4. [Convenciones de Commits](#convenciones-de-commits)
5. [Pull Requests](#pull-requests)
6. [Reportar Bugs](#reportar-bugs)

---

## Antes de Empezar

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- Git
- Conocimiento básico de React y Node.js

### Entorno Local

```bash
# 1. Fork y clonar
git clone https://github.com/tu-usuario/devshouse-.git
cd devshouse-

# 2. Crear rama
git checkout -b feature/tu-feature

# 3. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 4. Configurar .env
cp backend/.env.example backend/.env
```

---

## 🔄 Flujo de Desarrollo

### 1. Crear una Rama

```bash
git checkout -b feature/nombre-descripttivo
```

**Convención de nombres:**
- `feature/agregar-validacion-email` - Nueva funcionalidad
- `fix/corregir-error-login` - Corrección de bug
- `docs/actualizar-readme` - Documentación
- `refactor/mejorar-estructura-usuarios` - Refactorización

### 2. Hacer Cambios

```bash
# Frontend
cd frontend
npm run dev

# Backend (en otra terminal)
cd backend
npm run dev
```

### 3. Verificar Calidad

```bash
# ESLint
npm run lint

# Build (frontend)
npm run build

# Tests (cuando esté disponible)
npm run test
```

### 4. Commit y Push

```bash
git add .
git commit -m "tipo: descripción corta"
git push origin feature/nombre-descripttivo
```

### 5. Pull Request

Abre un PR en GitHub con:
- ✅ Título descriptivo
- ✅ Descripción del cambio
- ✅ Capturas si es UI
- ✅ Referencias a issues (#123)

---

## 📐 Estándares de Código

### JavaScript/React

```javascript
// ✅ CORRECTO
import { useAuth } from '@/context/AuthContext';

const UserComponent = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="user-container">
      {isAuthenticated && <p>{user.name}</p>}
    </div>
  );
};

export default UserComponent;

// ❌ INCORRECTO
const userComponent = () => { // sin capital
  var user = localStorage.getItem('user'); // var en lugar de const
  return <div>{ user }</div>; // espacios inconsistentes
};
```

### Componentes

**Ubicación:**
```
src/components/[feature-name]/
  ├── ComponentName.jsx
  └── ComponentName.css
```

**Estructura:**
```javascript
// Imports
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import './FileName.css';

// Componente
const FileName = () => {
  // Estado
  const [count, setCount] = useState(0);
  
  // Contexto
  const { user } = useAuth();
  
  // Eventos
  const handleClick = () => setCount(count + 1);
  
  // Render
  return (
    <div className="file-name">
      <button onClick={handleClick}>{count}</button>
    </div>
  );
};

// Export
export default FileName;
```

### Servicios

```javascript
// src/services/miembros.service.js
const miembrosService = {
  // GET todas
  async getAll() {
    const response = await apiService.get('/members');
    return response;
  },
  
  // GET uno
  async getById(id) {
    const response = await apiService.get(`/members/${id}`);
    return response;
  },
  
  // POST
  async create(data) {
    const response = await apiService.post('/members', data);
    return response;
  },
  
  // PUT
  async update(id, data) {
    const response = await apiService.put(`/members/${id}`, data);
    return response;
  },
  
  // DELETE
  async delete(id) {
    const response = await apiService.delete(`/members/${id}`);
    return response;
  }
};

export default miembrosService;
```

### CSS

```css
/* ✅ CORRECTO - BEM convention */
.component-name {
  display: flex;
  gap: 1rem;
}

.component-name__header {
  background: var(--primary-color);
  padding: 1rem;
}

.component-name__button {
  border-radius: 0.5rem;
}

.component-name__button--active {
  background: var(--secondary-color);
}

/* ❌ INCORRECTO - nombres genéricos */
.header { }
.button { }
.active { }
```

---

## 💬 Convenciones de Commits

**Formato:**
```
tipo(scope): descripción

Descripción más detallada si es necesario.
Resuelve #123
```

**Tipos:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Cambios de formato (sin lógica)
- `refactor:` - Refactorización de código
- `test:` - Añadir o actualizar tests
- `chore:` - Cambios en dependencias o config

**Ejemplos:**

```bash
git commit -m "feat(auth): agregar validación de contraseña"
git commit -m "fix(list): corregir error al cargar convenios"
git commit -m "docs(readme): actualizar instrucciones"
git commit -m "refactor(services): mejorar estructura de errores"
```

---

## 🔀 Pull Requests

### Checklist antes de hacer PR

- [ ] Código funciona localmente
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run build` funciona
- [ ] Tests pasan (cuando esté disponible)
- [ ] Documentación actualizada
- [ ] Commits tienen mensajes claros
- [ ] Rama actualizada con main

### Template de PR

```markdown
## 📝 Descripción
Qué cambio hace este PR y por qué.

## 🎯 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Actualización de documentación

## 🧪 Cómo se Probó
Pasos para verificar el cambio:
1. Ir a `http://localhost:5173/agreements`
2. Hacer clic en "Crear Convenio"
3. Completar el formulario
4. Verificar que se valida correctamente

## 📸 Screenshots
[Si aplica, adjunta capturas]

## ✅ Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] He actualizado la documentación
- [ ] No hay warnings nuevos en console
- [ ] Probé en navegador (Chrome, Firefox)

## 📌 Issues Relacionados
Cierra #123
```

---

## 🐛 Reportar Bugs

### Crear Issue

**Título:** Descripción clara y concisa

```
Ejemplo: "AuthModal no cierra después de login exitoso"
```

**Descripción:**

```markdown
## 📝 Descripción
El AuthModal se queda abierto después de hacer login exitoso.

## 🔁 Pasos para Reproducir
1. Ir a http://localhost:5173
2. Hacer clic en "Iniciar Sesión"
3. Completar credenciales
4. Hacer clic en "Entrar"

## ❌ Comportamiento Esperado
El modal debe cerrarse automáticamente

## ✅ Comportamiento Actual
El modal permanece abierto

## 💻 Ambiente
- OS: macOS 14.2
- Browser: Chrome 120
- Node: 18.16.0

## 📎 Logs
```
Error en console:
(pegar aquí)
```

## 📸 Screenshots
[Adjuntar si es posible]

## 🔍 Información Adicional
Contexto extra si es necesario
```

---

## 📚 Recursos

- [React Docs](https://react.dev)
- [Node.js Guide](https://nodejs.org/docs)
- [Sequelize Docs](https://sequelize.org)
- [Express Guide](https://expressjs.com)

---

## ❓ Preguntas

- 💬 **Preguntas sobre desarrollo:** Abre una discussion en GitHub
- 🐛 **Bugs:** Abre un issue detallado
- 💡 **Sugerencias:** Crea una feature request
- 📧 **Contacto directo:** support@devshouse.com

---

**¡Gracias por contribuir a DevsHouse! 🚀**
