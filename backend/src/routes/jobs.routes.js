import express from 'express';
import { Op } from 'sequelize';
import Job from '../models/Job.sequelize.js';

const router = express.Router();

// GET todos los empleos
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      jobType, 
      experience, 
      industry,
      location,
      limit = 50 
    } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (jobType) where.jobType = jobType;
    if (experience) where.experience = experience;
    if (industry) where.industry = industry;
    if (location) where.location = { [Op.iLike]: `%${location}%` };

    const jobs = await Job.findAll({
      where,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
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
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    // Incrementar vistas
    await job.increment('views');

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
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Empleo creado exitosamente',
      data: job,
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
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    await job.update(req.body);

    res.json({
      success: true,
      message: 'Empleo actualizado exitosamente',
      data: job,
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
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Empleo eliminado exitosamente',
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
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Empleo no encontrado',
      });
    }

    await job.increment('applicants');

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
