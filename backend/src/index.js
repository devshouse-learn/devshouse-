import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar configuración de base de datos
import { connectDB } from './config/database.js';

// Importar rutas
import monitoringRoutes from './routes/monitoring.routes.js';
import aiAssistantRoutes from './routes/aiAssistant.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import emailValidationRoutes from './routes/emailValidation.routes.js';

// Importar middleware
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './utils/logger.js';

// Cargar variables de entorno
dotenv.config();

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
app.use(requestLogger);

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

app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth routes coming soon' });
});

app.use('/api/users', (req, res) => {
  res.json({ message: 'Users routes coming soon' });
});

app.use('/api/agreements', (req, res) => {
  res.json({ message: 'Agreements routes coming soon' });
});

app.use('/api/ventures', (req, res) => {
  res.json({ message: 'Ventures routes coming soon' });
});

app.use('/api/jobs', (req, res) => {
  res.json({ message: 'Jobs routes coming soon' });
});

app.use('/api/candidates', (req, res) => {
  res.json({ message: 'Candidates routes coming soon' });
});

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores global
app.use(globalErrorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a PostgreSQL
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║          🚀 DEVSHOUSE BACKEND API - INICIADO              ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`  🌐 Server:        http://localhost:${PORT}`);
      console.log(`  📊 Health Check:  http://localhost:${PORT}/api/health`);
      console.log(`  � Environment:   ${process.env.NODE_ENV}`);
      console.log(`  🗄️  Database:      PostgreSQL (AWS RDS)`);
      console.log(`  📍 DB Host:       ${process.env.DB_HOST}`);
      console.log('');
      console.log('══════════════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

export default app;
