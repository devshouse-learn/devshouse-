import express from 'express';
import { filterMockJobs, getMockJob, mockJobs } from '../mocks/jobs.mock.js';

const router = express.Router();

// GET todos los empleos
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      jobType, 
      experienceLevel, 
      jobCategory,
      location,
      remote,
      limit = 50 
    } = req.query;
    
    const jobs = filterMockJobs({
      status,
      jobType,
      experienceLevel,
      jobCategory,
      location,
      remote,
      limit,
    });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Error al obtener empleos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleos',
      error: error.message,
    });
  }
});

// GET un empleo por ID
router.get('/:id', async (req, res) => {
  try {
    const job = getMockJob(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    // Incrementar vistas (solo en memoria)
    job.views += 1;

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Error al obtener empleo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener empleo',
      error: error.message,
    });
  }
});

// POST crear nuevo empleo
router.post('/', async (req, res) => {
  try {
    const newJob = {
      id: mockJobs.length + 1,
      ...req.body,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
      views: 0,
      likes: 0,
      reports: 0,
      under_review: false,
      show_in_search: true,
      applications_count: 0,
    };

    mockJobs.push(newJob);

    res.status(201).json({
      success: true,
      message: 'Empleo creado exitosamente',
      data: newJob,
    });
  } catch (error) {
    console.error('Error al crear empleo:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear empleo',
      error: error.message,
    });
  }
});

// PUT actualizar empleo
router.put('/:id', async (req, res) => {
  try {
    const job = getMockJob(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    const updated = {
      ...job,
      ...req.body,
      updated_at: new Date(),
    };

    const index = mockJobs.findIndex(j => j.id === parseInt(req.params.id));
    mockJobs[index] = updated;

    res.json({
      success: true,
      message: 'Empleo actualizado exitosamente',
      data: updated,
    });
  } catch (error) {
    console.error('Error al actualizar empleo:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar empleo',
      error: error.message,
    });
  }
});

// DELETE eliminar empleo
router.delete('/:id', async (req, res) => {
  try {
    const index = mockJobs.findIndex(j => j.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    const deleted = mockJobs.splice(index, 1);

    res.json({
      success: true,
      message: 'Empleo eliminado exitosamente',
      data: deleted[0],
    });
  } catch (error) {
    console.error('Error al eliminar empleo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar empleo',
      error: error.message,
    });
  }
});

// POST incrementar contador de aplicantes
router.post('/:id/apply', async (req, res) => {
  try {
    const job = getMockJob(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    job.applications_count += 1;

    res.json({
      success: true,
      message: 'Aplicación registrada',
      data: job,
    });
  } catch (error) {
    console.error('Error al registrar aplicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar aplicación',
      error: error.message,
    });
  }
});

export default router;
