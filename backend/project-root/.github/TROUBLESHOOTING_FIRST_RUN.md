# 🔧 Troubleshooting CI/CD - Primera Ejecución

## ❌ Workflow Falló en Primera Prueba

**Run ID:** https://github.com/devshouse-learn/devshouse-/actions/runs/19741279020

---

## 🔍 Diagnóstico

### ✅ Build Local: EXITOSO
```bash
cd frontend
npm run build
# ✅ built in 1.29s - Sin errores
```

### ❌ GitHub Actions: FALLÓ

**Causa probable:** Problema con secrets de AWS o configuración del workflow

---

## 🛠️ Soluciones

### 1. Verificar GitHub Secrets

Ve a: https://github.com/devshouse-learn/devshouse-/settings/secrets/actions

**Secrets requeridos:**
- ✅ `AWS_ACCESS_KEY_ID` - Debe existir
- ✅ `AWS_SECRET_ACCESS_KEY` - Debe existir
- ✅ `AWS_REGION` - Debe ser `us-east-1`
- ✅ `S3_BUCKET_NAME` - Debe ser `devshouse-frontend-2025`
- ✅ `VITE_API_URL` - Debe ser `http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api`

**Comando para verificar/actualizar:**
```bash
# Verificar si existen
gh secret list

# Actualizar si es necesario
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION --body "us-east-1"
gh secret set S3_BUCKET_NAME --body "devshouse-frontend-2025"
gh secret set VITE_API_URL --body "http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api"
```

---

### 2. Verificar Permisos AWS

El usuario IAM necesita estos permisos:

#### S3 (Frontend)
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject",
    "s3:DeleteObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::devshouse-frontend-2025",
    "arn:aws:s3:::devshouse-frontend-2025/*"
  ]
}
```

#### Elastic Beanstalk (Backend)
```json
{
  "Effect": "Allow",
  "Action": [
    "elasticbeanstalk:*",
    "s3:PutObject",
    "s3:GetObject"
  ],
  "Resource": "*"
}
```

**Verificar permisos en AWS Console:**
1. IAM → Users → [tu-usuario]
2. Permissions tab
3. Verificar que tenga políticas con acceso a S3 y EB

---

### 3. Re-ejecutar Workflow

Después de verificar secrets y permisos:

**Opción A: Re-run desde GitHub UI**
1. Ve a https://github.com/devshouse-learn/devshouse-/actions
2. Click en el workflow fallido
3. Click en "Re-run jobs" → "Re-run failed jobs"

**Opción B: Hacer nuevo commit**
```bash
git commit --allow-empty -m "chore: Retry CI/CD after fixing secrets"
git push origin main
```

---

### 4. Despliegue Manual (Workaround)

Si el workflow sigue fallando, puedes desplegar manualmente:

#### Frontend:
```bash
cd frontend
$env:VITE_API_URL="http://devshouse-prod.eba-72mpzajd.us-east-1.elasticbeanstalk.com/api"
npm run build
aws s3 sync dist/ s3://devshouse-frontend-2025 --delete --exclude "index.html"
aws s3 cp dist/index.html s3://devshouse-frontend-2025/index.html --cache-control "public, max-age=0, must-revalidate"
```

#### Backend:
Ver `SUBIDA_MANUAL_EB.md` para proceso completo.

---

## 🔍 Revisar Logs del Workflow

**Pasos:**
1. Ve a https://github.com/devshouse-learn/devshouse-/actions
2. Click en el workflow fallido
3. Click en el job (ej: "deploy")
4. Expande los steps para ver el error exacto

**Errores comunes y soluciones:**

### Error: "AWS credentials not found"
```
Error: The config profile (default) could not be found
```
**Solución:** Verificar que `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` estén en GitHub Secrets

---

### Error: "Access Denied" en S3
```
Error: An error occurred (AccessDenied) when calling the PutObject operation
```
**Solución:** El usuario IAM no tiene permisos de escritura en S3. Agregar política con `s3:PutObject`

---

### Error: "NoSuchBucket"
```
Error: The specified bucket does not exist
```
**Solución:** Verificar que `S3_BUCKET_NAME` secret tenga el valor correcto: `devshouse-frontend-2025`

---

### Error: "npm ci" fails
```
Error: npm ERR! code ELIFECYCLE
```
**Solución:** Problema con package-lock.json. Regenerar:
```bash
cd frontend
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Regenerate package-lock.json"
git push origin main
```

---

## ✅ Verificación Post-Fix

Después de aplicar soluciones:

1. **Re-ejecutar workflow**
2. **Esperar 2-3 minutos**
3. **Verificar estado:**
   ```bash
   # Debe estar en verde (success)
   # https://github.com/devshouse-learn/devshouse-/actions
   ```
4. **Verificar frontend desplegado:**
   ```bash
   curl http://devshouse-frontend-2025.s3-website-us-east-1.amazonaws.com
   # Debe mostrar HTML con emoji 🚀
   ```

---

## 📋 Checklist de Verificación

- [ ] Todos los secrets están configurados en GitHub
- [ ] AWS credentials son válidas (probar con `aws s3 ls`)
- [ ] Usuario IAM tiene permisos S3 y EB
- [ ] S3 bucket existe y es accesible
- [ ] Build local funciona sin errores
- [ ] Workflow se puede re-ejecutar sin cambios de código

---

## 🎯 Estado Actual

**Frontend:**
- ✅ Build local: FUNCIONANDO
- ❌ GitHub Actions: FALLÓ (primera vez)
- ⏳ Pendiente: Re-ejecutar después de verificar secrets

**Backend:**
- ⏳ No probado aún (esperando fix de frontend primero)
- ✅ Configuración lista en `deploy-backend.yml`
- ✅ Basado en método manual exitoso

---

## 💡 Recomendación

1. **Primero:** Verificar y actualizar GitHub Secrets
2. **Segundo:** Re-ejecutar workflow de frontend
3. **Tercero:** Si funciona, probar workflow de backend con cambio pequeño
4. **Cuarto:** Si todo funciona, documentar como exitoso

---

## 📞 Próximos Pasos

Una vez que el workflow funcione:

1. Actualizar este documento con "✅ RESUELTO"
2. Documentar la causa raíz del problema
3. Agregar al CI_CD_SETUP.md como caso de troubleshooting común
4. Probar workflow de backend con cambio en backend/

---

**Última actualización:** 27 de noviembre, 2025  
**Estado:** 🔧 EN DIAGNÓSTICO
