import { Sequelize } from 'sequelize';

// ⚠️ NO usar dotenv.config() en producción - EB inyecta vars directamente
// Solo cargar dotenv en desarrollo local
if (process.env.NODE_ENV === 'development') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

// Configuración de PostgreSQL con Sequelize
// En producción, EB inyecta las variables desde .ebextensions/01_environment.config
const sequelize = new Sequelize(
  process.env.DB_NAME || 'devshouse',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Para AWS RDS
      }
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

// Probar conexión
export const connectDB = async () => {
  try {
    // Log de configuración (SIN mostrar password)
    console.log('📡 Intentando conectar a PostgreSQL:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'devshouse',
      user: process.env.DB_USER || 'postgres',
      ssl: 'enabled'
    });
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado exitosamente');
    
    // Sincronizar modelos en desarrollo (sin alter para evitar bloqueos)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false, force: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    process.exit(1);
  }
};

// Exportar instancia y operadores
export { sequelize };
export default sequelize;
