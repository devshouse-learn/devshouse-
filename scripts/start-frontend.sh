#!/bin/bash

# Script para mantener el frontend corriendo en background de forma permanente

cd /Users/ibacrea/Documents/devshouse-/frontend

echo "🚀 Iniciando Frontend DevsHouse..."
echo "⚛️  Puerto: 5173"
echo "📍 URL: http://localhost:5173"
echo ""
echo "El frontend se ejecutará en background"
echo "Para detenerlo, ejecuta: killall node"
echo ""

# Iniciar npm dev de forma que no se cierre con la terminal
nohup npm run dev > /tmp/devshouse-frontend.log 2>&1 &

echo "✅ Frontend iniciado (PID: $!)"
echo "📋 Log guardado en: /tmp/devshouse-frontend.log"
