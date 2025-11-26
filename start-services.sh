#!/bin/bash

# Script para iniciar backend y frontend
# Garantiza que ambos servicios estén corriendo y conectados

cd /Users/ibacrea/Documents/devshouse-

echo "🚀 Iniciando DevsHouse - Backend y Frontend"
echo "==========================================="

# Iniciar Backend
echo "📦 Iniciando Backend en puerto 3001..."
cd backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Esperar a que el backend esté listo
sleep 6

# Verificar que el backend está respondiendo
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend respondiendo correctamente"
else
    echo "❌ Backend no responde, revisa /tmp/backend.log"
fi

# Iniciar Frontend
echo "⚛️  Iniciando Frontend en puerto 5173..."
cd ../frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

# Esperar a que el frontend esté listo
sleep 4

echo ""
echo "==========================================="
echo "🎉 Servicios iniciados correctamente"
echo "==========================================="
echo "🌐 Backend:  http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "📊 Ver logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Para detener: kill $BACKEND_PID $FRONTEND_PID"
echo "==========================================="

# Mantener el script activo
wait
