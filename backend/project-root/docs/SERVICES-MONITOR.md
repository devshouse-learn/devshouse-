# 🚀 Sistema de Monitoreo y Reinicio Automático

## Estado Actual
✅ **Backend**: http://localhost:3001 (PID en /tmp/backend.pid)
✅ **Frontend**: http://localhost:5173 (PID en /tmp/frontend.pid)
✅ **Monitor**: En ejecución y verificando cada 10 segundos
✅ **Base de Datos**: PostgreSQL AWS RDS conectada

## Cómo Funciona

### Scripts de Iniciación

#### 1. `monitor-services.sh` (RECOMENDADO)
- **Ubicación**: `/Users/ibacrea/Documents/devshouse-/monitor-services.sh`
- **Función**: Monitorea y reinicia automáticamente backend y frontend si se caen
- **Verificación**: Cada 10 segundos
- **Reinicio automático**: Si algún servicio no responde

**Para iniciar:**
```bash
nohup bash /Users/ibacrea/Documents/devshouse-/monitor-services.sh > /tmp/monitor.log 2>&1 &
```

#### 2. `start-services.sh` (Manual)
- **Ubicación**: `/Users/ibacrea/Documents/devshouse-/start-services.sh`
- **Función**: Inicia backend y frontend de forma manual
- **Verificación**: Solo al inicio

**Para iniciar:**
```bash
bash /Users/ibacrea/Documents/devshouse-/start-services.sh
```

## Logs

- **Backend**: `/tmp/backend.log`
- **Frontend**: `/tmp/frontend.log`
- **Monitor**: `/tmp/monitor.log`
- **Servicios**: `/tmp/services-monitor.log`

Ver logs en tiempo real:
```bash
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
tail -f /tmp/monitor.log
```

## Verificación de Conectividad

### Backend + Base de Datos
```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "message": "DevsHouse Backend API is running",
  "timestamp": "2025-11-26T19:11:41.335Z",
  "version": "v1"
}
```

### Frontend
```bash
curl http://localhost:5173/ | head -5
```

Debe retornar HTML con `<!DOCTYPE html>`

### Prueba Completa
```bash
sleep 3 && curl -s http://localhost:3001/api/health && echo "" && curl -s http://localhost:5173/ | head -5
```

## Procesos

Ver PIDs:
```bash
ps aux | grep "npm run dev\|monitor-services" | grep -v grep
```

Ver PIDs guardados:
```bash
cat /tmp/backend.pid /tmp/frontend.pid /tmp/monitor.pid
```

## Detener Servicios

### Detener todo (limpio):
```bash
# Matar monitor
pkill -f "monitor-services.sh"

# Esperar 2 segundos (para que se limpie)
sleep 2

# Verificar que backend y frontend se hayan detenido
ps aux | grep "npm run dev" | grep -v grep
```

### Matar todo por la fuerza:
```bash
pkill -9 npm; pkill -9 node; pkill -9 bash
```

## Reinicios Automáticos

El monitor detecta y reinicia automáticamente si:
- Backend no responde a `http://localhost:3001/api/health`
- Frontend no responde a `http://localhost:5173`
- Algún proceso se ha terminado

## Configuración de Conectividad

### Backend ↔ Base de Datos
- **BD Host**: `ibacrea-postgres-db.cxue6u0qsdft.us-east-1.rds.amazonaws.com`
- **BD Port**: `5432`
- **BD Name**: `postgres`
- **Archivo Config**: `/backend/.env`

### Frontend ↔ Backend
- **Backend URL**: `http://localhost:3001/api`
- **Configurado en**: `/frontend/src/config/constants.js`
- **CORS habilitado** para `http://localhost:5173`

## Cambios Realizados

1. ✅ Creado `monitor-services.sh` con reinicio automático
2. ✅ Configurado CORS para puerto correcto (5173)
3. ✅ Deshabilitado `sequelize.sync({ alter: true })` que causaba bloqueos
4. ✅ Backend conectado permanentemente a AWS RDS PostgreSQL
5. ✅ Frontend apuntando correctamente a API backend
6. ✅ Ambos servicios en ejecución y monitoreados continuamente

## Próximos Pasos (Opcional)

Para hacerlo aún más robusto:
1. Crear servicio systemd para iniciar en boot
2. Agregar health checks a base de datos
3. Implementar logs rotados (actualmente en /tmp)
4. Agregar métricas de performance
