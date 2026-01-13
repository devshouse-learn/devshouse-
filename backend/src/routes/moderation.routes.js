import express from 'express';
import Agreement from '../models/Agreement.sequelize.js';
import Venture from '../models/Venture.sequelize.js';
import Job from '../models/Job.sequelize.js';
import Reaction from '../models/Reaction.sequelize.js';
import { mockCandidates } from '../mocks/candidates.mock.js';
import { mockAgreements } from '../mocks/agreements.mock.js';
import { mockVentures } from '../mocks/ventures.mock.js';
import { mockJobs } from '../mocks/jobs.mock.js';

const router = express.Router();

// Función para obtener el modelo según el tipo
const getModel = (resourceType) => {
  switch (resourceType) {
    case 'agreement':
      return Agreement;
    case 'venture':
      return Venture;
    case 'job':
      return Job;
    default:
      return null;
  }
};

// GET - Obtener todos los recursos en revisión (underReview = true)
router.get('/pending', async (req, res) => {
  try {
    let agreements = [];
    let ventures = [];
    let jobs = [];

    // Intentar obtener de Sequelize, si falla usar mocks
    try {
      [agreements, ventures, jobs] = await Promise.all([
        Agreement.findAll({
          where: { underReview: true },
          order: [['reports', 'DESC']],
        }),
        Venture.findAll({
          where: { underReview: true },
          order: [['reports', 'DESC']],
        }),
        Job.findAll({
          where: { underReview: true },
          order: [['reports', 'DESC']],
        }),
      ]);
    } catch (dbError) {
      console.log('⚠️  Usando mocks - Base de datos no disponible');
      // Usar mocks cuando Sequelize falla
      agreements = mockAgreements.filter(a => a.under_review === true).sort((a, b) => b.reports - a.reports);
      ventures = mockVentures.filter(v => v.under_review === true).sort((a, b) => b.reports - a.reports);
      jobs = mockJobs.filter(j => j.under_review === true).sort((a, b) => b.reports - a.reports);
    }

    // Obtener candidatos en revisión desde mocks
    const candidates = mockCandidates.filter(c => c.under_review === true).sort((a, b) => b.reports - a.reports);
    console.log(`📊 Items en revisión:`, {
      agreements: agreements.length,
      ventures: ventures.length,
      jobs: jobs.length,
      candidates: candidates.length,
    });

    // Obtener detalles de denuncias para cada recurso
    const agreementsWithReports = await Promise.all(
      agreements.map(async (agreement) => {
        let reportDetails = [];
        try {
          const reports = await Reaction.findAll({
            where: {
              resourceType: 'agreement',
              resourceId: agreement.id,
              reactionType: 'report',
            },
            order: [['created_at', 'DESC']],
          });
          reportDetails = reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          }));
        } catch (e) {
          // Si falla, dejar reportDetails vacío
        }
        return {
          ...(agreement.toJSON ? agreement.toJSON() : agreement),
          resourceType: 'agreement',
          reportDetails,
        };
      })
    );

    const venturesWithReports = await Promise.all(
      ventures.map(async (venture) => {
        let reportDetails = [];
        try {
          const reports = await Reaction.findAll({
            where: {
              resourceType: 'venture',
              resourceId: venture.id,
              reactionType: 'report',
            },
            order: [['created_at', 'DESC']],
          });
          reportDetails = reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          }));
        } catch (e) {
          // Si falla, dejar reportDetails vacío
        }
        return {
          ...(venture.toJSON ? venture.toJSON() : venture),
          resourceType: 'venture',
          reportDetails,
        };
      })
    );

    const jobsWithReports = await Promise.all(
      jobs.map(async (job) => {
        let reportDetails = [];
        try {
          const reports = await Reaction.findAll({
            where: {
              resourceType: 'job',
              resourceId: job.id,
              reactionType: 'report',
            },
            order: [['created_at', 'DESC']],
          });
          reportDetails = reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          }));
        } catch (e) {
          // Si falla, dejar reportDetails vacío
        }
        return {
          ...(job.toJSON ? job.toJSON() : job),
          resourceType: 'job',
          reportDetails,
        };
      })
    );

    // Procesar candidatos (desde mocks)
    const candidatesWithReports = candidates.map((candidate) => {
      return {
        ...candidate,
        resourceType: 'candidate',
        reportDetails: [], // Los mocks no tienen detalles de reportes individuales
      };
    });

    const allPending = [
      ...agreementsWithReports,
      ...venturesWithReports,
      ...jobsWithReports,
      ...candidatesWithReports,
    ].sort((a, b) => b.reports - a.reports);

    res.json({
      success: true,
      count: allPending.length,
      data: allPending,
      summary: {
        agreements: agreementsWithReports.length,
        ventures: venturesWithReports.length,
        jobs: jobsWithReports.length,
        candidates: candidatesWithReports.length,
        total: allPending.length,
      },
    });
  } catch (error) {
    console.error('Error al obtener recursos en revisión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener recursos en revisión',
      error: error.message,
    });
  }
});

