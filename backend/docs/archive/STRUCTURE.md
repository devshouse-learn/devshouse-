# DevsHouse Backend API - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
backend/
├── src/
│   ├── index.js                          # Punto de entrada principal
│   ├── config/
│   │   ├── database.js                   # Conexión a MongoDB
│   │   └── constants.js                  # Constantes de la aplicación
│   │
│   ├── models/                           # Modelos de Mongoose
│   │   ├── User.js                       # Modelo de Usuario
│   │   ├── Agreement.js                  # Modelo de Convenio
│   │   ├── Venture.js                    # Modelo de Emprendimiento
│   │   ├── Job.js                        # Modelo de Oferta de Empleo
│   │   └── Candidate.js                  # Modelo de Candidato
│   │
│   ├── routes/                           # Rutas API
│   │   ├── index.js                      # Registro de rutas
│   │   ├── auth.js                       # Autenticación
│   │   ├── users.js                      # Gestión de usuarios
│   │   ├── agreements.js                 # Convenios
│   │   ├── ventures.js                   # Emprendimientos
│   │   ├── jobs.js                       # Ofertas de empleo
│   │   └── candidates.js                 # Candidatos
│   │
│   ├── controllers/                      # Controladores (lógica de negocio)
│   │   ├── authController.js             # Lógica de autenticación
│   │   ├── userController.js             # Lógica de usuarios
│   │   ├── agreementController.js        # Lógica de convenios
│   │   ├── ventureController.js          # Lógica de emprendimientos
│   │   ├── jobController.js              # Lógica de empleos
│   │   └── candidateController.js        # Lógica de candidatos
│   │
│   ├── middleware/                       # Middlewares
│   │   ├── auth.js                       # Autenticación JWT
│   │   ├── errorHandler.js               # Manejo de errores
│   │   ├── validation.js                 # Validación de datos
│   │   └── cors.js                       # CORS configuration
│   │
│   └── utils/                            # Funciones utilitarias
│       ├── logger.js                     # Sistema de logs
│       ├── validators.js                 # Validadores personalizados
│       ├── errorFormatter.js             # Formateo de errores
│       └── helpers.js                    # Funciones auxiliares
│
├── .env.example                          # Variables de entorno (ejemplo)
├── .gitignore                            # Archivos a ignorar en git
├── package.json                          # Dependencias y scripts
└── README.md                             # Documentación
```

## 🔧 Próximos Pasos

1. Instalar dependencias: `npm install`
2. Crear archivo `.env` basado en `.env.example`
3. Conectar a MongoDB
4. Implementar controladores
5. Crear middlewares de autenticación
6. Agregar validaciones

## 📝 Notas de Desarrollo

- Usar patrones RESTful para las rutas
- Implementar autenticación JWT
- Validar todos los datos de entrada
- Usar middleware de error handling
- Documentar con comentarios JSDoc
