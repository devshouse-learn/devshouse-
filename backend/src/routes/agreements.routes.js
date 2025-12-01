import express from 'express';
import { filterMockAgreements, getMockAgreement, mockAgreements } from '../mocks/agreements.mock.js';

const router = express.Router();

// GET todos los convenios
router.get('/', async (req, res) => {
  try {
    const { status, agreementType, schoolLevel, limit = 50 } = req.query;
    
    const agreements = filterMockAgreements({
      status,
      agreementType,
      schoolLevel,
      limit,
    });

    // Mapear campos de snake_case a camelCase para el frontend
    const mappedAgreements = agreements.map(agreement => ({
      id: agreement.id,
      schoolName: agreement.school_name,
      schoolType: agreement.school_level,
      contactEmail: agreement.school_contact,
      contactPhone: agreement.school_phone,
      location: agreement.school_location,
      description: agreement.description,
      views: agreement.views,
      likes: agreement.likes,
      reports: agreement.reports,
      status: agreement.status,
      createdBy: agreement.created_by,
      createdAt: agreement.created_at,
      updatedAt: agreement.updated_at,
      // Mantener todos los campos originales también
      ...agreement,
    }));

    res.json({
      success: true,
      count: mappedAgreements.length,
      data: mappedAgreements,
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
    const agreement = getMockAgreement(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    // Incrementar vistas (solo en memoria)
    agreement.views += 1;

    // Mapear campos de snake_case a camelCase
    const mappedAgreement = {
      id: agreement.id,
      schoolName: agreement.school_name,
      schoolType: agreement.school_level,
      contactEmail: agreement.school_contact,
      contactPhone: agreement.school_phone,
      location: agreement.school_location,
      description: agreement.description,
      views: agreement.views,
      likes: agreement.likes,
      reports: agreement.reports,
      status: agreement.status,
      createdBy: agreement.created_by,
      createdAt: agreement.created_at,
      updatedAt: agreement.updated_at,
      // Mantener todos los campos originales también
      ...agreement,
    };

    res.json({
      success: true,
      data: mappedAgreement,
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
    const newAgreement = {
      id: mockAgreements.length + 1,
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

    mockAgreements.push(newAgreement);

    res.status(201).json({
      success: true,
      message: 'Convenio creado exitosamente',
      data: newAgreement,
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
    const agreement = getMockAgreement(req.params.id);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    const updated = {
      ...agreement,
      ...req.body,
      updated_at: new Date(),
    };

    const index = mockAgreements.findIndex(a => a.id === parseInt(req.params.id));
    mockAgreements[index] = updated;

    res.json({
      success: true,
      message: 'Convenio actualizado exitosamente',
      data: updated,
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
    const index = mockAgreements.findIndex(a => a.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Convenio no encontrado',
      });
    }

    const deleted = mockAgreements.splice(index, 1);

    res.json({
      success: true,
      message: 'Convenio eliminado exitosamente',
      data: deleted[0],
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
