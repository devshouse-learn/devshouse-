import express from 'express';
import Venture from '../models/Venture.sequelize.js';

const router = express.Router();

// GET todos los emprendimientos
router.get('/', async (req, res) => {
  try {
    const { status, industry, investmentStage, limit = 50 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    if (investmentStage) where.investmentStage = investmentStage;

    const ventures = await Venture.findAll({
      where,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      count: ventures.length,
      data: ventures,
    });
  } catch (error) {
    console.error('Error al obtener emprendimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener emprendimientos',
      error: error.message,
    });
  }
});

// GET un emprendimiento por ID
router.get('/:id', async (req, res) => {
  try {
    const venture = await Venture.findByPk(req.params.id);

    if (!venture) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    // Incrementar vistas
    await venture.increment('views');

    res.json({
      success: true,
      data: venture,
    });
  } catch (error) {
    console.error('Error al obtener emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener emprendimiento',
      error: error.message,
    });
  }
});

// POST crear nuevo emprendimiento
router.post('/', async (req, res) => {
  try {
    const venture = await Venture.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Emprendimiento creado exitosamente',
      data: venture,
    });
  } catch (error) {
    console.error('Error al crear emprendimiento:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear emprendimiento',
      error: error.message,
    });
  }
});

// PUT actualizar emprendimiento
router.put('/:id', async (req, res) => {
  try {
    const venture = await Venture.findByPk(req.params.id);

    if (!venture) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    await venture.update(req.body);

    res.json({
      success: true,
      message: 'Emprendimiento actualizado exitosamente',
      data: venture,
    });
  } catch (error) {
    console.error('Error al actualizar emprendimiento:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar emprendimiento',
      error: error.message,
    });
  }
});

// DELETE eliminar emprendimiento
router.delete('/:id', async (req, res) => {
  try {
    const venture = await Venture.findByPk(req.params.id);

    if (!venture) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    await venture.destroy();

    res.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar emprendimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar emprendimiento',
      error: error.message,
    });
  }
});

export default router;
