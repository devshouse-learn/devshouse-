import express from 'express';
import Candidate from '../models/Candidate.sequelize.js';

const router = express.Router();

// GET /api/candidates - Obtener todos los candidatos
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      where: { status: 'active' },
    });

    res.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidates',
      error: error.message,
    });
  }
});

// GET /api/candidates/:id - Obtener candidato por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado',
      });
    }

    res.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate',
      error: error.message,
    });
  }
});

// POST /api/candidates - Crear nuevo candidato (hoja de vida) o actualizar si ya existe
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      bio,
      avatar,
      resume,
      technologies,
      experience,
      education,
      portfolio,
      linkedIn,
      github,
      twitter,
      website,
      availability,
      createdBy,
    } = req.body;

    // Validar campos requeridos
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Verificar si el email ya existe
    const existingCandidate = await Candidate.findOne({ where: { email } });
    
    const candidateData = {
      name,
      email,
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      avatar: avatar || null,
      resume: resume || null,
      technologies: technologies || [],
      experience: experience || [],
      education: education || [],
      portfolio: portfolio || null,
      linkedIn: linkedIn || null,
      github: github || null,
      twitter: twitter || null,
      website: website || null,
      availability: availability || 'disponible',
      status: 'active', // Permitir que se muestre inmediatamente
    };

    let candidate;
    let isCreated = false;

    if (existingCandidate) {
      // Actualizar candidato existente
      await existingCandidate.update(candidateData);
      candidate = existingCandidate;
    } else {
      // Crear nuevo candidato
      candidate = await Candidate.create({
        ...candidateData,
        createdBy: createdBy || 1,
      });
      isCreated = true;
    }

    res.status(isCreated ? 201 : 200).json({
      success: true,
      message: isCreated ? 'Candidato creado exitosamente' : 'Candidato actualizado exitosamente',
      data: candidate,
    });
  } catch (error) {
    console.error('Error creating/updating candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating candidate',
      error: error.message,
    });
  }
});

// PUT /api/candidates/:id - Actualizar candidato
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado',
      });
    }

    // Actualizar campos permitidos
    const allowedFields = [
      'name',
      'phone',
      'location',
      'bio',
      'avatar',
      'resume',
      'technologies',
      'experience',
      'education',
      'portfolio',
      'linkedIn',
      'github',
      'twitter',
      'website',
      'availability',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        candidate[field] = req.body[field];
      }
    }

    await candidate.save();

    res.json({
      success: true,
      message: 'Candidato actualizado exitosamente',
      data: candidate,
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating candidate',
      error: error.message,
    });
  }
});

// DELETE /api/candidates/:id - Eliminar candidato
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado',
      });
    }

    await candidate.destroy();

    res.json({
      success: true,
      message: 'Candidato eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting candidate',
      error: error.message,
    });
  }
});

export default router;
