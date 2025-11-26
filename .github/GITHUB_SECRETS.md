# 🔐 Configuración de GitHub Secrets

Esta guía te muestra cómo configurar los secrets necesarios para el despliegue automático.

## 📋 Secrets Necesarios

Necesitarás configurar **7 secrets** en tu repositorio de GitHub:

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Access Key de tu usuario IAM | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de tu usuario IAM | `wJalrXUtnFEMI/K7MDENG/bPxRfiCY` |
| `AWS_REGION` | Región de AWS a usar | `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 para frontend | `devshouse-frontend` |
| `EB_APPLICATION_NAME` | Nombre de la aplicación EB | `devshouse-backend` |
| `EB_ENVIRONMENT_NAME` | Nombre del ambiente EB | `devshouse-backend-prod` |
| `VITE_API_URL` | URL del backend para el frontend | `http://xxx.elasticbeanstalk.com` |

## 🎯 Cómo Obtener tus Credenciales AWS

### Opción 1: Desde tu configuración local (si ya tienes AWS CLI configurado)

```bash
# Ver tu Access Key ID actual
aws configure get aws_access_key_id

# Ver tu región
aws configure get region
```

⚠️ **Nota**: El Secret Access Key no se puede ver después de crearlo. Si no lo tienes guardado, deberás crear uno nuevo.

### Opción 2: Crear nuevas credenciales en AWS Console

1. Inicia sesión en [AWS Console](https://console.aws.amazon.com/)
2. Ve a **IAM** → **Users** → Tu usuario
3. Tab **Security credentials**
4. Sección **Access keys** → **Create access key**
5. Selecciona **Command Line Interface (CLI)**
6. Marca el checkbox de confirmación
7. Click **Next** → **Create access key**
8. **⚠️ IMPORTANTE**: Guarda ambas claves, no podrás ver la secret key después

### Permisos Necesarios

Tu usuario IAM debe tener estas políticas:
- `AmazonS3FullAccess` (para S3)
- `AdministratorAccess-AWSElasticBeanstalk` (para EB)
- `CloudFrontFullAccess` (opcional, para CloudFront)

## 🔧 Configurar Secrets en GitHub

### Método Visual (GitHub Web):

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú lateral izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Ingresa el **Name** y **Secret** para cada uno
6. Click en **Add secret**
7. Repite para todos los secrets

### Método CLI (si tienes GitHub CLI):

```bash
# Instalar GitHub CLI si no lo tienes
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: ver https://cli.github.com/

# Autenticarse
gh auth login

# Configurar secrets
gh secret set AWS_ACCESS_KEY_ID
# (pega tu access key y presiona Enter)

gh secret set AWS_SECRET_ACCESS_KEY
# (pega tu secret key y presiona Enter)

gh secret set AWS_REGION --body "us-east-1"
gh secret set S3_BUCKET_NAME --body "devshouse-frontend"
gh secret set EB_APPLICATION_NAME --body "devshouse-backend"
gh secret set EB_ENVIRONMENT_NAME --body "devshouse-backend-prod"

# Para VITE_API_URL, primero obtén la URL del backend:
EB_URL=$(aws elasticbeanstalk describe-environments \
  --application-name devshouse-backend \
  --environment-names devshouse-backend-prod \
  --query 'Environments[0].CNAME' \
  --output text)

gh secret set VITE_API_URL --body "http://$EB_URL"
```

## ✅ Verificar Secrets

Una vez configurados todos los secrets:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Deberías ver 7 secrets listados (los valores no se muestran por seguridad)
3. Si falta alguno, agrégalo con **New repository secret**

## 🚀 Probar el Despliegue

Una vez configurados todos los secrets:

```bash
# Hacer un cambio y push
git add .
git commit -m "Test deployment"
git push origin main
```

Luego:
1. Ve a tu repositorio en GitHub
2. Click en la tab **Actions**
3. Verás los workflows ejecutándose
4. Click en cualquiera para ver los logs en tiempo real

## 🐛 Troubleshooting

### "Secret not found" en GitHub Actions
- Verifica que el nombre del secret sea exactamente igual (case-sensitive)
- Los nombres deben ser: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.

### "Invalid credentials" en AWS
- Verifica que tus credenciales sean correctas
- Verifica que tu usuario IAM tenga los permisos necesarios
- Intenta hacer un `aws sts get-caller-identity` localmente para verificar

### "Bucket not found"
- Ejecuta el script de setup primero: `.github/scripts/setup-aws.ps1`
- O crea los recursos manualmente siguiendo [DEPLOYMENT.md](.github/DEPLOYMENT.md)

## 📚 Referencias

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

## 🔒 Seguridad

- ✅ **NUNCA** commitees las credenciales en el código
- ✅ **NUNCA** compartas tus secrets públicamente
- ✅ **Rota** tus credenciales regularmente (cada 90 días)
- ✅ **Usa** usuarios IAM con permisos mínimos necesarios
- ✅ **Habilita** MFA en tu cuenta AWS
