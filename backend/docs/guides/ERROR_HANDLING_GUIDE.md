# Guía de Manejo de Errores - DevsHouse

## 1. Frontend - Error Boundary

El ErrorBoundary captura errores de React no manejados:

```jsx
// Ya está envuelto en App.jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Características:
- Captura errores en componentes hijos
- Muestra interfaz amigable con opción de reintentar
- En desarrollo: muestra stack trace completo
- En producción: envía errores al servidor

---

## 2. Validación de Formularios

Usa el servicio centralizado `validation.service.js`:

```jsx
import { validateForm, validateField } from '../services/validation.service';

const schema = {
  email: validationRules.email,
  phone: [validationRules.required, validationRules.phone],
  password: [
    validationRules.required,
    validationRules.minLength(8),
  ],
};

const { isValid, errors } = validateForm(formData, schema);
```

### Reglas disponibles:
- `email`: valida email
- `phone`: valida teléfono
- `url`: valida URL
- `required`: campo obligatorio
- `minLength(n)`: mínimo de caracteres
- `maxLength(n)`: máximo de caracteres
- `number`: es número
- `positiveNumber`: número positivo
- `date`: es fecha válida
- `futureDate`: fecha en el futuro

---

## 3. Hook useForm

Para manejar formularios con validación automática:

```jsx
import useForm from '../hooks/useForm';
import validationRules from '../services/validation.service';

const MyForm = () => {
  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      await api.submit(values);
    },
    {
      email: validationRules.email,
      password: [validationRules.required, validationRules.minLength(8)],
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      {form.touched.email && form.errors.email && (
        <span className="error">{form.errors.email}</span>
      )}
    </form>
  );
};
```

---

## 4. API - Try/Catch Pattern

Siempre usa try/catch al hacer llamadas al API:

```jsx
const loadData = async () => {
  try {
    setLoading(true);
    const response = await service.getAll();
    setData(response.data);
    setError('');
  } catch (err) {
    setError('Error al cargar datos: ' + err.message);
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

## 5. Backend - Error Handler Middleware

El backend ya tiene manejadores globales de errores:

```javascript
// Errores de validación
if (err.name === 'ValidationError') {
  return res.status(400).json({
    success: false,
    error: 'Error de validación',
    details: [...],
  });
}

// Errores de autenticación
if (err.name === 'UnauthorizedError') {
  return res.status(401).json({
    success: false,
    error: 'No autorizado',
  });
}
```

---

## 6. Errores Comunes a Prevenir

### ❌ Campo no existe en modelo
```jsx
// MAL: intentar acceder a campo que no existe
{agreement.agreementType}

// BIEN: usar campo que existe
{agreement.status}
```

### ❌ No manejar promesas
```jsx
// MAL
const data = agreementService.getAll();

// BIEN
const data = await agreementService.getAll();
```

### ❌ Sin validación en frontend
```jsx
// MAL
handleSubmit = async () => {
  await service.create(data); // ¿Qué si falla?
};

// BIEN
handleSubmit = async () => {
  if (!validate(data)) return;
  try {
    await service.create(data);
  } catch (err) {
    setError(err.message);
  }
};
```

### ❌ Errores no mostrados al usuario
```jsx
// MAL
catch (err) {
  console.error(err); // Solo log
}

// BIEN
catch (err) {
  setError(err.message); // Mostrar al usuario
  console.error(err); // Y loguear
}
```

---

## 7. Testing de Errores

Para probar manejo de errores:

```javascript
// Simular error de API
curl -X GET http://localhost:3001/api/invalid-endpoint

// Simular error de validación
curl -X POST http://localhost:3001/api/agreements \
  -H "Content-Type: application/json" \
  -d '{"name": ""}' // Campo requerido vacío
```

---

## 8. Checklist para Nuevas Features

- [ ] ¿Validé entrada del usuario?
- [ ] ¿Envuelvo llamadas al API en try/catch?
- [ ] ¿Muestro mensajes de error al usuario?
- [ ] ¿Uso campos correctos según modelo?
- [ ] ¿Probé casos de error (API caído, timeouts)?
- [ ] ¿Agregué loading states?
- [ ] ¿Los mensajes de error son claros?
- [ ] ¿Funciona sin conexión a internet?

---

## 9. Logs y Monitoreo

El backend registra:
- Errores críticos (CRITICAL_ERROR)
- Errores de validación (400)
- Errores de autenticación (401)
- Errores de no encontrado (404)
- Errores del servidor (500)

Ver logs:
```bash
tail -f /tmp/devshouse-backend.log
```

---

## 10. Contacto de Soporte

Para reportar errores:
1. Adjunta el stack trace completo
2. Describe qué hiciste cuando pasó
3. Incluye versión de navegador
4. Copia de logs del backend
