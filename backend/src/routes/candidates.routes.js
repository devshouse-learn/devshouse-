import express from 'express';
import { filterMockCandidates, getMockCandidate, mockCandidates } from '../mocks/candidates.mock.js';

const router = express.Router();

// GET /api/candidates - Obtener todos los candidatos
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 50 } = req.query;
    
    let candidates = mockCandidates;
    
    if (status) {
      candidates = candidates.filter(c => c.status === status);
    }
    
    if (limit) {
      candidates = candidates.slice(0, parseInt(limit));
    }

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
    const candidate = getMockCandidate(id);

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

// POST /api/candidates - Crear nuevo candidato (hoja de vida)
router.post('/', async (req, res) => {
  try {
    // Aceptar ambos formatos: campos del backend y del frontend
    const {
      // Formato frontend
      name,
      profession,
      email,
      phone,
      location,
      experience,
      skills,
      bio,
      // Formato backend
      full_name,
      professional_title,
      professional_summary,
      years_experience,
      languages,
      job_type_preference,
      remote_preference,
      salary_expectation_min,
      salary_expectation_max,
      currency,
      availability,
      linkedin_url,
      portfolio_url,
      technologies,
      resume,
      createdBy,
    } = req.body;

    // Usar valores del frontend si existen, sino del backend
    const candidateName = name || full_name;
    const candidateEmail = email;
    const candidatePhone = phone || '';
    const candidateLocation = location || '';
    const candidateTitle = profession || professional_title || '';
    const candidateSummary = bio || professional_summary || '';
    const candidateExperience = experience || resume || '';
    const candidateSkills = skills || technologies || [];
    const candidateAvailability = availability || 'Disponible';

    // Validar campos requeridos
    if (!candidateName || !candidateEmail) {
      return res.status(400).json({
        success: false,
        message: 'Full name and email are required',
      });
    }

    // Verificar si el email ya existe
    const existingCandidate = mockCandidates.find(c => c.email === candidateEmail);
    
    const candidateData = {
      id: mockCandidates.length + 1,
      name: candidateName,
      full_name: candidateName,
      profession: candidateTitle,
      professional_title: candidateTitle,
      email: candidateEmail,
      phone: candidatePhone,
      professional_summary: candidateSummary,
      bio: candidateSummary,
      location: candidateLocation,
      years_experience: years_experience || 0,
      experience: candidateExperience,
      resume: candidateExperience,
      skills: Array.isArray(candidateSkills) ? candidateSkills : (typeof candidateSkills === 'string' ? candidateSkills.split(',').map(s => s.trim()) : []),
      technologies: Array.isArray(candidateSkills) ? candidateSkills : (typeof candidateSkills === 'string' ? candidateSkills.split(',').map(s => s.trim()) : []),
      languages: languages || [],
      job_type_preference: job_type_preference || '',
      remote_preference: remote_preference || '',
      salary_expectation_min: salary_expectation_min || 0,
      salary_expectation_max: salary_expectation_max || 0,
      currency: currency || 'USD',
      availability: candidateAvailability,
      linkedin_url: linkedin_url || '',
      portfolio_url: portfolio_url || '',
      status: 'active',
      views: 0,
      likes: 0,
      reports: 0,
      under_review: false,
      show_in_search: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: createdBy || null,
    };

    if (existingCandidate) {
      // Actualizar candidato existente
      const index = mockCandidates.findIndex(c => c.email === candidateEmail);
      const updated = {
        ...existingCandidate,
        ...candidateData,
        updated_at: new Date(),
      };
      mockCandidates[index] = updated;

      res.json({
        success: true,
        message: 'Candidato actualizado exitosamente',
        data: updated,
      });
    } else {
      // Crear nuevo candidato
      mockCandidates.push(candidateData);

      res.status(201).json({
        success: true,
        message: 'Candidato creado exitosamente',
        data: candidateData,
      });
    }
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
    const candidate = getMockCandidate(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado',
      });
    }

    const updated = {
      ...candidate,
      ...req.body,
      updated_at: new Date(),
    };

    const index = mockCandidates.findIndex(c => c.id === parseInt(id));
    mockCandidates[index] = updated;

    res.json({
      success: true,
      message: 'Candidato actualizado exitosamente',
      data: updated,
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
    const index = mockCandidates.findIndex(c => c.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Candidato no encontrado',
      });
    }

    const deleted = mockCandidates.splice(index, 1);

    res.json({
      success: true,
      message: 'Candidato eliminado exitosamente',
      data: deleted[0],
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
