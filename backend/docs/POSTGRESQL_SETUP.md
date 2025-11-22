# Guía de Instalación de PostgreSQL para DevsHouse

## Instalación en macOS

### Opción 1: Homebrew (Recomendado)

```bash
# Instalar PostgreSQL
brew install postgresql@15

# Iniciar el servicio
brew services start postgresql@15

# Verificar que está corriendo
brew services list

# Conectar a PostgreSQL
psql postgres
```

### Opción 2: Postgres.app (Más simple)

1. Descargar desde: https://postgresapp.com/
2. Mover a la carpeta Aplicaciones
3. Abrir y hacer clic en "Initialize"
4. PostgreSQL estará disponible en `localhost:5432`

---

## Configuración Inicial de la Base de Datos

### 1. Conectar a PostgreSQL

```bash
# Si usas Homebrew
psql postgres

# Si usas Postgres.app
psql -h localhost -p 5432 -U postgres
```

### 2. Crear Base de Datos y Usuario

```sql
-- Crear base de datos
CREATE DATABASE devshouse;

-- Crear usuario
CREATE USER devshouse_user WITH PASSWORD '03v5h0u53';

-- Dar todos los permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE devshouse TO devshouse_user;

-- Conectar a la base de datos
\c devshouse

-- Dar permisos al esquema público
GRANT ALL ON SCHEMA public TO devshouse_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO devshouse_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO devshouse_user;

-- Salir
\q
```

### 3. Verificar la Conexión

```bash
# Conectar con el nuevo usuario
psql -h localhost -p 5432 -U devshouse_user -d devshouse

# Si pide contraseña: 03v5h0u53
```

---

## Configurar el Backend

### 1. Instalar Dependencias

```bash
cd backend
npm install pg sequelize bcryptjs dotenv
```

### 2. Crear Archivo `.env`

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devshouse
DB_USER=devshouse_user
DB_PASSWORD=03v5h0u53

# Otras configuraciones...
```

### 3. Verificar Configuración

```bash
# Probar conexión desde el backend
node -e "
const { Sequelize } = require('sequelize');
const db = new Sequelize('devshouse', 'devshouse_user', '03v5h0u53', {
  host: 'localhost',
  dialect: 'postgres'
});
db.authenticate()
  .then(() => console.log('✅ Conexión exitosa'))
  .catch(err => console.error('❌ Error:', err));
"
```

---

## Comandos Útiles de PostgreSQL

### Conectar a la Base de Datos

```bash
# Conectar como postgres (superusuario)
psql postgres

# Conectar a la base de datos devshouse
psql -U devshouse_user -d devshouse
```

### Comandos Internos de psql

```sql
-- Listar bases de datos
\l

-- Listar tablas
\dt

-- Describir una tabla
\d nombre_tabla

-- Listar usuarios
\du

-- Conectar a otra base de datos
\c nombre_base_datos

-- Ver conexión actual
\conninfo

-- Salir
\q
```

### Consultas Útiles

```sql
-- Ver todas las tablas del esquema público
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('devshouse'));

-- Ver usuarios y roles
SELECT usename, usecreatedb, usesuper FROM pg_user;

-- Ver conexiones activas
SELECT * FROM pg_stat_activity;
```

---

## Migración de Datos (Opcional)

Si tienes datos en MongoDB y quieres migrarlos:

### 1. Exportar desde MongoDB

```bash
# Exportar colección de usuarios
mongoexport --db=devshouse --collection=users --out=users.json
```

### 2. Transformar y Cargar en PostgreSQL

Crear script de migración en `backend/scripts/migrate.js`:

```javascript
import fs from 'fs';
import User from '../src/models/User.sequelize.js';
import { connectDB } from '../src/config/database.js';

async function migrate() {
  await connectDB();
  
  const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  
  for (const user of data) {
    await User.create({
      name: user.name,
      email: user.email,
      password: user.password, // Ya hasheado
      role: user.role,
      emailVerified: user.emailVerified
    });
  }
  
  console.log('✅ Migración completada');
  process.exit(0);
}

migrate();
```

---

## Troubleshooting

### Error: "role 'postgres' does not exist"

```bash
# Crear rol postgres
createuser -s postgres
```

### Error: "FATAL: database 'devshouse' does not exist"

```bash
# Conectar como postgres y crear base de datos
psql postgres
CREATE DATABASE devshouse;
\q
```

### Error: "FATAL: password authentication failed"

1. Verificar contraseña en `.env`
2. Resetear contraseña del usuario:

```sql
psql postgres
ALTER USER devshouse_user WITH PASSWORD '03v5h0u53';
\q
```

### Error: "connection refused"

```bash
# Verificar que PostgreSQL está corriendo
brew services list

# O iniciar el servicio
brew services start postgresql@15
```

### Ver logs de PostgreSQL

```bash
# Con Homebrew
tail -f /opt/homebrew/var/log/postgresql@15.log

# O verificar el estado
brew services info postgresql@15
```

---

## Desinstalación (si es necesario)

```bash
# Detener servicio
brew services stop postgresql@15

# Desinstalar
brew uninstall postgresql@15

# Eliminar datos (opcional)
rm -rf /opt/homebrew/var/postgresql@15
```

---

## Próximos Pasos

1. ✅ Instalar PostgreSQL localmente
2. ✅ Crear base de datos y usuario
3. ✅ Configurar `.env`
4. ⏳ Instalar dependencias npm
5. ⏳ Ejecutar el servidor backend
6. ⏳ Verificar que las tablas se crean automáticamente
7. ⏳ Probar endpoints de autenticación

---

## Referencias

- Documentación PostgreSQL: https://www.postgresql.org/docs/
- Sequelize Docs: https://sequelize.org/
- Postgres.app: https://postgresapp.com/
- Homebrew PostgreSQL: https://formulae.brew.sh/formula/postgresql@15
