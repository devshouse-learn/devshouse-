# 🔐 Configurar GitHub Secrets - Guía Completa

## Opción 1: Instalar GitHub CLI y Usar Script Automático

### Instalar GitHub CLI:
```powershell
# Opción A: Con winget (Windows 10+)
winget install --id GitHub.cli

# Opción B: Con Chocolatey
choco install gh

# Opción C: Descargar instalador
# https://cli.github.com/
```

### Después de instalar:
```powershell
# Cerrar y reabrir PowerShell

# Autenticarse
gh auth login

# Configurar secrets automáticamente
cd .github\scripts
.\configure-secrets.ps1
```

---

## Opción 2: Configurar Manualmente (Más Rápido para Ahora)

### Paso 1: Ir a GitHub Secrets
Abre en tu navegador:
```
https://github.com/devshouse-learn/devshouse-/settings/secrets/actions
```

### Paso 2: Obtener Valores

#### AWS_ACCESS_KEY_ID
```powershell
aws configure get aws_access_key_id
```
**Copia el resultado** → Agregar en GitHub

#### AWS_SECRET_ACCESS_KEY
```powershell
aws configure get aws_secret_access_key
```
**Copia el resultado** → Agregar en GitHub

#### AWS_REGION
```
us-east-1
```

#### S3_BUCKET_NAME
```
devshouse-frontend-2025
```

#### EB_APPLICATION_NAME
```
devshouse-backend
```

#### EB_ENVIRONMENT_NAME
```
devshouse-prod
```

#### VITE_API_URL
⏳ **Espera 5-10 minutos** hasta que el ambiente esté listo, luego:
```powershell
aws elasticbeanstalk describe-environments --application-name devshouse-backend --environment-names devshouse-prod --query 'Environments[0].CNAME' --output text
```
La URL será algo como: `devshouse-prod.XXXXX.us-east-1.elasticbeanstalk.com`

**Agrégale http:// al inicio**: `http://devshouse-prod.XXXXX.us-east-1.elasticbeanstalk.com`

---

## 📋 Checklist de Secrets

Marca cuando los agregues en GitHub:

- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] AWS_REGION
- [ ] S3_BUCKET_NAME
- [ ] EB_APPLICATION_NAME
- [ ] EB_ENVIRONMENT_NAME
- [ ] VITE_API_URL (después de obtener URL)

---

## 🎯 Cómo Agregar un Secret en GitHub

1. Ve a: https://github.com/devshouse-learn/devshouse-/settings/secrets/actions
2. Click en **"New repository secret"**
3. En **"Name"**: Escribe el nombre exacto (ej: `AWS_ACCESS_KEY_ID`)
4. En **"Secret"**: Pega el valor
5. Click en **"Add secret"**
6. Repite para todos los secrets

---

## ✅ Verificar Secrets Configurados

Después de agregar todos los secrets:

```powershell
# Listar secrets (solo nombres, no valores)
gh secret list
```

Deberías ver:
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET_NAME
EB_APPLICATION_NAME
EB_ENVIRONMENT_NAME
VITE_API_URL
```

---

## 🚀 Después de Configurar Secrets

```bash
git add .
git commit -m "Add AWS deployment configuration"
git push origin main
```

Ve a GitHub Actions para ver el despliegue:
```
https://github.com/devshouse-learn/devshouse-/actions
```

---

## 💡 Tips

- Los secrets son **case-sensitive**: `AWS_REGION` ≠ `aws_region`
- Los valores **NO** se muestran después de agregarlos (por seguridad)
- Puedes actualizar un secret creando uno nuevo con el mismo nombre
- No incluyas espacios al inicio o final de los valores

---

## 🔄 Actualizar un Secret Después

### Con GitHub CLI:
```powershell
echo "nuevo-valor" | gh secret set NOMBRE_SECRET
```

### Manualmente:
1. Ve a Settings → Secrets
2. Click en el secret
3. Click en "Update"
4. Ingresa el nuevo valor
5. Click en "Update secret"
