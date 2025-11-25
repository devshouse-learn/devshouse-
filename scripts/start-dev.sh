#!/bin/bash

# Script para iniciar frontend y backend de DevsHouse

echo "🚀 Iniciando DevsHouse en modo desarrollo..."
echo ""

# Iniciar backend en terminal separada
echo "📊 Iniciando Backend (puerto 3001)..."
cd /Users/ibacrea/Documents/devshouse-/backend
node src/index.js &
BACKEND_PID=$!

# Esperar a que el backend inicie
sleep 3

# Iniciar frontend en terminal separada
echo "⚛️  Iniciando Frontend (puerto 5173)..."
cd /Users/ibacrea/Documents/devshouse-/frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados:"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener los servidores"

# Mantener el script activo
wait $BACKEND_PID $FRONTEND_PID
