import { Sequelize } from 'sequelize';

// ⚠️ NO usar dotenv.config() en producción - EB inyecta vars directamente
// Solo cargar dotenv en desarrollo local
if (process.env.NODE_ENV === 'development') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

// Configuración de BD (PostgreSQL en producción, SQLite en desarrollo)
let sequelize;

if (process.env.DB_TYPE === 'sqlite') {
  // Desarrollo local con SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  });
} else {
  // Producción con PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'devshouse',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false // Para AWS RDS
        } : false
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    }
  );
}

// Probar conexión
export const connectDB = async () => {
  try {
    // Log de configuración según tipo de BD
    if (process.env.DB_TYPE === 'sqlite') {
      console.log('📡 SQLite configurado (sin conexión para desarrollo)');
      console.log('✅ Base de datos en modo mock');
      return; // No hacer exit en SQLite, solo retornar
    } else {
      console.log('📡 Conectando a PostgreSQL:', {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'devshouse',
        user: process.env.DB_USER || 'postgres',
        ssl: process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'
      });
      await sequelize.authenticate();
      console.log('✅ PostgreSQL conectado exitosamente');
    }
    
    // Sincronizar modelos en desarrollo (sin alter para evitar bloqueos)
    if (process.env.NODE_ENV === 'development' && process.env.DB_TYPE !== 'sqlite') {
      await sequelize.sync({ alter: false, force: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    if (process.env.DB_TYPE !== 'sqlite') {
      process.exit(1);
    }
  }
};

// Exportar instancia y operadores
export { sequelize };
export default sequelize;
