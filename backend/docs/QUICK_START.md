# 🚀 Guía Rápida de Inicio - DevsHouse

## Problemas Solucionados

### ✅ 1. Inconsistencia de Puerto
- **Problema**: Backend decía que estaba en puerto 3000 y luego en 3001
- **Solución**: El `.env` tiene `PORT=3001`, ahora el código respeta esta configuración

### ✅ 2. Lentitud en Inicio
- **Problema**: Backend tardaba mucho en iniciar con nodemon
- **Solución**: Creamos scripts optimizados para inicio rápido

### ✅ 3. Errores de Módulos
- **Problema**: Errores de inicialización de servicios
- **Solución**: Se agregaron los métodos faltantes en aiDiagnostic.service.js

---

## 📋 Comandos Disponibles

### Backend (Carpeta: `/backend`)

**Opción 1: Inicio rápido (Recomendado)**
```bash
npm run dev:fast
```
- ⚡ Inicio en ~2-3 segundos
- 🔧 Sin hot-reload
- ✅ Ideal para producción o testing rápido

**Opción 2: Desarrollo con Hot-Reload**
```bash
npm run dev
```
- 🔄 Reinicia automáticamente al cambiar código
- 📦 Usa nodemon optimizado
- ✅ Ideal para desarrollo

**Opción 3: Inicio simple**
```bash
npm start
```
- 🎯 Inicio directo con node
- Sin vigilancia de cambios

---

## 🌐 Frontend (Carpeta: `/frontend`)

**Inicio del frontend:**
```bash
npm run dev
```
- 🎨 Vite en modo desarrollo
- 🔥 Hot Module Replacement (HMR)
- 📍 Disponible en: http://localhost:5173

---

## ✔️ Verificar que todo funciona

### Backend Health Check
```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "DevsHouse Backend API is running",
  "timestamp": "2026-01-10T15:39:00.701Z",
  "version": "v1"
}
```

### Abrir el navegador
- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:3001/api/health

---

## 🆘 Si Aún Hay Problemas

### Puerto 3001 en Uso
Si dice "Puerto 3001 está en uso":

```bash
# Matar procesos node
killall -9 node

# O encontrar qué está usando el puerto
lsof -i :3001
```

### Backend no responde
1. Verificar que está en `development` en `.env`
2. Verificar que `node_modules` existe
3. Reinstalar dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```

### Frontend no conecta al backend
- Verificar que el backend está corriendo en puerto 3001
- Revisar que el `.env` del frontend tiene la URL correcta
- Limpiar cache del navegador (Ctrl+Shift+Delete)

---

## 📊 Status de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend | 3001 | http://localhost:3001 |
| Frontend | 5173 | http://localhost:5173 |
| API Health | 3001 | http://localhost:3001/api/health |

---

## 💡 Tips de Desarrollo

### Para desarrollo productivo:
1. Backend: `npm run dev:fast`
2. Frontend: `npm run dev`
3. Abrir navegador: http://localhost:5173

### Para testing rápido:
1. Backend: `npm run dev:fast` (sin cambios de código)
2. Usar `curl` para probar endpoints

### Monitoreo de errores:
Los logs aparecen en la terminal del backend
- `[INFO]`: Información general
- `[WARN]`: Advertencias
- `[ERROR]`: Errores

---

**Última actualización**: 10 de enero de 2026
**Estado**: ✅ Backend optimizado y funcionando
