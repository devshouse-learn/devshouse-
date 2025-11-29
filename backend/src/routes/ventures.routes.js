import express from 'express';
import { filterMockVentures, getMockVenture, mockVentures } from '../mocks/ventures.mock.js';

const router = express.Router();

// GET todos los emprendimientos
router.get('/', async (req, res) => {
  try {
    const { status, industry, investmentStage, limit = 50 } = req.query;
    
    const ventures = filterMockVentures({
      status,
      industry,
      investmentStage,
      limit,
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
    const venture = getMockVenture(req.params.id);

    if (!venture) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    // Incrementar vistas (solo en memoria, no persiste)
    venture.views += 1;

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
    const newVenture = {
      id: mockVentures.length + 1,
      ...req.body,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
      views: 0,
      likes: 0,
      reports: 0,
      under_review: false,
      show_in_search: true,
    };

    mockVentures.push(newVenture);

    res.status(201).json({
      success: true,
      message: 'Emprendimiento creado exitosamente',
      data: newVenture,
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
    const venture = getMockVenture(req.params.id);

    if (!venture) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    const updated = {
      ...venture,
      ...req.body,
      updated_at: new Date(),
    };

    const index = mockVentures.findIndex(v => v.id === parseInt(req.params.id));
    mockVentures[index] = updated;

    res.json({
      success: true,
      message: 'Emprendimiento actualizado exitosamente',
      data: updated,
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
    const index = mockVentures.findIndex(v => v.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Emprendimiento no encontrado',
      });
    }

    const deleted = mockVentures.splice(index, 1);

    res.json({
      success: true,
      message: 'Emprendimiento eliminado exitosamente',
      data: deleted[0],
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
