#!/bin/bash

# Script para iniciar backend y frontend de DevsHouse de forma permanente
# Los servidores continuarán ejecutándose incluso si cierras esta ventana

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🚀 INICIANDO DEVSHOUSE EN MODO DESARROLLO         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Iniciar Backend
echo "1️⃣  Iniciando Backend..."
cd /Users/ibacrea/Documents/devshouse-/backend
nohup node src/index.js > /tmp/devshouse-backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend iniciado (PID: $BACKEND_PID)"
echo "   📊 Puerto: 3001"
echo "   📋 Log: /tmp/devshouse-backend.log"
echo ""

# Esperar a que el backend inicie
sleep 3

# Iniciar Frontend
echo "2️⃣  Iniciando Frontend..."
cd /Users/ibacrea/Documents/devshouse-/frontend
nohup npm run dev > /tmp/devshouse-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   ✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo "   ⚛️  Puerto: 5173"
echo "   📋 Log: /tmp/devshouse-frontend.log"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ LISTO PARA USAR                     ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  🌐 Frontend:  http://localhost:5173                       ║"
echo "║  📊 Backend:   http://localhost:3001/api                   ║"
echo "║  📋 Backend Log: tail -f /tmp/devshouse-backend.log        ║"
echo "║  📋 Frontend Log: tail -f /tmp/devshouse-frontend.log      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Para DETENER los servidores:                              ║"
echo "║  • Backend:  kill $BACKEND_PID                             ║"
echo "║  • Frontend: kill $FRONTEND_PID                            ║"
echo "║  • Ambos:    killall node                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Guardar los PIDs en un archivo para referencia
echo $BACKEND_PID > /tmp/devshouse-backend.pid
echo $FRONTEND_PID > /tmp/devshouse-frontend.pid

echo "Los PIDs se guardaron en:"
echo "  • /tmp/devshouse-backend.pid"
echo "  • /tmp/devshouse-frontend.pid"
