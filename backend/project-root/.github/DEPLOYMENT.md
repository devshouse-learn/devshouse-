# Guía de Despliegue - DevsHouse

Esta guía explica cómo configurar y desplegar DevsHouse en AWS usando GitHub Actions.

## 🏗️ Arquitectura de Despliegue

- **Frontend**: React app → AWS S3 + CloudFront (opcional)
- **Backend**: Node.js API → AWS Elastic Beanstalk
- **CI/CD**: GitHub Actions

## 📋 Prerrequisitos

### 1. Cuenta AWS Configurada
- Acceso a AWS Console
- Usuario IAM con permisos necesarios
- AWS CLI configurado localmente

### 2. Recursos AWS Necesarios

#### Para Frontend (S3):
```bash
# Crear bucket S3
aws s3 mb s3://devshouse-frontend --region us-east-1

# Configurar bucket para hosting estático
aws s3 website s3://devshouse-frontend --index-document index.html --error-document index.html

# Política del bucket (hacer público)
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::devshouse-frontend/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket devshouse-frontend --policy file://bucket-policy.json
```

#### Para Backend (Elastic Beanstalk):
```bash
# Crear aplicación Elastic Beanstalk
aws elasticbeanstalk create-application \
  --application-name devshouse-backend \
  --description "DevsHouse Backend API" \
  --region us-east-1

# Crear ambiente
aws elasticbeanstalk create-environment \
  --application-name devshouse-backend \
  --environment-name devshouse-backend-prod \
  --solution-stack-name "64bit Amazon Linux 2023 v6.1.0 running Node.js 18" \
  --option-settings file://eb-options.json \
  --region us-east-1
```

Archivo `eb-options.json`:
```json
[
  {
    "Namespace": "aws:autoscaling:launchconfiguration",
    "OptionName": "IamInstanceProfile",
    "Value": "aws-elasticbeanstalk-ec2-role"
  },
  {
    "Namespace": "aws:elasticbeanstalk:environment",
    "OptionName": "EnvironmentType",
    "Value": "SingleInstance"
  }
]
```

### 3. Variables de Entorno AWS

Configurar en tu CLI local (ya configuradas según mencionaste):
```bash
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region name: us-east-1
# Default output format: json
```

## 🔐 Configuración de GitHub Secrets

Ve a tu repositorio → Settings → Secrets and variables → Actions → New repository secret

### Secrets Requeridos:

| Secret Name | Descripción | Ejemplo |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | Access Key de AWS IAM | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de AWS IAM | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | Región de AWS | `us-east-1` |
| `S3_BUCKET_NAME` | Nombre del bucket S3 | `devshouse-frontend` |
| `EB_APPLICATION_NAME` | Nombre app Elastic Beanstalk | `devshouse-backend` |
| `EB_ENVIRONMENT_NAME` | Nombre ambiente EB | `devshouse-backend-prod` |
| `VITE_API_URL` | URL del backend para el frontend | `http://devshouse-backend-prod.us-east-1.elasticbeanstalk.com` |
| `CLOUDFRONT_DISTRIBUTION_ID` | (Opcional) ID de CloudFront | `E1234567890ABC` |

### Comando para agregar secrets (alternativa):
```bash
# Usando GitHub CLI
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION
gh secret set S3_BUCKET_NAME
gh secret set EB_APPLICATION_NAME
gh secret set EB_ENVIRONMENT_NAME
gh secret set VITE_API_URL
```

## 🚀 Flujo de Despliegue

### Despliegue Automático

Los despliegues se ejecutan automáticamente cuando:

1. **Frontend**: Push a `main` con cambios en `/frontend/**`
2. **Backend**: Push a `main` con cambios en `/backend/**`

### Despliegue Manual

Desde GitHub:
1. Ve a Actions
2. Selecciona el workflow (Deploy Frontend/Backend)
3. Click en "Run workflow"
4. Selecciona la rama `main`
5. Click en "Run workflow"

## 📝 Variables de Entorno del Backend

Las variables de entorno se configuran en Elastic Beanstalk:

```bash
# Usando AWS CLI
aws elasticbeanstalk update-environment \
  --application-name devshouse-backend \
  --environment-name devshouse-backend-prod \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=PORT,Value=8080 \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ORIGIN,Value=https://tu-dominio.com \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=tu-jwt-secret
```

O desde AWS Console:
1. Elastic Beanstalk → Environments
2. Selecciona tu ambiente
3. Configuration → Software → Edit
4. Agregar Environment Properties

## 🔍 Verificación del Despliegue

### Frontend:
```bash
# URL del bucket S3
http://devshouse-frontend.s3-website-us-east-1.amazonaws.com

# O con CloudFront
https://tu-distribucion.cloudfront.net
```

### Backend:
```bash
# Health check
curl http://devshouse-backend-prod.us-east-1.elasticbeanstalk.com/api/health
```

## 🐛 Troubleshooting

### Ver logs del backend:
```bash
# Desde AWS CLI
aws elasticbeanstalk retrieve-environment-info \
  --application-name devshouse-backend \
  --environment-name devshouse-backend-prod \
  --info-type tail

# O descarga los logs
aws elasticbeanstalk request-environment-info \
  --application-name devshouse-backend \
  --environment-name devshouse-backend-prod \
  --info-type bundle
```

### Errores comunes:

1. **"AccessDenied" en S3**: Verifica la política del bucket
2. **EB deployment failed**: Revisa los logs en CloudWatch
3. **CORS errors**: Configura `CORS_ORIGIN` en EB

## 💰 Optimización de Costos

### S3:
- Lifecycle policies para logs antiguos
- Compression de assets habilitada

### Elastic Beanstalk:
- Usar `SingleInstance` para desarrollo/staging
- Configurar Auto Scaling para producción solo si es necesario
- Considerar AWS Lambda + API Gateway para menor costo

## 🔒 Seguridad

### Recomendaciones:
1. **No commitear** archivos `.env`
2. **Rotar** access keys regularmente
3. **Usar** IAM roles con permisos mínimos
4. **Habilitar** HTTPS con CloudFront
5. **Configurar** Security Groups en EB

## 📚 Recursos Adicionales

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS Elastic Beanstalk Node.js](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html)
- [GitHub Actions AWS](https://github.com/aws-actions)

## 🆘 Soporte

Para problemas o preguntas:
- Issues: https://github.com/devshouse-learn/devshouse-/issues
- Email: support@devshouse.com
