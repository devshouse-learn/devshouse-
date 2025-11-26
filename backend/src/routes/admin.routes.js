import express from 'express';
import { sequelize } from '../config/database.js';

const router = express.Router();

// POST sincronizar base de datos con modelos
router.post('/sync-db', async (req, res) => {
  try {
    console.log('🔄 Sincronizando base de datos con modelos...');
    
    // Sincronizar todos los modelos con alter: true para añadir columnas
    await sequelize.sync({ alter: true });
    
    console.log('✅ Base de datos sincronizada correctamente');
    res.json({
      success: true,
      message: 'Base de datos sincronizada correctamente',
    });
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al sincronizar base de datos',
      error: error.message,
    });
  }
});

export default router;
