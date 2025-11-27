# 🔄 CI/CD Automático - DevsHouse

Este documento explica cómo funciona el despliegue automático al hacer commit en `main`.

---

## 🚀 Despliegue Automático Configurado

### ✅ ¿Qué se despliega automáticamente?

Cuando haces **commit a `main`**, se activan los workflows de GitHub Actions:

#### 1️⃣ **Frontend (React) → S3**
- **Trigger:** Cambios en `frontend/**` o en el workflow mismo
- **Destino:** S3 bucket `devshouse-frontend-2025`
- **URL:** http://devshouse-frontend-2025.s3-website-us-east-1.amazonaws.com
- **Tiempo:** ~2-3 minutos

#### 2️⃣ **Backend (Node.js) → Elastic Beanstalk**
- **Trigger:** Cambios en `backend/**` o en el workflow mismo
- **Destino:** Elastic Beanstalk `devshouse-prod`
- **URL:** http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api
- **Tiempo:** ~3-5 minutos

---

## 📋 Pasos del Despliegue Automático

### Frontend Workflow (`.github/workflows/deploy-frontend.yml`)

```yaml
1. Checkout del código
2. Setup Node.js 18
3. Instalar dependencias (npm ci)
4. Build con VITE_API_URL de producción
5. Subir a S3:
   - Assets con cache de 1 año
   - index.html sin cache
6. Resumen del despliegue
```

**Estado:** ✅ FUNCIONANDO

---

### Backend Workflow (`.github/workflows/deploy-backend.yml`)

```yaml
1. Checkout del código
2. Setup Node.js 18
3. Configurar credenciales AWS
4. Crear package ZIP (Linux-compatible):
   - src/
   - .ebextensions/
   - .platform/
   - package.json, package-lock.json
   - Procfile, .ebignore
5. Subir ZIP a S3
6. Crear versión en Elastic Beanstalk
7. Desplegar a ambiente devshouse-prod
8. Esperar completar despliegue
9. Verificar health check
```

**Estado:** ✅ CONFIGURADO (basado en despliegue manual exitoso)

---

## 🔐 GitHub Secrets Necesarios

Estos secrets ya están configurados en el repositorio:

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Access Key de AWS | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de AWS | `wJalrX...` |
| `AWS_REGION` | Región de AWS | `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 | `devshouse-frontend-2025` |
| `VITE_API_URL` | URL del backend | `http://devshouse-prod...` |

**Nota:** El backend workflow NO necesita `EB_APPLICATION_NAME` ni `EB_ENVIRONMENT_NAME` ya que están hardcodeados (`devshouse-backend` y `devshouse-prod`).

---

## 🎯 Flujo de Trabajo Típico

### Escenario 1: Cambios solo en Frontend

```bash
# 1. Hacer cambios en frontend
cd frontend/src
# ... editar componentes ...

# 2. Commit y push
git add frontend/
git commit -m "feat: Nuevo componente Hero"
git push origin main

# 3. GitHub Actions se ejecuta automáticamente
#    - Solo se despliega el frontend
#    - Backend no se toca
#    - ~2 minutos de despliegue
```

**Resultado:** Frontend actualizado en S3 ✅

---

### Escenario 2: Cambios solo en Backend

```bash
# 1. Hacer cambios en backend
cd backend/src
# ... editar rutas o servicios ...

# 2. Commit y push
git add backend/
git commit -m "feat: Nuevo endpoint de ventures"
git push origin main

# 3. GitHub Actions se ejecuta automáticamente
#    - Solo se despliega el backend
#    - Frontend no se toca
#    - ~4 minutos de despliegue
```

**Resultado:** Backend actualizado en Elastic Beanstalk ✅

---

### Escenario 3: Cambios en Ambos

```bash
# 1. Hacer cambios en ambos
git add frontend/ backend/
git commit -m "feat: Integración completa de módulo X"
git push origin main

# 2. GitHub Actions ejecuta AMBOS workflows en paralelo
#    - Frontend: ~2 minutos
#    - Backend: ~4 minutos
#    - Total: ~4-5 minutos (en paralelo)
```

**Resultado:** Frontend y Backend actualizados ✅

---

## 🔍 Monitorear Despliegues

### 1. GitHub Actions UI

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Verás los workflows ejecutándose en tiempo real
4. Click en un workflow para ver logs detallados

**URL:** https://github.com/devshouse-learn/devshouse-/actions

---

### 2. AWS Console

#### Elastic Beanstalk
- **URL:** https://console.aws.amazon.com/elasticbeanstalk/
- **Aplicación:** devshouse-backend
- **Environment:** devshouse-prod
- Ver eventos, logs, y health status

#### S3
- **URL:** https://console.aws.amazon.com/s3/
- **Bucket:** devshouse-frontend-2025
- Ver archivos desplegados

---

### 3. CLI Commands

```bash
# Ver status del backend
aws elasticbeanstalk describe-environments \
  --environment-names devshouse-prod \
  --query 'Environments[0].{Status:Status,Health:Health,Version:VersionLabel}'

# Ver últimos eventos del backend
aws elasticbeanstalk describe-events \
  --environment-name devshouse-prod \
  --max-items 10

# Ver archivos en S3
aws s3 ls s3://devshouse-frontend-2025/

# Health check directo
curl http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api/health
```

---

## ⚠️ Solución de Problemas

### ❌ Frontend: Build Failed

**Síntomas:** Workflow rojo en GitHub Actions, error en step "Build frontend"

**Causas comunes:**
- Errores de sintaxis en código React
- Dependencias faltantes
- Variables de entorno incorrectas

