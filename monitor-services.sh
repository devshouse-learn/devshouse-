#!/bin/bash

# Script de monitoreo para mantener backend y frontend corriendo
# Reinicia automáticamente si alguno se cae

BACKEND_LOG="/tmp/backend.log"
FRONTEND_LOG="/tmp/frontend.log"
MONITOR_LOG="/tmp/services-monitor.log"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$MONITOR_LOG"
}

# Función para iniciar backend
start_backend() {
  log "${YELLOW}🔄 Iniciando Backend...${NC}"
  cd /Users/ibacrea/Documents/devshouse-/backend
  nohup npm run dev > "$BACKEND_LOG" 2>&1 &
  BACKEND_PID=$!
  log "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
  echo $BACKEND_PID > /tmp/backend.pid
}

# Función para iniciar frontend
start_frontend() {
  log "${YELLOW}🔄 Iniciando Frontend...${NC}"
  cd /Users/ibacrea/Documents/devshouse-/frontend
  nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
  FRONTEND_PID=$!
  log "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
  echo $FRONTEND_PID > /tmp/frontend.pid
}

# Función para verificar backend
check_backend() {
  if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Función para verificar frontend
check_frontend() {
  if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Iniciar servicios
log "${GREEN}🚀 Iniciando monitoreo de servicios DevsHouse${NC}"
log "=================================================="

start_backend
sleep 8

start_frontend
sleep 4

log "${GREEN}✅ Servicios iniciados correctamente${NC}"
log "=================================================="

# Loop de monitoreo
while true; do
  sleep 10
  
  # Verificar backend
  if ! check_backend; then
    log "${RED}❌ Backend no responde - Reiniciando...${NC}"
    pkill -f "backend.*npm run dev" 2>/dev/null
    sleep 2
    start_backend
    sleep 8
  fi
  
  # Verificar frontend
  if ! check_frontend; then
    log "${RED}❌ Frontend no responde - Reiniciando...${NC}"
    pkill -f "frontend.*npm run dev" 2>/dev/null
    sleep 2
    start_frontend
    sleep 4
  fi
  
  # Log de estado cada minuto
  if [ $((SECONDS % 60)) -eq 0 ]; then
    log "${GREEN}✅ Servicios funcionando correctamente${NC}"
    curl -s http://localhost:3001/api/health | jq -r '.status' > /dev/null 2>&1 && \
      log "  Backend: OK ($(curl -s http://localhost:3001/api/health | jq -r '.timestamp'))"
  fi
done
