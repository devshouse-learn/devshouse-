import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 🚀 DevsHouse Backend API - Configurado con CI/CD automático
// Deploy: 2025-12-09
// Importar configuración de base de datos
// import { connectDB } from './config/database.js'; // Deshabilitado para modo mock

// Importar rutas
import monitoringRoutes from './routes/monitoring.routes.js';
import aiAssistantRoutes from './routes/aiAssistant.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import emailValidationRoutes from './routes/emailValidation.routes.js';
import agreementsRoutes from './routes/agreements.routes.js';
import venturesRoutes from './routes/ventures.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import candidatesRoutes from './routes/candidates.routes.js';
import reactionsRoutes from './routes/reactions.routes.js';
import moderationRoutes from './routes/moderation.routes.js';

// Importar middleware
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger, { requestLogger, setupErrorMonitoring } from './utils/logger.js';

// Cargar variables de entorno
dotenv.config();

// Configurar monitoreo de errores
setupErrorMonitoring(logger);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(requestLogger(logger));

// Rutas
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'DevsHouse Backend API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
  });
});

// Rutas API
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/email-validation', emailValidationRoutes);
app.use('/api/agreements', agreementsRoutes);
app.use('/api/ventures', venturesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/moderation', moderationRoutes);

app.use('/api/users', (req, res) => {
  res.json({ message: 'Users routes coming soon' });
});

app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores global
app.use(globalErrorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a PostgreSQL/SQLite (deshabilitado para modo mock)
    // try {
    //   await connectDB();
    // } catch (dbError) {
    //   if (process.env.DB_TYPE === 'sqlite') {
    //     console.log('⚠️ SQLite en modo mock - continuando sin conexión');
    //   } else {
    //     console.warn('⚠️ Error de base de datos, continuando con modo degradado:', dbError.message);
    //   }
    // }
    
    // Iniciar servidor con manejo de puertos ocupados
    const server = app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║          🚀 DEVSHOUSE BACKEND API - INICIADO              ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`  🌐 Server:        http://localhost:${PORT}`);
      console.log(`  📊 Health Check:  http://localhost:${PORT}/api/health`);
      console.log(`  📋 Environment:   ${process.env.NODE_ENV}`);
      console.log(`  🗄️  Database:      Mock Data (Desarrollo)`);
      console.log(`  ✅ Modo:          Mock sin conexión a BD`);
      console.log('');
      console.log('══════════════════════════════════════════════════════════════');
      console.log('');
    });

    // Manejo de errores del servidor
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${PORT} está en uso. Intentando con un puerto dinámico...`);
        // Dejar que el SO asigne un puerto disponible
        server.listen(0, () => {
          const dynamicPort = server.address().port;
          console.log(`✅ Backend iniciado en puerto dinámico: ${dynamicPort}`);
          console.log(`  🌐 Server:        http://localhost:${dynamicPort}`);
          console.log(`  📊 Health Check:  http://localhost:${dynamicPort}/api/health`);
        });
      } else {
        console.error('❌ Error del servidor:', err.message);
        process.exit(1);
      }
    });

    // Manejo de cierre graceful
    process.on('SIGINT', () => {
      console.log('\n[2025-12-12T19:XX:XX.XXXZ] [INFO] SIGINT recibido, cerrando servidor...');
      server.close(() => {
        console.log('[2025-12-12T19:XX:XX.XXXZ] [INFO] Servidor cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\n[2025-12-12T19:XX:XX.XXXZ] [INFO] SIGTERM recibido, cerrando servidor...');
      server.close(() => {
        console.log('[2025-12-12T19:XX:XX.XXXZ] [INFO] Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;
