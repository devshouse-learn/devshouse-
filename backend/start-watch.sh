#!/bin/bash

# 🔧 Script para iniciar con nodemon en modo desarrollo
# Con optimizaciones de velocidad

echo "🚀 Iniciando DevsHouse Backend (Modo desarrollo con Hot Reload)..."
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install --legacy-peer-deps > /dev/null 2>&1
fi

# Configurar variables
export NODE_ENV=development
export NODE_OPTIONS="--max-old-space-size=256"

# Configurar nodemon para que sea más rápido
exec npx nodemon \
  --exec "node --max-old-space-size=256" \
  --watch src \
  --ignore "src/**/*.test.js" \
  --ignore "node_modules" \
  --delay 500ms \
  --ext js \
  src/index.js
