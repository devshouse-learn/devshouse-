import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La ruta ${req.path} no existe`,
    statusCode: 404,
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 DevsHouse Backend API running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

export default app;
