# Guía de Subida Manual a Elastic Beanstalk

## Package Generado
- **Archivo**: `backend-eb-export.zip`
- **Tamaño**: ~108 KB
- **Contenido**: Código fuente + configuración (SIN node_modules)

---

## Pasos para Subir a AWS

### 1. Acceder a la Consola de EB
```
https://console.aws.amazon.com/elasticbeanstalk/
```

### 2. Navegar a tu Aplicación
- Región: **us-east-1** (N. Virginia)
- Aplicación: **devshouse-backend**
- Ambiente: **devshouse-prod**

### 3. Subir Nueva Versión

#### Opción A: Desde el Dashboard del Ambiente
1. Click en el nombre del ambiente (**devshouse-prod**)
2. Click en **"Upload and deploy"** (botón naranja)
3. Click en **"Choose file"**
4. Selecciona `backend-eb-export.zip`
5. Version label: `manual-20251126-HHMMSS` (o el que prefieras)
6. Click en **"Deploy"**

#### Opción B: Desde Application Versions
1. En el menú izquierdo, click en **"Application versions"**
2. Click en **"Upload"** (botón azul arriba a la derecha)
3. Selecciona `backend-eb-export.zip`
4. Version label: `manual-20251126-HHMMSS`
5. Click en **"Upload"**
6. Una vez subida, selecciona la versión
7. Click en **"Actions" → "Deploy"**
8. Selecciona ambiente: **devshouse-prod**
9. Click en **"Deploy"**

---

## Monitoreo del Despliegue

### Durante el Deploy
1. Ve a **"Environments" → "devshouse-prod"**
2. El estado cambiará a: **"Updating"** (gris)
3. Espera 5-10 minutos
4. El estado debe cambiar a: **"Ok"** (verde) o **"Warning"** (amarillo)

### Ver Eventos en Tiempo Real
1. En el ambiente, click en **"Logs"** → **"Request Logs"** → **"Last 100 Lines"**
2. O click en **"Monitoring"** para ver gráficas

### Si Falla (Health: Red/Severe)
1. Ve a **"Events"** (pestaña)
2. Busca mensajes de ERROR
3. Los errores comunes son:
   - **LaunchWaitCondition failed**: La instancia EC2 no se inició
   - **502 Bad Gateway**: La app no responde en el puerto correcto
   - **npm install failed**: Problema con dependencias

---

## Variables de Entorno Configuradas

Las siguientes variables ya están en `.ebextensions/01_environment.config`:

```bash
NODE_ENV=production
PORT=8080
DB_HOST=ibacrea-postgres-db.cxue6u0qsdft.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=adminuser
DB_PASSWORD=TempPassword123!
JWT_SECRET=devshouse-production-secret-key-2025-super-secure
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
EMAIL_SERVICE=ethereal
FRONTEND_URL=https://devshouse-frontend-2025.s3.amazonaws.com
```

### Si Necesitas Cambiar Variables
1. En el ambiente, click en **"Configuration"**
2. Busca **"Software"** → Click en **"Edit"**
3. En **"Environment properties"**, añade/modifica las variables
4. Click en **"Apply"**

---

## Verificar Despliegue Exitoso

### 1. Obtener la URL
En el dashboard del ambiente verás:
```
URL: http://devshouse-prod.eba-XXXXX.us-east-1.elasticbeanstalk.com
```

### 2. Probar el Backend
```bash
# Health check
curl http://devshouse-prod.eba-XXXXX.us-east-1.elasticbeanstalk.com/api/health

# Debe responder:
{
  "status": "ok",
  "timestamp": "2025-11-26T...",
  "uptime": 123,
  "database": "connected"
}
```

### 3. Actualizar GitHub Secret
Una vez que tengas el CNAME funcionando, actualiza:
```bash
gh secret set VITE_API_URL --body "http://TU-CNAME.elasticbeanstalk.com"
```

---

## Troubleshooting Común

### Error: "502 Bad Gateway"
**Causa**: La app no está escuchando en el puerto 8080
**Solución**: Verifica que en `src/index.js` uses `process.env.PORT || 3000`

### Error: "Cannot connect to database"
**Causa**: PostgreSQL no accesible desde la instancia EC2
**Solución**: 
1. Ve a RDS Console
2. Encuentra `ibacrea-postgres-db`
3. En Security Groups, permite entrada desde el Security Group de EB

### Error: "npm install failed"
**Causa**: Dependencia falta o error en package.json
**Solución**: Revisa los logs de EB para ver qué paquete falló

### Health check falla constantemente
**Causa**: La aplicación tarda mucho en iniciar o crashea
**Solución**:
1. Ve a **Configuration → Health** 
2. Aumenta el timeout del health check a 60 segundos
3. Cambia la ruta a `/api/health` si es necesario

---

## Comandos Útiles (Opcional)

### Subir desde AWS CLI
```bash
# Crear versión
aws elasticbeanstalk create-application-version \
  --application-name devshouse-backend \
  --version-label manual-20251126-180000 \
  --source-bundle S3Bucket=tu-bucket,S3Key=backend-eb-export.zip

# Desplegar
aws elasticbeanstalk update-environment \
  --environment-name devshouse-prod \
  --version-label manual-20251126-180000
```

### Ver logs en tiempo real
```bash
aws elasticbeanstalk request-environment-info \
  --environment-name devshouse-prod \
  --info-type tail

# Esperar 30 segundos
aws elasticbeanstalk retrieve-environment-info \
  --environment-name devshouse-prod \
  --info-type tail
```

---

## Contacto/Soporte

Si el despliegue falla después de varios intentos:
1. Verifica que PostgreSQL RDS esté accesible
2. Revisa los Security Groups de EC2 y RDS
3. Considera usar AWS App Runner como alternativa más simple
4. Pide ayuda con los logs de eventos de EB

---

**Última actualización**: 26 de noviembre de 2025
**Package generado**: `backend-eb-export.zip` (108 KB)