// POST - Aprobar un recurso (quitar de revisión)
router.post('/approve', async (req, res) => {
  try {
    const { resourceType, resourceId } = req.body;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: resourceType, resourceId',
      });
    }

    const Model = getModel(resourceType);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de recurso inválido',
      });
    }

    const resource = await Model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Quitar de revisión y resetear denuncias
    await resource.update({
      underReview: false,
      reports: 0,
    });

    // Eliminar todas las denuncias de este recurso
    await Reaction.destroy({
      where: {
        resourceType,
        resourceId,
        reactionType: 'report',
      },
    });

    res.json({
      success: true,
      message: 'Recurso aprobado',
      data: resource,
    });
  } catch (error) {
    console.error('Error al aprobar recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar recurso',
      error: error.message,
    });
  }
});

// DELETE - Eliminar un recurso denunciado
router.delete('/delete', async (req, res) => {
  try {
    const { resourceType, resourceId } = req.body;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: resourceType, resourceId',
      });
    }

    const Model = getModel(resourceType);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de recurso inválido',
      });
    }

    const resource = await Model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Eliminar todas las reacciones asociadas
    await Reaction.destroy({
      where: {
        resourceType,
        resourceId,
      },
    });

    // Eliminar el recurso
    await resource.destroy();

    res.json({
      success: true,
      message: 'Recurso eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar recurso',
      error: error.message,
    });
  }
});

// GET - Obtener estadísticas de moderación
router.get('/stats', async (req, res) => {
  try {
    let totalReports = 0;
    let agreementsUnderReview = 0;
    let venturesUnderReview = 0;
    let jobsUnderReview = 0;

    // Intentar obtener de Sequelize, si falla usar mocks
    try {
      const results = await Promise.all([
        Reaction.count({ where: { reactionType: 'report' } }),
        Agreement.count({ where: { underReview: true } }),
        Venture.count({ where: { underReview: true } }),
        Job.count({ where: { underReview: true } }),
      ]);
      [totalReports, agreementsUnderReview, venturesUnderReview, jobsUnderReview] = results;
    } catch (dbError) {
      console.log('⚠️  Usando mocks - Base de datos no disponible');
      // Usar mocks cuando Sequelize falla
      agreementsUnderReview = mockAgreements.filter(a => a.under_review === true).length;
      venturesUnderReview = mockVentures.filter(v => v.under_review === true).length;
      jobsUnderReview = mockJobs.filter(j => j.under_review === true).length;
    }

    // Contar candidatos en revisión desde mocks
    const candidatesUnderReview = mockCandidates.filter(c => c.under_review === true).length;

    res.json({
      success: true,
      data: {
        totalReports,
        itemsUnderReview: {
          agreements: agreementsUnderReview,
          ventures: venturesUnderReview,
          jobs: jobsUnderReview,
          candidates: candidatesUnderReview,
          total: agreementsUnderReview + venturesUnderReview + jobsUnderReview + candidatesUnderReview,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    });
  }
});

// GET - Obtener estado de revisión de un recurso
router.get('/status/:resourceType/:resourceId', async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    if (resourceType === 'candidate') {
      const candidate = mockCandidates.find(c => c.id === parseInt(resourceId));
      if (candidate) {
        return res.json({
          success: true,
          data: {
            underReview: candidate.under_review,
            reports: candidate.reports,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
    }

    const Model = getModel(resourceType);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de recurso no válido',
      });
    }

    const resource = await Model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    res.json({
      success: true,
      data: {
        underReview: resource.underReview || false,
        reports: resource.reports || 0,
      },
    });
  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado',
      error: error.message,
    });
  }
});

export default router;
