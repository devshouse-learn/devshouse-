#!/bin/bash

# 🚀 Script optimizado para iniciar el backend
# Manejo robusto de puertos y dependencias

set -e  # Salir si hay error

export PORT=${PORT:-3001}
export NODE_ENV=${NODE_ENV:-development}
export NODE_OPTIONS="--max-old-space-size=512"

echo ""
echo "🚀 Iniciando DevsHouse Backend..."
echo ""

# Verificar que Node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias (primera vez)..."
    npm install --legacy-peer-deps 2>&1 | grep -E "added|up to date|error" || true
fi

# Mostrar información
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🚀 DEVSHOUSE BACKEND INICIANDO                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  🌐 Puerto:        $PORT"
echo "  📊 Health Check:  http://localhost:$PORT/api/health"
echo "  📋 Ambiente:      $NODE_ENV"
echo "  💾 Memoria:       512 MB"
echo ""
echo "  Iniciando servidor en 3 segundos..."
echo ""

# Esperar un poco antes de iniciar
sleep 1

# Iniciar con node directamente
exec node src/index.js
