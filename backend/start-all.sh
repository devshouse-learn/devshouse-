#!/bin/bash

# 🚀 Inicio Rápido - DevsHouse

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║               INICIANDO DEVSHOUSE                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Limpiar procesos anteriores
echo "🧹 Limpiando procesos anteriores..."
pkill -f "node.*index.js" 2>/dev/null
sleep 2

echo ""
echo "🚀 Iniciando Backend..."
echo ""

# Iniciar backend
cd /Users/ibacrea/Documents/devshouse-/backend
npm run dev:fast

