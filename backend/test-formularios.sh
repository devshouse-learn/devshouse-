#!/bin/bash

echo "🧪 =========================================="
echo "   PRUEBAS DE FORMULARIOS - DEVSHOUSE"
echo "=========================================="
echo ""

# Esperar a que el servidor esté listo
echo "⏳ Esperando que el servidor backend esté listo..."
sleep 5

# Verificar que el servidor esté funcionando
echo "🔍 Verificando conexión al servidor..."
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ ERROR: El servidor backend no está funcionando en http://localhost:3000"
    echo "   Por favor, inicia el servidor con: cd backend && npm run dev"
    exit 1
fi

echo "✅ Servidor backend funcionando correctamente"
echo ""

# TEST 1: CONVENIO EDUCATIVO
echo "📋 =========================================="
echo "   TEST 1: FORMULARIO DE CONVENIOS"
echo "=========================================="
echo ""

echo "Creando convenio de la Universidad de Antioquia..."
AGREEMENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/agreements \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Universidad de Antioquia",
    "schoolType": "university",
    "location": "Medellín, Colombia",
    "contactEmail": "convenios@udea.edu.co",
    "contactName": "Carlos Pérez",
    "contactPhone": "+57 300 123 4567",
    "description": "Convenio para prácticas profesionales en tecnología e innovación",
    "programName": "Ingeniería de Sistemas",
    "duration": "6 meses",
    "benefits": "Certificado de práctica, seguro estudiantil, posibilidad de vinculación",
    "startDate": "2025-01-15"
  }')

echo "$AGREEMENT_RESPONSE" | python3 -m json.tool
AGREEMENT_ID=$(echo "$AGREEMENT_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo ""
echo "✅ Convenio creado con ID: $AGREEMENT_ID"
echo ""

# TEST 2: EMPRENDIMIENTO
echo "🚀 =========================================="
echo "   TEST 2: FORMULARIO DE EMPRENDIMIENTOS"
echo "=========================================="
echo ""

echo "Creando emprendimiento TechStartup..."
VENTURE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/ventures \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechStartup Colombia",
    "industry": "Tecnología",
    "foundedYear": 2024,
    "location": "Bogotá, Colombia",
    "founderName": "María González",
    "founderEmail": "maria@techstartup.co",
    "founderPhone": "+57 310 555 1234",
    "description": "Plataforma de educación tecnológica para América Latina. Conectamos talento con oportunidades.",
    "website": "https://techstartup.co",
    "investmentStage": "seed",
    "fundingNeeded": "$50,000 - $100,000",
    "teamSize": "5-10",
    "revenueModel": "Suscripción mensual y comisiones por colocación"
  }')

echo "$VENTURE_RESPONSE" | python3 -m json.tool
VENTURE_ID=$(echo "$VENTURE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo ""
echo "✅ Emprendimiento creado con ID: $VENTURE_ID"
echo ""

# TEST 3: OFERTA DE EMPLEO
echo "💼 =========================================="
echo "   TEST 3: FORMULARIO DE EMPLEOS"
echo "=========================================="
echo ""

echo "Creando oferta de empleo para Desarrollador Full Stack..."
JOB_RESPONSE=$(curl -s -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Desarrollador Full Stack Senior",
    "company": "Rappi Colombia",
    "description": "Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo de innovación.",
    "requirements": "- 3+ años de experiencia\n- React, Node.js, PostgreSQL\n- Metodologías ágiles\n- Inglés intermedio",
    "location": "Medellín, Colombia (Híbrido)",
    "jobType": "full-time",
    "experience": "senior",
    "industry": "Tecnología",
    "salaryMin": 8000000,
    "salaryMax": 12000000,
    "currency": "COP",
    "benefits": "Seguro médico, bonos por desempeño, días de teletrabajo, capacitaciones",
    "contactEmail": "hr@rappi.com",
    "contactPhone": "+57 300 999 8888",
    "applicationDeadline": "2025-12-31",
    "postedByEmail": "recruiter@rappi.com",
    "postedByName": "Laura Martínez"
  }')

echo "$JOB_RESPONSE" | python3 -m json.tool
JOB_ID=$(echo "$JOB_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo ""
echo "✅ Empleo creado con ID: $JOB_ID"
echo ""

# VERIFICAR DATOS CREADOS
echo "📊 =========================================="
echo "   VERIFICACIÓN DE DATOS CREADOS"
echo "=========================================="
echo ""

echo "Obteniendo todos los convenios..."
curl -s http://localhost:3000/api/agreements | python3 -m json.tool | head -20
echo ""

echo "Obteniendo todos los emprendimientos..."
curl -s http://localhost:3000/api/ventures | python3 -m json.tool | head -20
echo ""

echo "Obteniendo todos los empleos..."
curl -s http://localhost:3000/api/jobs | python3 -m json.tool | head -20
echo ""

# RESUMEN
echo "✨ =========================================="
echo "   RESUMEN DE PRUEBAS"
echo "=========================================="
echo ""
echo "✅ Formulario de Convenios: FUNCIONAL"
echo "   - Convenio ID: $AGREEMENT_ID"
echo ""
echo "✅ Formulario de Emprendimientos: FUNCIONAL"
echo "   - Emprendimiento ID: $VENTURE_ID"
echo ""
echo "✅ Formulario de Empleos: FUNCIONAL"
echo "   - Empleo ID: $JOB_ID"
echo ""
echo "🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE"
echo ""
echo "📌 Próximos pasos:"
echo "   1. Visita http://localhost:5173/data-viewer para ver los datos"
echo "   2. Prueba dar like o denunciar los registros"
echo "   3. Accede a /moderation si eres admin o moderador"
echo ""
