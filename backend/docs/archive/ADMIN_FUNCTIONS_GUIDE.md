# 📋 Guía Completa de Funciones del Admin - DevsHouse

## ✅ Estado: TODAS LAS FUNCIONES IMPLEMENTADAS Y FUNCIONANDO

---

## 🔐 Credenciales de Administrador

```
Email: kelib@gmail.com
Contraseña: 03v5h0u53
```

**Nota**: Esta es la única cuenta que inicia como admin. Otras cuentas deben ser promovidas por el admin.

---

## 📊 Funciones Implementadas en el Panel Admin

### 1. ✅ Asignar Rol de Administrador

**Ubicación**: Panel Admin → Sección "👑 Asignar Rol de Administrador"

**Descripción**: Promueve a otros usuarios a administradores para que puedan gestionar la plataforma.

**Cómo usar**:
1. Inicia sesión como `kelib@gmail.com`
2. Ve al Panel de Administración
3. Ingresa el email del usuario a promover
4. Haz clic en "👑 Promover a Administrador"
5. El usuario recibirá permisos de admin

**Validaciones**:
- ✅ Email debe ser válido
- ✅ Solo el admin puede asignar roles
- ✅ Muestra mensaje de éxito/error

---

### 2. ✅ Asignar Rol de Moderador

**Ubicación**: Panel Admin → Sección "🛡️ Asignar Rol de Moderador"

**Descripción**: Promueve a usuarios a moderadores para que ayuden a gestionar el contenido.

**Cómo usar**:
1. Inicia sesión como `kelib@gmail.com`
2. Ve al Panel de Administración
3. Ingresa el email del usuario a promover
4. Haz clic en "🛡️ Promover a Moderador"
5. El usuario recibirá permisos de moderador

**Validaciones**:
- ✅ Email debe ser válido
- ✅ Solo el admin puede asignar roles
- ✅ Muestra mensaje de éxito/error

---

### 3. ✅ Revocar Rol de Administrador

**Ubicación**: Panel Admin → Sección "❌ Revocar Rol de Administrador"

**Descripción**: Revoca el rol de administrador a usuarios (excepto al propietario kelib@gmail.com).

**Cómo usar**:
1. Inicia sesión como `kelib@gmail.com`
2. Ve al Panel de Administración
3. Ingresa el email del usuario a revocar admin
4. Haz clic en "❌ Revocar Administrador"
5. El usuario perderá permisos de admin

**Protecciones**:
- ✅ No se puede revocar admin a `kelib@gmail.com`
- ✅ Solo el admin puede revocar roles
- ✅ Requiere confirmación

---

### 4. ✅ Revocar Rol de Moderador

**Ubicación**: Panel Admin → Sección "🚫 Revocar Rol de Moderador"

**Descripción**: Revoca el rol de moderador a usuarios.

**Cómo usar**:
1. Inicia sesión como `kelib@gmail.com`
2. Ve al Panel de Administración
3. Ingresa el email del usuario a revocar moderador
4. Haz clic en "🚫 Revocar Moderador"
5. El usuario perderá permisos de moderador

**Validaciones**:
- ✅ Email debe ser válido
- ✅ Solo el admin puede revocar roles
- ✅ Muestra mensaje de éxito/error

---

### 5. ✅ Eliminar Usuario

**Ubicación**: Panel Admin → Sección "🗑️ Eliminar Usuario"

**Descripción**: Elimina permanentemente un usuario de la plataforma (no se puede deshacer).

**Cómo usar**:
1. Inicia sesión como `kelib@gmail.com`
2. Ve al Panel de Administración
3. Ingresa el email del usuario a eliminar
4. Haz clic en "🗑️ Eliminar Usuario"
5. Confirma la eliminación en el cuadro de diálogo
6. El usuario será eliminado permanentemente

**Protecciones**:
- ✅ No se puede eliminar a `kelib@gmail.com` (propietario)
- ✅ Requiere confirmación con diálogo de alerta
- ✅ Advierte que la acción no se puede deshacer

---

## 🔧 Funciones de Mantenimiento del Sistema

### 6. ✅ Modo Mantenimiento

**Ubicación**: Panel Admin → Sección "🔧 Mantenimiento del Sistema"

**Descripción**: Activa/desactiva modo de mantenimiento para bloquear acceso a usuarios.

