# DevsHouse - Plataforma de Conexión Educativa y Laboral

DevsHouse es una plataforma integral diseñada para conectar instituciones educativas, emprendedores y empresas en el ecosistema tecnológico.

## 🚀 Características Principales

### 1. **Convenios con Colegios**
- Registro de alianzas educativas
- Programas de formación en tecnologías actuales
- Capacitación en: Visual Studio Code, Git, API REST, IA
- Prácticas profesionales

### 2. **Emprendimientos**
- Publicación de empresas y proyectos
- Visibilidad empresarial
- Networking
- Oportunidades de inversión
- Asistencia de IA para optimización

### 3. **Ofertas de Empleo**
- **Para Empresas**: Publicación de vacantes
- **Para Candidatos**: Búsqueda de oportunidades
- Matching inteligente con IA

### 4. **Asistente de IA**
- Soporte 24/7
- Resolución de problemas
- Guía de uso de la plataforma
- Optimización de búsquedas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación cliente
- **CSS Modules** - Estilos con scope

### Arquitectura
- **Clean Architecture** - Separación de responsabilidades
- **Service Layer** - Abstracción de lógica de negocio
- **Component-Based** - Componentes reutilizables

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── home/            # Hero, About, Impact, ServiceCards
│   │   ├── agreements/      # Formulario convenios
│   │   ├── ventures/        # Formulario emprendimientos
│   │   ├── jobs/            # Formulario publicar empleo
│   │   ├── job-search/      # Formulario buscar empleo
│   │   └── ai-assistant/    # Asistente de IA
│   ├── services/
│   │   ├── api.service.js          # Cliente HTTP
│   │   └── registration.service.js # Servicios de registro
│   ├── config/
│   │   └── constants.js     # Constantes y configuración
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilidades
│   ├── styles/
│   │   └── globals.css      # Estilos globales
│   ├── App.jsx              # Configuración de rutas
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos estáticos
└── package.json
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 16
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd devshouse-
```

2. **Instalar dependencias**
```bash
cd frontend
npm install
```

3. **Ejecutar en desarrollo**
```bash
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

## 🌐 Rutas de la Aplicación

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Página principal |
| `/agreements` | Agreements | Registro de convenios |
| `/ventures` | Ventures | Publicar emprendimiento |
| `/jobs` | Jobs | Publicar empleo (empresas) |
| `/job-search` | JobSearch | Buscar empleo (candidatos) |

## 🎨 Características de Diseño

- **Diseño Responsive** - Adaptable a todos los dispositivos
- **Modo Oscuro** - Interfaz oscura moderna
- **Animaciones** - Transiciones suaves y profesionales
- **Gradientes** - Efectos visualales atractivos
- **Accesibilidad** - Cumple estándares WCAG

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

### Configuración de API

Edita `src/config/constants.js` para ajustar:
- Base URL del API
- Timeout de peticiones
- Headers por defecto
- Enlaces de redes sociales

## 📝 Servicios Disponibles

### API Service
```javascript
import { apiService } from './services/api.service';

// GET request
const data = await apiService.get('/endpoint');

// POST request
const result = await apiService.post('/endpoint', { data });
```

### Registration Services
```javascript
import { agreementsService, venturesService, jobsService, candidatesService } 
  from './services/registration.service';

// Crear convenio
await agreementsService.create(data);

// Obtener todos los emprendimientos
const ventures = await venturesService.getAll();
```

## 🤖 Asistente de IA

El asistente de IA puede ayudarte con:
- ¿Cómo registrar un convenio?
- ¿Cómo publicar mi emprendimiento?
- ¿Cómo buscar empleo?
- Reportar problemas técnicos

## 🔜 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Dashboard personalizado
- [ ] Notificaciones en tiempo real
- [ ] Sistema de mensajería
- [ ] Integración con backend
- [ ] Tests automatizados
- [ ] Documentación de API

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

## 📧 Contacto

- WhatsApp: [Unirse a la comunidad](#)
- Discord: [Servidor DevsHouse](#)

---

**Desarrollado con ❤️ por el equipo de DevsHouse**
