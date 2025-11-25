# Testing de Manejo de Errores

## Pruebas Manual recomendadas

### 1. Error Boundary - Frontend

**Test:** Simular error en componente

```
1. Abrir navegador DevTools (F12)
2. En consola, ejecutar:
   throw new Error("Test Error");
3. Debería mostrar página de error con botones
```

**Esperado:** ✅ Se muestra componente ErrorBoundary con opción de reintentar

---

### 2. Validación de Email en Formularios

**Test:** Intentar enviar formulario con email inválido

```
1. Ir a /agreements/form
2. Llenar todos los campos
3. En email, escribir: "notanemail"
4. Click en enviar
```

**Esperado:** ✅ Mostrar error "Email inválido" en campo de email

---

### 3. Validación de Teléfono

**Test:** Intentar enviar formulario con teléfono inválido

```
1. Ir a /agreements/form
2. Llenar todos los campos
3. En teléfono, escribir: "abc"
4. Click en enviar
```

**Esperado:** ✅ Mostrar error "Teléfono inválido" en campo de teléfono

---

### 4. Campo Requerido

**Test:** Enviar formulario con campo vacío

```
1. Ir a /agreements/form
2. Dejar "Nombre de institución" vacío
3. Click en enviar
```

**Esperado:** ✅ Mostrar error "Nombre de institución es requerido"

---

### 5. Carga de Convenios

**Test:** Cargar lista de convenios

```
1. Ir a /agreements
2. Esperar 1-2 segundos
3. Debería mostrar tarjeta con convenio guardado
```

**Esperado:** ✅ Se muestran convenios sin errores

---

### 6. API Caído

**Test:** Simular API caído

```
1. Detener servidor backend: pkill -f "node src/index.js"
2. Ir a /agreements
3. Esperar 30 segundos
4. Debería mostrar error de conexión
```

**Esperado:** ✅ Se muestra error "Error al cargar los convenios"

---

### 7. Network Timeout

**Test:** Simular timeout de conexión

```
1. En DevTools -> Network -> Throttle -> GPRS (muy lento)
2. Ir a /agreements
3. Esperar timeout
```

**Esperado:** ✅ Se muestra error de timeout

---

### 8. Campos Faltantes en BD

**Test:** Verificar que se muestren datos correctamente

```
1. Ir a /agreements
2. Revisar que cada tarjeta tenga:
   - Nombre de escuela
   - Tipo (badge)
   - Ubicación
   - Email
   - Estado (no "agreementType")
3. No debería haber campos como "undefined" o null
```

**Esperado:** ✅ Todos los campos muestran datos correctos

---

## Comandos de Testing

### Verificar errores de consola (Frontend)
```bash
# Ver logs en tiempo real
tail -f /tmp/devshouse-frontend.log
```

### Verificar errores del servidor (Backend)
```bash
# Ver logs en tiempo real
tail -f /tmp/devshouse-backend.log
```

### Probar endpoints del API
```bash
# Test GET agreements
curl -X GET http://localhost:3001/api/agreements

# Test POST agreements (sin datos requeridos)
curl -X POST http://localhost:3001/api/agreements \
  -H "Content-Type: application/json" \
  -d '{}'

# Ver errores de validación
curl -X POST http://localhost:3001/api/ventures \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Test"}'
```

---

## Checklist Pre-Producción

- [ ] ✅ Todos los componentes se cargan sin errores
- [ ] ✅ Validación de formularios funciona correctamente
- [ ] ✅ ErrorBoundary muestra página de error amigable
- [ ] ✅ No hay warnings en console del navegador
- [ ] ✅ Campos correctos se muestran en listas
- [ ] ✅ API maneja errores correctamente
- [ ] ✅ Mensajes de error son claros al usuario
- [ ] ✅ Loading states funcionan
- [ ] ✅ Timeouts se manejan correctamente
- [ ] ✅ No hay "undefined" o "null" en UI

---

## Debugging

### Ver errores de componente específico

```javascript
// En componente, agregar console.log
console.log('Component props:', props);
console.log('Component state:', state);
console.log('API response:', response);
```

### Ver errors de formulario

```javascript
// En handleSubmit
console.log('Form data before submit:', formData);
console.log('Form errors:', errors);
console.log('API response:', response);
```

### Ver errores de la red

DevTools -> Network tab:
1. Filtrar por Fetch/XHR
2. Ver status code (200 OK, 400 Bad Request, 500 Server Error)
3. Ver Response y Headers
4. Ver Timing (cuánto tardó)

---

## Reportar Errores

Cuando encuentres un error:

1. **Captura de pantalla** del error
2. **URL** donde pasó
3. **Steps para reproducir** (1, 2, 3...)
4. **Resultado esperado** vs **resultado actual**
5. **Browser y versión** (Chrome 120, Safari 17, etc.)
6. **Logs** de console (F12) y servidor