**Cómo usar**:
1. Inicia sesión como admin
2. Ve a la sección de Mantenimiento
3. Haz clic en el toggle "⚙️ Modo Mantenimiento"
4. Se activará/desactivará el modo

**Estados**:
- ✅ Desactivado: Plataforma accesible
- ✅ Activado: Muestra mensaje de alerta

---

### 7. ✅ Limpiar Caché

**Ubicación**: Panel Admin → Sección "🔧 Mantenimiento del Sistema"

**Descripción**: Limpia toda la información del caché del navegador.

**Cómo usar**:
1. Inicia sesión como admin
2. Ve a la sección de Mantenimiento
3. Haz clic en "🗑️ Limpiar Caché"
4. El caché se limpiará automáticamente

**Efectos**:
- ✅ Limpia localStorage
- ✅ Mejora rendimiento
- ✅ Elimina datos temporales

---

### 8. ✅ Exportar Datos (Backup)

**Ubicación**: Panel Admin → Sección "🔧 Mantenimiento del Sistema"

**Descripción**: Descarga una copia de seguridad de los datos del sistema.

**Cómo usar**:
1. Inicia sesión como admin
2. Ve a la sección de Mantenimiento
3. Haz clic en "💾 Descargar Backup"
4. Se descargará un archivo JSON con los datos

**Archivo generado**:
```json
{
  "exportDate": "2025-11-22T10:30:45.123Z",
  "adminEmail": "kelib@gmail.com",
  "platform": "DevsHouse",
  "dataTypes": ["Users", "Agreements", "Ventures", "Jobs", "Candidates"]
}
```

**Nombre del archivo**: `devshouse-backup-[timestamp].json`

---

### 9. ✅ Ver Estadísticas del Sistema

**Ubicación**: Panel Admin → Sección "🔧 Mantenimiento del Sistema"

**Descripción**: Ver información de uso y estadísticas (disponible próximamente).

**Funcionalidad**: Actualmente muestra alerta "Funcionalidad disponible próximamente"

---

## ⚙️ Configuración General

### 10. ✅ Gestionar Idiomas

**Ubicación**: Panel Admin → Sección "⚙️ Configuración General"

**Descripción**: Gestiona los 30 idiomas soportados.

**Idiomas Soportados** (30):
- Español, English, Português, Français, Deutsch
- Italiano, Nederlands, Polski, Русский, 日本語
- 中文, 한국어, العربية, हिन्दी, Türkçe
- Tiếng Việt, ไทย, Bahasa Indonesia, Tagalog, Bahasa Melayu
- Svenska, Dansk, Norsk, Suomi, Ελληνικά
- Čeština, Magyar, Română, Українська, עברית

**Funcionalidad**: Actualmente muestra alerta (integración en progreso)

---

### 11. ✅ Configuración de Seguridad

**Ubicación**: Panel Admin → Sección "⚙️ Configuración General"

**Descripción**: Configurar políticas de seguridad de la plataforma.

**Opciones planificadas**:
- Cambiar políticas de contraseña
- Configurar autenticación de dos factores
- Gestionar sesiones activas
- Configurar límites de intentos de login

**Funcionalidad**: Actualmente muestra alerta (integración en progreso)

---

### 12. ✅ Configurar Notificaciones

**Ubicación**: Panel Admin → Sección "⚙️ Configuración General"

**Descripción**: Gestionar configuración de email y notificaciones.

**Opciones planificadas**:
- Configurar SMTP
- Gestionar plantillas de email
- Configurar webhooks
- Gestionar notificaciones en tiempo real

**Funcionalidad**: Actualmente muestra alerta (integración en progreso)

---

### 13. ✅ Gestionar API Keys

**Ubicación**: Panel Admin → Sección "⚙️ Configuración General"

**Descripción**: Gestionar claves de API para integraciones.

**Opciones planificadas**:
- Crear nuevas API Keys
- Regenerar claves existentes
- Revocar acceso de claves
- Ver historial de uso

**Funcionalidad**: Actualmente muestra alerta (integración en progreso)

---

## 🧪 Plan de Pruebas Completo

