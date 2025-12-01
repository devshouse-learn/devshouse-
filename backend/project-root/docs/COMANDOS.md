# ⚡ Comandos Rápidos - Referencia

## 🚀 Setup Inicial (Una sola vez)

### Windows (PowerShell):
```powershell
# 1. Configurar AWS
cd .github\scripts
.\setup-aws.ps1

# 2. Anotar los valores que te da el script

# 3. Obtener URL del backend (esperar 5-10 min)
aws elasticbeanstalk describe-environments --application-name TU_APP --environment-names TU_ENV --query 'Environments[0].CNAME' --output text

# 4. Configurar GitHub Secrets (método CLI)
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION --body "us-east-1"
gh secret set S3_BUCKET_NAME --body "tu-bucket"
gh secret set EB_APPLICATION_NAME --body "tu-app"
gh secret set EB_ENVIRONMENT_NAME --body "tu-env"
gh secret set VITE_API_URL --body "http://tu-backend-url"

# 5. Desplegar
git add .
git commit -m "Configure AWS deployment"
git push origin main
```

### Linux/Mac:
```bash
# 1. Configurar AWS
cd .github/scripts
chmod +x setup-aws.sh
./setup-aws.sh

# 2-5. Igual que Windows
```

## 📦 Despliegues Posteriores

```bash
# Cambios en código
git add .
git commit -m "Tu mensaje"
git push origin main

# GitHub Actions se encarga automáticamente
```

## 🔍 Verificación Rápida

### Health Check:
```bash
# Backend
curl http://tu-ambiente.elasticbeanstalk.com/api/health

# Debe responder:
# {"status":"OK","message":"DevsHouse Backend API is running",...}
```

### Frontend:
```bash
# Abrir en navegador
start http://tu-bucket.s3-website-region.amazonaws.com  # Windows
open http://tu-bucket.s3-website-region.amazonaws.com   # Mac
```

## 🔧 Comandos AWS Útiles

### Ver Estado de Recursos:
```bash
# S3: Listar archivos del bucket
aws s3 ls s3://tu-bucket

# EB: Estado del ambiente
aws elasticbeanstalk describe-environments \
  --application-name tu-app \
  --environment-names tu-env

# EB: URL del ambiente
aws elasticbeanstalk describe-environments \
  --application-name tu-app \
  --environment-names tu-env \
  --query 'Environments[0].CNAME' \
  --output text
```

### Ver Logs:
```bash
# EB: Solicitar logs
aws elasticbeanstalk request-environment-info \
  --application-name tu-app \
  --environment-name tu-env \
  --info-type tail

# EB: Obtener URL de logs (esperar ~1 min)
aws elasticbeanstalk retrieve-environment-info \
  --application-name tu-app \
  --environment-name tu-env \
  --info-type tail
```

### Actualizar Variables de Entorno:
```bash
# Actualizar CORS_ORIGIN en EB
aws elasticbeanstalk update-environment \
  --application-name tu-app \
  --environment-name tu-env \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ORIGIN,Value=http://tu-bucket.s3-website-region.amazonaws.com
```

## 🗑️ Limpiar Recursos (Borrar todo)

```bash
# ⚠️ CUIDADO: Esto borra todos los recursos

# 1. Terminar ambiente EB (tarda ~5 min)
aws elasticbeanstalk terminate-environment \
  --environment-name tu-env

# 2. Borrar aplicación EB
aws elasticbeanstalk delete-application \
  --application-name tu-app

# 3. Borrar bucket S3
aws s3 rb s3://tu-bucket --force
```

## 🧪 Testing Local

```powershell
# Backend
cd backend
npm install
npm run dev
# Abre: http://localhost:3000/api/health

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
# Abre: http://localhost:5173
```

## 🔄 Rollback

### Frontend (S3):
```bash
# Re-deploy versión anterior
cd frontend
git checkout COMMIT_ANTERIOR
npm run build
aws s3 sync dist/ s3://tu-bucket --delete
git checkout main
```

