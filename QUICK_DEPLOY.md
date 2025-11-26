# 🚀 Guía Rápida de Despliegue

## Resumen
Esta guía te ayudará a desplegar DevsHouse en AWS en **menos de 10 minutos**.

## 📋 Antes de Empezar

Verifica que tienes:
- ✅ Cuenta de AWS
- ✅ AWS CLI configurado (`aws configure`)
- ✅ Acceso al repositorio en GitHub
- ✅ Permisos de admin en el repositorio (para configurar secrets)

## 🎯 Opción 1: Configuración Automática (Recomendada)

### Paso 1: Ejecutar el script de configuración

**En Windows (PowerShell):**
```powershell
cd .github\scripts
.\setup-aws.ps1
```

**En Linux/Mac:**
```bash
cd .github/scripts
chmod +x setup-aws.sh
./setup-aws.sh
```

El script te pedirá:
- Nombre del bucket S3 (ej: `devshouse-frontend`)
- Nombre de la aplicación EB (ej: `devshouse-backend`)
- Nombre del ambiente EB (ej: `devshouse-backend-prod`)

### Paso 2: Configurar GitHub Secrets

Ve a tu repositorio en GitHub:
1. Settings → Secrets and variables → Actions
2. Click en "New repository secret"
3. Agrega estos secrets (usa los valores que te dio el script):

```
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=devshouse-frontend
EB_APPLICATION_NAME=devshouse-backend
EB_ENVIRONMENT_NAME=devshouse-backend-prod
VITE_API_URL=http://tu-ambiente.elasticbeanstalk.com
```

**Para obtener VITE_API_URL:**
```bash
aws elasticbeanstalk describe-environments \
  --application-name devshouse-backend \
  --environment-names devshouse-backend-prod \
  --query 'Environments[0].CNAME' \
  --output text
```

### Paso 3: Hacer Push y Desplegar

```bash
git add .
git commit -m "Configure AWS deployment"
git push origin main
```

¡Listo! GitHub Actions se encargará del resto.

## 🎯 Opción 2: Configuración Manual

### Paso 1: Crear Bucket S3

```bash
# Crear bucket
aws s3 mb s3://devshouse-frontend --region us-east-1

# Configurar como website
aws s3 website s3://devshouse-frontend \
  --index-document index.html \
  --error-document index.html

# Hacer público
cat > /tmp/policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::devshouse-frontend/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket devshouse-frontend \
  --policy file:///tmp/policy.json
```

### Paso 2: Crear Elastic Beanstalk

```bash
# Crear aplicación
aws elasticbeanstalk create-application \
  --application-name devshouse-backend \
  --description "DevsHouse Backend API" \
  --region us-east-1

# Crear ambiente (tarda 5-10 minutos)
aws elasticbeanstalk create-environment \
  --application-name devshouse-backend \
  --environment-name devshouse-backend-prod \
  --solution-stack-name "64bit Amazon Linux 2023 v6.1.0 running Node.js 18" \
  --option-settings \
    Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role \
    Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance
```

### Paso 3: Configurar GitHub Secrets

Sigue el Paso 2 de la Opción 1.

## 🔍 Verificar el Despliegue

### Frontend (S3):
```bash
# URL del sitio
echo "http://devshouse-frontend.s3-website-us-east-1.amazonaws.com"
```

### Backend (Elastic Beanstalk):
```bash
# Health check
curl http://tu-ambiente.elasticbeanstalk.com/api/health
```

## 🐛 Solución de Problemas

### El script falla con "credentials not found"
```bash
aws configure
# Ingresa tus credenciales
```

### El ambiente EB no inicia
```bash
# Ver logs
aws elasticbeanstalk describe-environment-health \
  --environment-name devshouse-backend-prod \
  --attribute-names All
```

### CORS errors en el frontend
Actualiza la variable de entorno en EB:
```bash
aws elasticbeanstalk update-environment \
  --environment-name devshouse-backend-prod \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ORIGIN,Value=http://devshouse-frontend.s3-website-us-east-1.amazonaws.com
```

## 📚 Documentación Completa

Para más detalles, ver [DEPLOYMENT.md](.github/DEPLOYMENT.md)

## 🆘 Ayuda

- **Issues**: https://github.com/devshouse-learn/devshouse-/issues
- **Documentación AWS**: https://docs.aws.amazon.com/

## 🎉 ¡Siguiente Paso!

Una vez desplegado, considera:
- ✅ Configurar un dominio personalizado
- ✅ Agregar CloudFront para HTTPS
- ✅ Configurar Auto Scaling en EB
- ✅ Agregar monitoreo con CloudWatch
