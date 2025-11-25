import express from 'express';
import Agreement from '../models/Agreement.sequelize.js';

const router = express.Router();

// GET todos los convenios
router.get('/', async (req, res) => {
  try {
    const { status, schoolType, limit = 50 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (schoolType) where.schoolType = schoolType;

    const agreements = await Agreement.findAll({
      where,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    console.error('Error al obtener convenios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener convenios',
      error: error.message,
    });
  }
});

// GET un convenio por ID
router.get('/:id', async (req, res) => {
  try {
    const agreement = await Agreement.findByPk(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    // Incrementar vistas
    await agreement.increment('views');

    res.json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    console.error('Error al obtener convenio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener convenio',
      error: error.message,
    });
  }
});

// POST crear nuevo convenio
router.post('/', async (req, res) => {
  try {
    const agreement = await Agreement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Convenio creado exitosamente',
      data: agreement,
    });
  } catch (error) {
    console.error('Error al crear convenio:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear convenio',
      error: error.message,
    });
  }
});

// PUT actualizar convenio
router.put('/:id', async (req, res) => {
  try {
    const agreement = await Agreement.findByPk(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    await agreement.update(req.body);

    res.json({
      success: true,
      message: 'Convenio actualizado exitosamente',
      data: agreement,
    });
  } catch (error) {
    console.error('Error al actualizar convenio:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar convenio',
      error: error.message,
    });
  }
});

// DELETE eliminar convenio
router.delete('/:id', async (req, res) => {
  try {
    const agreement = await Agreement.findByPk(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    await agreement.destroy();

    res.json({
      success: true,
      message: 'Convenio eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar convenio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar convenio',
      error: error.message,
    });
  }
});

export default router;
