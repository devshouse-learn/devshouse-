# 📊 Flujo Completo de Despliegue

## 🎯 Vista General

```
┌──────────────────────────────────────────────────────────────────┐
│                    PASO 1: CONFIGURACIÓN LOCAL                   │
│                                                                   │
│  1. Verificar AWS CLI configurado                                │
│  2. Ejecutar script de setup                                     │
│     → Crea bucket S3                                             │
│     → Crea aplicación EB                                         │
│     → Crea ambiente EB                                           │
│                                                                   │
│  Tiempo: 5-10 minutos                                            │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                  PASO 2: CONFIGURAR GITHUB SECRETS               │
│                                                                   │
│  Ir a: GitHub Repo → Settings → Secrets → Actions               │
│                                                                   │
│  Crear 7 secrets:                                                │
│  ✓ AWS_ACCESS_KEY_ID                                            │
│  ✓ AWS_SECRET_ACCESS_KEY                                        │
│  ✓ AWS_REGION                                                    │
│  ✓ S3_BUCKET_NAME                                               │
│  ✓ EB_APPLICATION_NAME                                          │
│  ✓ EB_ENVIRONMENT_NAME                                          │
│  ✓ VITE_API_URL                                                 │
│                                                                   │
│  Tiempo: 3-5 minutos                                             │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PASO 3: PRIMER DESPLIEGUE                     │
│                                                                   │
│  git add .                                                        │
│  git commit -m "Add AWS deployment"                              │
│  git push origin main                                            │
│                                                                   │
│  Tiempo: 1 minuto                                                │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS SE EJECUTAN                      │
│                                                                   │
│  ┌────────────────────┐        ┌────────────────────┐           │
│  │  Deploy Frontend   │        │  Deploy Backend    │           │
│  │                    │        │                    │           │
│  │  1. Checkout code  │        │  1. Checkout code  │           │
│  │  2. Install deps   │        │  2. Install deps   │           │
│  │  3. Build React    │        │  3. Create zip     │           │
│  │  4. Sync to S3     │        │  4. Deploy to EB   │           │
│  │  5. Invalidate CDN │        │  5. Wait for ready │           │
│  └────────────────────┘        └────────────────────┘           │
│                                                                   │
│  Tiempo: 5-8 minutos                                             │
└──────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        RESULTADO FINAL                           │
│                                                                   │
│  ✅ Frontend desplegado en S3                                    │
│     http://bucket.s3-website-region.amazonaws.com                │
│                                                                   │
│  ✅ Backend desplegado en Elastic Beanstalk                      │
│     http://environment.elasticbeanstalk.com                      │
│                                                                   │
│  ✅ Health check funcionando                                     │
│     http://environment.elasticbeanstalk.com/api/health           │
│                                                                   │
│  Tiempo total: ~15-20 minutos                                    │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Despliegues Posteriores

```
┌─────────────────────────────────────┐
│  Desarrollador hace cambios         │
│  en frontend/ o backend/             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  git add .                           │
│  git commit -m "mensaje"             │
│  git push origin main                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  GitHub Actions detecta cambios      │
│                                      │
│  Si cambió frontend/ →               │
│    Ejecuta deploy-frontend.yml      │
│                                      │
│  Si cambió backend/ →                │
│    Ejecuta deploy-backend.yml       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Despliegue automático               │
│  (5-8 minutos)                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  ✅ Cambios en producción            │
└─────────────────────────────────────┘

Tiempo: ~6-10 minutos desde push hasta producción
```

## 📁 Estructura de Archivos

```
devshouse-/
│
├── .github/
│   ├── workflows/
│   │   ├── deploy-frontend.yml    ← Workflow para S3
│   │   └── deploy-backend.yml     ← Workflow para EB
│   │
│   ├── scripts/
│   │   ├── setup-aws.ps1          ← Script Windows
│   │   └── setup-aws.sh           ← Script Linux/Mac
│   │
│   ├── DEPLOYMENT.md              ← Doc completa
│   ├── GITHUB_SECRETS.md          ← Guía de secrets
│   └── CHECKLIST.md               ← Lista de verificación
│
├── backend/
│   ├── .ebextensions/             ← Configuración EB
│   │   ├── nodecommand.config
│   │   ├── 01_environment.config
│   │   └── 02_logs.config
│   │
│   ├── .ebignore                  ← Excluir archivos
│   ├── Procfile                   ← Comando inicio
│   └── src/                       ← Código backend
│
├── frontend/
│   └── src/                       ← Código frontend
│
├── SETUP_COMPLETO.md              ← ⭐ Resumen general
├── QUICK_DEPLOY.md                ← Guía rápida
├── TEST_LOCAL.md                  ← Tests locales
└── README.md                      ← Este archivo
```

## 🎯 Decisiones de Flujo

```
Cambio detectado en repo
         │
         ▼
    ¿Qué cambió?
         │
    ┌────┴────┐
    │         │
frontend/  backend/
    │         │
    ▼         ▼
Deploy   Deploy
to S3    to EB
    │         │
    └────┬────┘
         │
         ▼
   Producción
```

## 🔍 Monitoreo Post-Despliegue

```
┌──────────────────────────────────────┐
│  GitHub Actions (durante deploy)     │
│  - Ver logs en tiempo real           │
│  - Ver errores si falla              │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  AWS Console (después de deploy)     │
│                                       │
│  S3:                                  │
│  - Ver archivos desplegados           │
│  - Verificar permisos                 │
│                                       │
│  Elastic Beanstalk:                   │
│  - Ver health status                  │
│  - Ver logs en CloudWatch             │
│  - Ver métricas de CPU/RAM            │
└───────────────────────────────────────┘
```

## 🚨 Troubleshooting Flow

```
¿Problema?
    │
    ▼
┌─────────────────────┐
│ ¿Workflow falla?    │
└──────┬──────────────┘
       │
       ├─YES─→ Revisar GitHub Actions logs
       │       - Ver línea de error
       │       - Verificar secrets configurados
       │
       └─NO──→ ¿App no carga?
               │
               ├─Frontend─→ Verificar S3 bucket policy
               │            Verificar URL en navegador
               │            Ver console de navegador
               │
               └─Backend──→ Verificar EB environment health
                            Ver CloudWatch logs
                            Verificar security groups
                            Hacer curl al health check
```

## 💡 Tips de Flujo

### Para Desarrollo Rápido:
1. **Commit pequeños y frecuentes**: Deploy más rápidos
2. **Usar branches**: Deploy solo desde `main`
3. **Test local primero**: Usar `TEST_LOCAL.md`

### Para Rollback:
1. **Frontend (S3)**: Borrar archivos y re-deploy versión anterior
2. **Backend (EB)**: Usar AWS Console → EB → Previous versions

### Para Multiple Ambientes:
1. Crear ambientes staging/production en EB
2. Modificar workflows para deploy condicional por rama
3. Configurar diferentes secrets por ambiente

---

**¿Listo para empezar? 🚀**

Ve a [SETUP_COMPLETO.md](./SETUP_COMPLETO.md) para comenzar.
