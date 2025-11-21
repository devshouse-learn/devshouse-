# DevsHouse - Plataforma de Conexión Educativa y Laboral

DevsHouse es una plataforma integral diseñada para conectar instituciones educativas, emprendedores y empresas en el ecosistema tecnológico.

## 🚀 Características Principales

### 1. **Convenios Educativos**
- Registro de alianzas educativas
- Programas de formación en tecnologías actuales
- Prácticas profesionales

### 2. **Emprendimientos**
- Publicación de empresas y proyectos
- Visibilidad empresarial
- Networking y oportunidades de inversión

### 3. **Ofertas de Empleo**
- Publicación de vacantes (solo admins)
- Búsqueda inteligente de oportunidades

### 4. **Sistema de Administración**
- Panel de control para gestionar usuarios y roles
- Asignación de roles: Admin, Moderador, Usuario
- Revocación de roles

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router v7.9.6** - Navegación cliente
- **Context API** - Gestión de estado global
- **CSS 3** - Estilos modernos

### Características
- **30 Idiomas** - Soporte multiidioma completo
- **Autenticación** - Sistema de roles y permisos
- **Clean Architecture** - Separación clara de responsabilidades

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/           # Header, Footer, Layout
│   │   ├── home/             # Hero, Description, Impact
│   │   ├── auth/             # AuthModal, ProtectedRoute
│   │   ├── admin/            # AdminPanel
│   │   ├── dashboard/        # Dashboard
│   │   ├── forms/            # Formularios de cada servicio
│   │   └── ai-assistant/     # Asistente de IA
│   ├── context/
│   │   ├── AuthContext.jsx   # Contexto de autenticación
│   │   └── LanguageContext.jsx # Contexto de idiomas
│   ├── services/
│   │   ├── api.service.js         # Cliente HTTP
│   │   ├── auth.service.js        # Servicios de autenticación
│   │   └── registration.service.js # Servicios de negocio
│   ├── config/
│   │   ├── constants.js           # Constantes
│   │   └── translations-extended.js # Traducciones (30 idiomas)
│   ├── styles/
│   │   └── globals.css       # Estilos globales
│   ├── App.jsx               # Configuración de rutas
│   └── main.jsx              # Punto de entrada
├── public/                   # Archivos estáticos
└── package.json
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 16
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd devshouse-/frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter
```

## 🔐 Sistema de Autenticación

### Credenciales de Admin

```
Email: kelib@gmail.com
Contraseña: 03v5h0u53
```

### Roles Disponibles

1. **Admin** (`admin`)
   - Gestión completa de la plataforma
   - Asignación y revocación de roles
   - Acceso a todas las features

2. **Moderador** (`moderador`)
   - Moderación de contenido
   - Acceso a analítica

3. **Usuario** (`usuario`)
   - Acceso a búsqueda de empleos
   - Publicación de emprendimientos
   - Acceso a convenios

### Panel de Administración

El admin puede:
- ✅ **Asignar Admin** a otros usuarios
- ✅ **Asignar Moderador** a otros usuarios
- ✅ **Revocar Admin** (excepto a kelib@gmail.com)
- ✅ **Revocar Moderador** a otros usuarios

## 🌐 Idiomas Soportados (30)

Español, English, Português, Français, Deutsch, Italiano, Nederlands, Polski, Русский, 日本語, 中文, 한국어, العربية, हिन्दी, Türkçe, Tiếng Việt, ไทย, Bahasa Indonesia, Tagalog, Bahasa Melayu, Svenska, Dansk, Norsk, Suomi, Ελληνικά, Čeština, Magyar, Română, Українська, עברית

## 🌐 Rutas de la Aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Página principal |
| `/agreements` | Autenticado | Convenios educativos |
| `/ventures` | Autenticado | Emprendimientos |
| `/jobs` | Admin | Publicar empleo |
| `/job-search` | Autenticado | Buscar empleo |

## 🎨 Características de Diseño

- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Tema Oscuro** - Interfaz moderna y elegante
- **Animaciones Suaves** - Transiciones profesionales
- **Gradientes Atractivos** - Estética moderna
- **30 Idiomas** - Soporte multiidioma completo

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Ejemplo de Uso

### Login
```javascript
import { useAuth } from './context/AuthContext';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido {user.name}</p>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  );
};
```

### Cambiar Idioma
```javascript
import { useLanguage } from './context/LanguageContext';

const MyComponent = () => {
  const { language, changeLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>{t('signIn')}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};
```

## 🔜 Próximas Características

- [ ] Integración con backend API
- [ ] Sistema de notificaciones
- [ ] Mensajería en tiempo real
- [ ] Dashboard analítico
- [ ] Sistema de búsqueda avanzada
- [ ] Tests automatizados

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
