#!/bin/bash

# Script para iniciar backend y frontend de DevsHouse
# Mantiene ambos servidores corriendo en background

echo "🚀 Iniciando DevsHouse Backend y Frontend..."

# Matar procesos antiguos
echo "🛑 Cerrando procesos anteriores..."
pkill -f "node.*index.js" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
sleep 2

# Iniciar Backend
echo "📦 Iniciando Backend en puerto 3001..."
cd /Users/ibacrea/Documents/devshouse-/backend
nohup node src/index.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Esperar a que backend inicie
sleep 3

# Iniciar Frontend
echo "⚛️  Iniciando Frontend en puerto 5173..."
cd /Users/ibacrea/Documents/devshouse-/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

# Información
echo ""
echo "════════════════════════════════════════════════════"
echo "✅ DevsHouse está corriendo:"
echo "  🌐 Frontend:  http://localhost:5173"
echo "  🔌 Backend:   http://localhost:3001"
echo "  📊 Health:    http://localhost:3001/api/health"
echo ""
echo "📋 Logs:"
echo "  Frontend: tail -f /tmp/frontend.log"
echo "  Backend:  tail -f /tmp/backend.log"
echo ""
echo "🛑 Para detener:"
echo "  kill $BACKEND_PID  (backend)"
echo "  kill $FRONTEND_PID (frontend)"
echo "════════════════════════════════════════════════════"
echo ""

# Mantener script corriendo
wait
