#!/bin/bash

# Script para iniciar el backend de forma segura
# Limpia puertos y evita conflictos

echo "🧹 Limpiando puertos..."

# Matar procesos que usen los puertos 3000 y 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Esperar a que se liberen
sleep 2

echo "✅ Puertos limpios"
echo "🚀 Iniciando backend..."

# Iniciar npm run dev
npm run dev
