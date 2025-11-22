# 📁 Estructura Reorganizada de DevsHouse Frontend

## Estructura Propuesta

```
src/
├── components/
│   ├── layout/                    # Componentes persistentes
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   │
│   ├── shared/                    # Componentes reutilizables
│   │   ├── AIAssistant/
│   │   │   ├── AIAssistant.jsx
│   │   │   └── AIAssistant.css
│   │   ├── AuthModal/
│   │   │   ├── AuthModal.jsx
│   │   │   └── AuthModal.css
│   │   └── ProtectedRoute/
│   │       └── ProtectedRoute.jsx
│   │
│   ├── features/                  # Características por dominio
│   │   ├── admin/
│   │   │   ├── AdminPanel/
│   │   │   │   ├── AdminPanel.jsx
│   │   │   │   └── AdminPanel.css
│   │   │   └── Dashboard/
│   │   │       ├── Dashboard.jsx
│   │   │       └── Dashboard.css
│   │   │
│   │   └── jobs/
│   │       ├── JobsForm/
│   │       │   ├── JobsForm.jsx
│   │       │   └── JobsForm.css
│   │       └── JobSearch/
│   │           ├── JobSearchForm/
│   │           │   ├── JobSearchForm.jsx
│   │           │   └── JobSearchForm.css
│   │           └── JobSearchPage/
│   │               ├── JobSearchPage.jsx
│   │               └── JobSearchPage.css
│   │
│   └── pages/                     # Páginas principales
│       ├── Home/
│       │   ├── Home.jsx
│       │   ├── Hero/
│       │   │   ├── Hero.jsx
│       │   │   └── Hero.css
│       │   ├── Description/
│       │   │   ├── Description.jsx
│       │   │   └── Description.css
│       │   ├── Impact/
│       │   │   ├── Impact.jsx
│       │   │   └── Impact.css
│       │   └── Home.css
│       │
│       ├── AgreementsPage/
│       │   ├── AgreementsPage.jsx
│       │   ├── AgreementsForm/
│       │   │   ├── AgreementsForm.jsx
│       │   │   └── AgreementsForm.css
│       │   └── AgreementsPage.css
│       │
│       ├── VenturesPage/
│       │   ├── VenturesPage.jsx
│       │   ├── VenturesForm/
│       │   │   ├── VenturesForm.jsx
│       │   │   └── VenturesForm.css
│       │   └── VenturesPage.css
│       │
│       └── JobsPage/
│           ├── JobsPage.jsx
│           ├── JobsForm/
│           │   ├── JobsForm.jsx
│           │   └── JobsForm.css
│           └── JobsPage.css
│
├── context/                       # Context API
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
│
├── services/                      # Business logic
│   ├── api.service.js
│   ├── auth.service.js
│   ├── agreements.service.js
│   ├── ventures.service.js
│   ├── jobs.service.js
│   └── candidates.service.js
│
├── config/                        # Configuration
│   ├── constants.js
│   └── translations-extended.js
│
├── styles/                        # Global styles
│   └── globals.css
│
├── App.jsx                        # Router
├── main.jsx                       # Entry point
└── index.css
```

## Beneficios de esta estructura

✅ **Componentes Compartidos** - `shared/` contiene componentes reutilizables
✅ **Características Agrupadas** - `features/` organiza por dominio (admin, jobs, etc)
✅ **Páginas Claras** - `pages/` contiene todas las páginas principales
✅ **Escalabilidad** - Fácil agregar nuevas características
✅ **Mantenibilidad** - Código organizado y predecible
✅ **Reutilización** - Estructura clara para imports

## Rutas de importación

### Antes (confuso)
```javascript
import { AuthModal } from '../../../components/auth/AuthModal';
import { AdminPanel } from '../../../components/admin/AdminPanel';
```

### Después (claro)
```javascript
import AuthModal from '@/components/shared/AuthModal/AuthModal';
import AdminPanel from '@/components/features/admin/AdminPanel/AdminPanel';
```

## Próximos pasos

1. ✅ Crear estructura de carpetas
2. ⏳ Mover componentes a nuevas ubicaciones
3. ⏳ Actualizar imports en archivos
4. ⏳ Configurar alias en vite.config.js
5. ⏳ Verificar que todo funciona correctamente

