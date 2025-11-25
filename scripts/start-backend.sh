#!/bin/bash

# Script para mantener el backend corriendo en background de forma permanente

cd /Users/ibacrea/Documents/devshouse-/backend

echo "🚀 Iniciando Backend DevsHouse..."
echo "📊 Puerto: 3001"
echo "📍 URL: http://localhost:3001/api"
echo ""
echo "El backend se ejecutará en background"
echo "Para detenerlo, ejecuta: killall node"
echo ""

# Iniciar Node.js de forma que no se cierre con la terminal
nohup node src/index.js > /tmp/devshouse-backend.log 2>&1 &

echo "✅ Backend iniciado (PID: $!)"
echo "📋 Log guardado en: /tmp/devshouse-backend.log"
