#!/bin/bash

# Script para iniciar y mantener Backend y Frontend corriendo
# Maneja reintentos automáticos si alguno se cae

set -e

BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
BACKEND_PORT=3001
FRONTEND_PORT=5173

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🚀 DEVSHOUSE - Sistema de Inicio Completo          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Función para limpiar puertos
cleanup_ports() {
  echo -e "${YELLOW}🧹 Limpiando puertos ${BACKEND_PORT} y ${FRONTEND_PORT}...${NC}"
  
  # Matar procesos en los puertos
  lsof -ti:${BACKEND_PORT} 2>/dev/null | xargs kill -9 2>/dev/null || true
  lsof -ti:${FRONTEND_PORT} 2>/dev/null | xargs kill -9 2>/dev/null || true
  
  sleep 2
  echo -e "${GREEN}✅ Puertos limpios${NC}"
}

# Función para iniciar backend
start_backend() {
  echo -e "${BLUE}📦 Iniciando Backend...${NC}"
  
  cd "${BACKEND_DIR}"
  npm run dev > /tmp/backend.log 2>&1 &
  BACKEND_PID=$!
  
  echo -e "${GREEN}✅ Backend iniciado (PID: ${BACKEND_PID})${NC}"
  cd - > /dev/null
}

# Función para iniciar frontend
start_frontend() {
  echo -e "${BLUE}⚛️  Iniciando Frontend...${NC}"
  
  cd "${FRONTEND_DIR}"
  npm run dev > /tmp/frontend.log 2>&1 &
  FRONTEND_PID=$!
  
  echo -e "${GREEN}✅ Frontend iniciado (PID: ${FRONTEND_PID})${NC}"
  cd - > /dev/null
}

# Función para monitorear procesos
monitor_processes() {
  while true; do
    # Verificar si el backend sigue corriendo
    if ! ps -p ${BACKEND_PID} > /dev/null 2>&1; then
      echo -e "${RED}❌ Backend se ha caído. Reiniciando...${NC}"
      cleanup_ports
      start_backend
    fi
    
    # Verificar si el frontend sigue corriendo
    if ! ps -p ${FRONTEND_PID} > /dev/null 2>&1; then
      echo -e "${RED}❌ Frontend se ha caído. Reiniciando...${NC}"
      start_frontend
    fi
    
    sleep 5
  done
}

# Trap para limpiar al salir
cleanup() {
  echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
  kill ${BACKEND_PID} 2>/dev/null || true
  kill ${FRONTEND_PID} 2>/dev/null || true
  echo -e "${GREEN}✅ Servicios detenidos${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Iniciar
cleanup_ports
start_backend
sleep 3
start_frontend

echo -e "${GREEN}"
echo "════════════════════════════════════════════════════════"
echo "✅ Sistema iniciado correctamente"
echo ""
echo "Backend:  http://localhost:${BACKEND_PORT}"
echo "Frontend: http://localhost:${FRONTEND_PORT}"
echo ""
echo "Presiona Ctrl+C para detener"
echo "════════════════════════════════════════════════════════"
echo -e "${NC}"

# Monitorear procesos
monitor_processes