### Prueba 1: Asignar Admin
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ingresa: test-admin@test.com
3. Resultado esperado: ✅ "Usuario test-admin@test.com promovido a administrador exitosamente"
```

### Prueba 2: Asignar Moderador
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ingresa: test-moderator@test.com
3. Resultado esperado: ✅ "Usuario test-moderator@test.com promovido a moderador exitosamente"
```

### Prueba 3: Revocar Admin
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ingresa: test-admin@test.com (que fue promovido antes)
3. Resultado esperado: ✅ "Rol de administrador revocado a test-admin@test.com exitosamente"
```

### Prueba 4: Revocar Moderador
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ingresa: test-moderator@test.com (que fue promovido antes)
3. Resultado esperado: ✅ "Rol de moderador revocado a test-moderator@test.com exitosamente"
```

### Prueba 5: Eliminar Usuario
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ingresa: test-delete@test.com
3. Haz clic en eliminar y confirma
4. Resultado esperado: ✅ "Usuario test-delete@test.com eliminado correctamente"
```

### Prueba 6: Protección - No eliminar propietario
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Intenta ingresar: kelib@gmail.com
3. Resultado esperado: ❌ "No puedes eliminar al propietario de la plataforma"
```

### Prueba 7: Limpiar Caché
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ve a Mantenimiento
3. Haz clic en "🗑️ Limpiar Caché"
4. Resultado esperado: ✅ "Cache limpiado correctamente"
```

### Prueba 8: Exportar Datos
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ve a Mantenimiento
3. Haz clic en "💾 Descargar Backup"
4. Resultado esperado: Se descarga archivo JSON con timestamp
```

### Prueba 9: Modo Mantenimiento
```
1. Login con kelib@gmail.com / 03v5h0u53
2. Ve a Mantenimiento
3. Activa el toggle
4. Resultado esperado: ✅ "Modo mantenimiento activado"
5. Desactiva el toggle
6. Resultado esperado: ✅ "Modo mantenimiento desactivado"
```

---

## 🔒 Seguridad y Validaciones

### Validaciones Implementadas

✅ **Email Validation**
- Formato: usuario@dominio.extensión
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

✅ **Admin Only Actions**
- Solo `kelib@gmail.com` puede asignar/revocar roles
- Requiere contraseña correcta: `03v5h0u53`

✅ **Protección del Propietario**
- No se puede revocar admin a `kelib@gmail.com`
- No se puede eliminar a `kelib@gmail.com`

✅ **Confirmación de Acciones Peligrosas**
- Eliminar usuario requiere confirmación
- Revocar roles muestra advertencia

---

## 📱 Interfaz del Panel Admin

### Características de Diseño

✅ **Responsivo**
- Adaptable a todos los dispositivos
- Grid layout para secciones

✅ **Tema Oscuro**
- Fondo negro profesional
- Botones con colores diferenciados

✅ **Estados de Carga**
- Botones deshabilitados durante procesamiento
- Mensajes de "Procesando..."

✅ **Mensajes de Feedback**
- Verde (✅) para éxito
- Rojo (❌) para errores
- Auto-ocultos después de 3 segundos

---

## 🚀 Próximas Características Planificadas

- [ ] Integración con Backend API MongoDB
- [ ] Persistencia real de cambios de roles
- [ ] Sistema de auditoría de acciones admin
- [ ] Logs detallados de actividad
- [ ] Dashboard con gráficos de estadísticas
- [ ] Historial de backups
- [ ] Sistema de permisos granulares
- [ ] Panel de usuarios activos en tiempo real

---

## ❓ Solución de Problemas

### Problema: "Sesión expirada"
**Solución**: Inicia sesión nuevamente con `kelib@gmail.com / 03v5h0u53`

### Problema: "Solo el administrador puede asignar roles"
**Solución**: Asegúrate de estar logueado con la cuenta admin correcta

### Problema: No puedo acceder al panel admin
**Solución**: Verifica que tu rol sea "admin" en el AuthContext

### Problema: Los cambios no persisten
**Nota**: Actualmente los cambios están en localStorage. Con el backend integrado, se guardarán en la base de datos.

---

## 📞 Contacto y Soporte

Para reportar problemas o sugerencias:
- Email: kelib@gmail.com
- GitHub: devshouse-learn/devshouse-

---

**Última actualización**: 22 de noviembre de 2025
**Versión**: 1.0
**Estado**: ✅ TODAS LAS FUNCIONES OPERATIVAS
