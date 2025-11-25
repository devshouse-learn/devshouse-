import express from 'express';
import Agreement from '../models/Agreement.sequelize.js';
import Venture from '../models/Venture.sequelize.js';
import Job from '../models/Job.sequelize.js';
import Reaction from '../models/Reaction.sequelize.js';

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
    const [agreements, ventures, jobs] = await Promise.all([
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

    // Obtener detalles de denuncias para cada recurso
    const agreementsWithReports = await Promise.all(
      agreements.map(async (agreement) => {
        const reports = await Reaction.findAll({
          where: {
            resourceType: 'agreement',
            resourceId: agreement.id,
            reactionType: 'report',
          },
          order: [['created_at', 'DESC']],
        });
        return {
          ...agreement.toJSON(),
          resourceType: 'agreement',
          reportDetails: reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          })),
        };
      })
    );

    const venturesWithReports = await Promise.all(
      ventures.map(async (venture) => {
        const reports = await Reaction.findAll({
          where: {
            resourceType: 'venture',
            resourceId: venture.id,
            reactionType: 'report',
          },
          order: [['created_at', 'DESC']],
        });
        return {
          ...venture.toJSON(),
          resourceType: 'venture',
          reportDetails: reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          })),
        };
      })
    );

    const jobsWithReports = await Promise.all(
      jobs.map(async (job) => {
        const reports = await Reaction.findAll({
          where: {
            resourceType: 'job',
            resourceId: job.id,
            reactionType: 'report',
          },
          order: [['created_at', 'DESC']],
        });
        return {
          ...job.toJSON(),
          resourceType: 'job',
          reportDetails: reports.map((r) => ({
            userId: r.userId,
            reason: r.reportReason,
            createdAt: r.createdAt,
          })),
        };
      })
    );

    const allPending = [
      ...agreementsWithReports,
      ...venturesWithReports,
      ...jobsWithReports,
    ].sort((a, b) => b.reports - a.reports);

    res.json({
      success: true,
      count: allPending.length,
      data: allPending,
      summary: {
        agreements: agreementsWithReports.length,
        ventures: venturesWithReports.length,
        jobs: jobsWithReports.length,
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
    const [
      totalReports,
      agreementsUnderReview,
      venturesUnderReview,
      jobsUnderReview,
    ] = await Promise.all([
      Reaction.count({ where: { reactionType: 'report' } }),
      Agreement.count({ where: { underReview: true } }),
      Venture.count({ where: { underReview: true } }),
      Job.count({ where: { underReview: true } }),
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        itemsUnderReview: {
          agreements: agreementsUnderReview,
          ventures: venturesUnderReview,
          jobs: jobsUnderReview,
          total: agreementsUnderReview + venturesUnderReview + jobsUnderReview,
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

export default router;