### Backend (EB):
```bash
# Ver versiones disponibles
aws elasticbeanstalk describe-application-versions \
  --application-name tu-app

# Hacer rollback a versión anterior
aws elasticbeanstalk update-environment \
  --environment-name tu-env \
  --version-label VERSION_ANTERIOR
```

## 🔍 Debug

### Ver qué cambió en el último commit:
```bash
git log -1 --stat
```

### Ver workflows que se ejecutaron:
```bash
gh run list --limit 5
gh run view ID_DEL_RUN --log
```

### Ver logs de CloudWatch:
```bash
# Instalar session manager plugin primero
aws logs tail /aws/elasticbeanstalk/tu-env/var/log/nodejs/nodejs.log --follow
```

## 📊 Monitoreo

### Ver métricas del ambiente EB:
```bash
aws elasticbeanstalk describe-environment-health \
  --environment-name tu-env \
  --attribute-names All
```

### Ver requests recientes en S3:
```bash
# Habilitar logging del bucket primero
aws s3api get-bucket-logging --bucket tu-bucket
```

## 🎯 Comandos por Tarea

### "Necesito desplegar ahora":
```bash
git add .
git commit -m "Quick update"
git push origin main
```

### "Necesito ver qué se desplegó":
```bash
# GitHub Actions
gh run list --limit 1

# AWS
aws elasticbeanstalk describe-environment-resources \
  --environment-name tu-env
```

### "El deployment falló":
```bash
# Ver error en GitHub Actions
gh run view --log

# Ver logs de EB
aws elasticbeanstalk describe-events \
  --environment-name tu-env \
  --max-records 10
```

### "Necesito cambiar una variable":
```bash
# En EB
aws elasticbeanstalk update-environment \
  --environment-name tu-env \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=NOMBRE_VAR,Value=VALOR

# En GitHub Secrets (CLI)
gh secret set NOMBRE_SECRET
```

## 💡 Aliases Útiles (PowerShell)

Agregar a tu `$PROFILE`:

```powershell
# Ver archivo de perfil
$PROFILE

# Editar
notepad $PROFILE

# Agregar estos aliases:
function eb-status { aws elasticbeanstalk describe-environments --application-name tu-app --environment-names tu-env }
function eb-logs { aws elasticbeanstalk request-environment-info --application-name tu-app --environment-name tu-env --info-type tail }
function s3-ls { aws s3 ls s3://tu-bucket }
function deploy { git add .; git commit -m $args[0]; git push origin main }

# Uso:
# deploy "mi mensaje de commit"
# eb-status
# eb-logs
# s3-ls
```

## 📚 Referencias Rápidas

| Necesito... | Ver... |
|------------|--------|
| Setup inicial completo | [SETUP_COMPLETO.md](./SETUP_COMPLETO.md) |
| Guía paso a paso | [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) |
| Checklist | [.github/CHECKLIST.md](./.github/CHECKLIST.md) |
| Configurar secrets | [.github/GITHUB_SECRETS.md](./.github/GITHUB_SECRETS.md) |
| Tests locales | [TEST_LOCAL.md](./TEST_LOCAL.md) |
| Flujo visual | [FLUJO_DEPLOY.md](./FLUJO_DEPLOY.md) |
| Doc completa | [.github/DEPLOYMENT.md](./.github/DEPLOYMENT.md) |

## 🆘 Ayuda Rápida

```bash
# ¿AWS CLI configurado?
aws sts get-caller-identity

# ¿GitHub CLI instalado?
gh --version

# ¿Secrets configurados?
gh secret list

# ¿Backend funciona?
curl http://tu-ambiente.elasticbeanstalk.com/api/health

# ¿Frontend funciona?
curl -I http://tu-bucket.s3-website-region.amazonaws.com
```

---

**💾 Guarda este archivo en tus favoritos para referencia rápida**
