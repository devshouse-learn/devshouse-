# 🧪 Testing Local Pre-Despliegue

Usa estos comandos para verificar que todo funciona localmente antes de desplegar a AWS.

## ✅ Test 1: Backend Local

```powershell
# Terminal 1: Iniciar backend
cd backend
npm install
npm run dev
```

**Verificar:**
```powershell
# En otro terminal o navegador
curl http://localhost:3000/api/health
# Debe responder: {"status":"OK","message":"DevsHouse Backend API is running",...}
```

## ✅ Test 2: Frontend Local

```powershell
# Terminal 2: Iniciar frontend
cd frontend
npm install
npm run dev
```

**Verificar:**
- Abrir http://localhost:5173
- La página debe cargar sin errores
- Abrir Developer Tools → Console (no debe haber errores críticos)

## ✅ Test 3: Build de Producción Frontend

```powershell
cd frontend
npm run build
```

**Verificar:**
- Debe crear carpeta `frontend/dist/`
- No debe haber errores de build
- Tamaño del bundle < 5MB es ideal

```powershell
# Ver tamaño del build
Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Sum / 1MB, 2)}}
```

## ✅ Test 4: Simulación de Backend Production

```powershell
cd backend
$env:NODE_ENV="production"
$env:PORT="8080"
npm start
```

**Verificar:**
```powershell
curl http://localhost:8080/api/health
```

## ✅ Test 5: CORS

Con el backend corriendo en un puerto y frontend en otro:

1. Abrir frontend (http://localhost:5173)
2. Abrir Developer Tools → Network
3. Intentar llamar al backend desde el frontend
4. Verificar que no hay errores CORS

## ✅ Test 6: Verificar AWS CLI

```powershell
# Verificar instalación
aws --version

# Verificar configuración
aws sts get-caller-identity

# Debe mostrar tu usuario y account ID
```

## ✅ Test 7: Dry Run del Script Setup

```powershell
# Ver qué haría el script sin ejecutarlo
cd .github\scripts
# Revisar el contenido del script
Get-Content .\setup-aws.ps1 | Select-String "aws "
```

## 🔍 Checklist Pre-Despliegue

Antes de ejecutar el despliegue, verifica:

- [ ] ✅ Backend inicia sin errores
- [ ] ✅ Frontend inicia sin errores
- [ ] ✅ Build de producción funciona
- [ ] ✅ Health check responde correctamente
- [ ] ✅ No hay errores en console del navegador
- [ ] ✅ AWS CLI está configurado
- [ ] ✅ Tienes credenciales de AWS
- [ ] ✅ Git está en rama `main`
- [ ] ✅ No hay cambios sin commitear importantes

## 🚀 Todo Listo

Si todos los tests pasan, estás listo para desplegar:

```powershell
# Ejecutar setup de AWS
cd .github\scripts
.\setup-aws.ps1

# Después configurar GitHub Secrets y hacer push
```

## 🐛 Problemas Comunes

### Backend no inicia
```powershell
# Ver logs detallados
cd backend
npm run dev
# Leer el error y verificar dependencies
```

### Frontend no compila
```powershell
# Limpiar node_modules
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

### CORS errors localmente
Agregar en `backend/src/index.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

---

**¿Todos los tests pasaron? ✅ Procede con el despliegue!**