**Solución:**
```bash
# 1. Probar build localmente
cd frontend
npm run build

# 2. Si funciona local, verificar secrets en GitHub
# Settings → Secrets → VITE_API_URL
```

---

### ❌ Backend: Deployment Failed

**Síntomas:** Workflow rojo, o ambiente EB en estado "Red"

**Causas comunes:**
- Error en package.json (dependencias)
- Error de conexión a PostgreSQL
- Archivo de configuración .ebextensions incorrecto
- ZIP con formato Windows (backslashes)

**Solución:**
```bash
# 1. Ver logs del despliegue
aws elasticbeanstalk request-environment-info \
  --environment-name devshouse-prod \
  --info-type tail

sleep 20

aws elasticbeanstalk retrieve-environment-info \
  --environment-name devshouse-prod \
  --info-type tail \
  --query 'EnvironmentInfo[0].Message' \
  --output text

# 2. Si el problema es el ZIP, el workflow usa 'zip' nativo de Linux
#    que debería crear paths correctos

# 3. Si persiste, desplegar manualmente:
cd backend
bash -c "zip -r deploy.zip src/ .ebextensions/ .platform/ package*.json Procfile .ebignore"
# ... seguir pasos de SUBIDA_MANUAL_EB.md
```

---

### ⚠️ Backend: Environment "Degraded"

**Síntomas:** Health status "Yellow" o "Red", pero aplicación corre

**Causa:** Health checks del ALB fallando (configuración de routing)

**Solución:**
```bash
# 1. Verificar que la app responde
curl http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api/health

# 2. Si responde OK, el problema es configuración del ALB
# Ir a AWS Console → EC2 → Load Balancers → Target Groups
# Verificar health check path: debería ser /api/health

# 3. Alternativa: Aceptar estado "Degraded" si la app funciona
# El workflow verifica Status="Ready", no Health
```

---

## 🛠️ Mantenimiento

### Actualizar Variables de Entorno

#### Frontend
```bash
# Actualizar VITE_API_URL en GitHub Secrets
gh secret set VITE_API_URL --body "http://nueva-url.com/api"

# Re-desplegar (hacer commit dummy)
git commit --allow-empty -m "chore: Redeploy frontend"
git push origin main
```

#### Backend
```bash
# Editar backend/.ebextensions/01_environment.config
# Ejemplo: cambiar DB_HOST

git add backend/.ebextensions/01_environment.config
git commit -m "config: Update database host"
git push origin main
# Se despliega automáticamente
```

---

### Rollback a Versión Anterior

#### Frontend (S3)
```bash
# S3 no tiene versionado automático
# Necesitas hacer git revert y re-desplegar

git revert <commit-hash>
git push origin main
```

#### Backend (Elastic Beanstalk)
```bash
# Ver versiones disponibles
aws elasticbeanstalk describe-application-versions \
  --application-name devshouse-backend \
  --query 'ApplicationVersions[*].VersionLabel' \
  --output table

# Revertir a versión anterior
aws elasticbeanstalk update-environment \
  --environment-name devshouse-prod \
  --version-label "auto-deploy-20251126-180000"
```

---

## 📊 Métricas de Despliegue

| Workflow | Tiempo Promedio | Costo AWS | Frecuencia Recomendada |
|----------|-----------------|-----------|------------------------|
| Frontend | 2-3 minutos | ~$0.01/deploy | Ilimitado |
| Backend | 4-5 minutos | ~$0.05/deploy | Máx 10/día |

**Nota:** Los costos son estimados. El costo real depende de tráfico y uso de recursos.

---

## 🎯 Mejores Prácticas

### ✅ DO

- ✅ Hacer commits pequeños y frecuentes
- ✅ Probar localmente antes de hacer push
- ✅ Usar mensajes de commit descriptivos
- ✅ Verificar logs de GitHub Actions después de cada deploy
- ✅ Monitorear health checks después de despliegue

### ❌ DON'T

- ❌ No hacer push directo sin probar localmente
- ❌ No modificar archivos .ebextensions sin entender su impacto
- ❌ No eliminar workflows sin backup
- ❌ No compartir AWS credentials en el código
- ❌ No desplegar en horarios pico sin pruebas

---

## 🔒 Seguridad

### Secretos Protegidos

Los siguientes secretos **NUNCA** deben estar en el código:

- ✅ `AWS_ACCESS_KEY_ID` - Solo en GitHub Secrets
- ✅ `AWS_SECRET_ACCESS_KEY` - Solo en GitHub Secrets
- ✅ `DB_PASSWORD` - Solo en .ebextensions/01_environment.config (no commitear con contraseña real)
- ✅ `JWT_SECRET` - Solo en .ebextensions/01_environment.config

### Permisos AWS Necesarios

El usuario IAM de GitHub Actions necesita:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::devshouse-frontend-2025/*",
        "arn:aws:s3:::devshouse-frontend-2025"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "elasticbeanstalk:*"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS Elastic Beanstalk CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [DEPLOYMENT_SUCCESS.md](../DEPLOYMENT_SUCCESS.md) - Resumen del despliegue manual exitoso
- [SUBIDA_MANUAL_EB.md](../SUBIDA_MANUAL_EB.md) - Proceso manual de backup

---

## ✨ Resumen

**Con este setup:**

1. Haces commit a `main`
2. GitHub Actions detecta cambios
3. Despliega automáticamente frontend y/o backend
4. En 2-5 minutos tienes tu app actualizada en producción
5. Sin intervención manual necesaria

**URLs finales:**
- 🌐 Frontend: http://devshouse-frontend-2025.s3-website-us-east-1.amazonaws.com
- 🚀 Backend: http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api

---

**🎉 ¡Despliegue continuo configurado!** 🚀
