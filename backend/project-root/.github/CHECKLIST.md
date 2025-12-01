# ✅ Checklist de Despliegue AWS

Usa este checklist para asegurarte de que todo está configurado correctamente.

## 📋 Pre-requisitos

- [ ] Cuenta de AWS activa
- [ ] AWS CLI instalado (`aws --version`)
- [ ] AWS CLI configurado (`aws sts get-caller-identity`)
- [ ] Acceso al repositorio GitHub
- [ ] Permisos de admin en el repositorio (para configurar secrets)

## 🔧 Configuración AWS (Opción Automática)

- [ ] Ejecutar script de setup:
  ```powershell
  # Windows
  cd .github\scripts
  .\setup-aws.ps1
  ```
  ```bash
  # Linux/Mac
  cd .github/scripts
  chmod +x setup-aws.sh
  ./setup-aws.sh
  ```

- [ ] Anotar los siguientes valores del output:
  - [ ] Nombre del bucket S3: `_________________`
  - [ ] Nombre aplicación EB: `_________________`
  - [ ] Nombre ambiente EB: `_________________`
  - [ ] Región AWS: `_________________`

- [ ] Obtener URL del backend (esperar 5-10 min después del script):
  ```bash
  aws elasticbeanstalk describe-environments \
    --application-name TU_APP \
    --environment-names TU_ENV \
    --query 'Environments[0].CNAME' \
    --output text
  ```
  URL Backend: `_________________`

## 🔐 Configuración GitHub Secrets

Ve a: **GitHub Repo → Settings → Secrets and variables → Actions**

- [ ] `AWS_ACCESS_KEY_ID` (obtener con `aws configure get aws_access_key_id`)
- [ ] `AWS_SECRET_ACCESS_KEY` (debe estar guardado previamente)
- [ ] `AWS_REGION` (ejemplo: `us-east-1`)
- [ ] `S3_BUCKET_NAME` (del paso anterior)
- [ ] `EB_APPLICATION_NAME` (del paso anterior)
- [ ] `EB_ENVIRONMENT_NAME` (del paso anterior)
- [ ] `VITE_API_URL` (URL del backend del paso anterior, con http://)

**Total: 7 secrets configurados**

## 🚀 Primer Despliegue

- [ ] Hacer commit y push:
  ```bash
  git add .
  git commit -m "Configure AWS deployment"
  git push origin main
  ```

- [ ] Verificar workflows en GitHub:
  - [ ] Ir a **Actions** tab
  - [ ] Ver "Deploy Frontend to S3" ejecutándose
  - [ ] Ver "Deploy Backend to Elastic Beanstalk" ejecutándose

- [ ] Esperar a que ambos workflows terminen (✅ verde)

## ✅ Verificación del Despliegue

### Frontend (S3)
- [ ] Abrir URL del frontend:
  ```
  http://TU-BUCKET.s3-website-REGION.amazonaws.com
  ```
- [ ] Verificar que carga la página
- [ ] Verificar que los estilos se ven correctamente
- [ ] Abrir Developer Tools → Console (no debe haber errores graves)

### Backend (Elastic Beanstalk)
- [ ] Verificar health check:
  ```bash
  curl http://TU-AMBIENTE.elasticbeanstalk.com/api/health
  ```
- [ ] Debe responder con JSON:
  ```json
  {
    "status": "OK",
    "message": "DevsHouse Backend API is running",
    "timestamp": "...",
    "version": "v1"
  }
  ```

### Integración Frontend-Backend
- [ ] Abrir frontend en el navegador
- [ ] Abrir Developer Tools → Network
- [ ] Intentar alguna acción que llame al backend
- [ ] Verificar que las peticiones van a la URL correcta
- [ ] Verificar que no hay errores CORS

## 🐛 Troubleshooting

### Si el frontend no carga:
- [ ] Verificar que el bucket existe: `aws s3 ls s3://TU-BUCKET`
- [ ] Verificar política del bucket (debe ser pública)
- [ ] Ver workflow logs en GitHub Actions

### Si el backend no responde:
- [ ] Verificar estado del ambiente:
  ```bash
  aws elasticbeanstalk describe-environments \
    --application-name TU_APP \
    --environment-names TU_ENV
  ```
- [ ] Ver logs de EB:
  ```bash
  aws elasticbeanstalk describe-environment-health \
    --environment-name TU_ENV \
    --attribute-names All
  ```
- [ ] Verificar que el ambiente esté en "Green" o "Ready"

### Si hay errores CORS:
- [ ] Configurar `CORS_ORIGIN` en Elastic Beanstalk:
  ```bash
  aws elasticbeanstalk update-environment \
    --environment-name TU_ENV \
    --option-settings \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=CORS_ORIGIN,Value=http://TU-BUCKET.s3-website-REGION.amazonaws.com
  ```

### Si los workflows fallan:
- [ ] Verificar que todos los secrets están configurados
- [ ] Verificar nombres de secrets (case-sensitive)
- [ ] Ver logs detallados en GitHub Actions
- [ ] Verificar permisos del usuario IAM en AWS

## 🎉 Siguiente Nivel

Una vez que todo funcione:

### Mejoras Opcionales:
- [ ] Configurar dominio personalizado
- [ ] Agregar CloudFront para HTTPS y CDN
- [ ] Configurar Auto Scaling en EB
- [ ] Agregar monitoreo con CloudWatch
- [ ] Configurar alertas de errores
- [ ] Implementar base de datos (MongoDB Atlas o RDS)
- [ ] Configurar backups automáticos

### Ambientes Adicionales:
- [ ] Crear ambiente de staging
- [ ] Configurar deployment condicional por rama
- [ ] Agregar tests automatizados antes del deploy

## 📚 Documentación de Referencia

- [QUICK_DEPLOY.md](../QUICK_DEPLOY.md) - Guía rápida
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Documentación completa
- [GITHUB_SECRETS.md](./GITHUB_SECRETS.md) - Configuración de secrets

## 💾 Guardar Configuración

Anota aquí tu configuración para referencia futura:

```
Proyecto: DevsHouse
Región AWS: _______________
S3 Bucket: _______________
EB Application: _______________
EB Environment: _______________
Frontend URL: _______________
Backend URL: _______________
Fecha de deploy: _______________
```

---

**¿Todo funcionando? 🎉**

Marca esta lista completa y guárdala para futuros despliegues o para compartir con tu equipo.
