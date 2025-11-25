import express from 'express';
import Reaction from '../models/Reaction.sequelize.js';
import Agreement from '../models/Agreement.sequelize.js';
import Venture from '../models/Venture.sequelize.js';
import Job from '../models/Job.sequelize.js';

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

// POST - Dar like a un recurso
router.post('/like', async (req, res) => {
  try {
    const { userId, resourceType, resourceId } = req.body;
    const finalUserId = userId || 1; // Usar 1 como default si no viene userId

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

    // Verificar si el recurso existe
    const resource = await Model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Verificar si ya existe el like
    const existingLike = await Reaction.findOne({
      where: {
        userId: finalUserId,
        resourceType,
        resourceId,
        reactionType: 'like',
      },
    });

    if (existingLike) {
      // Si ya existe, eliminar el like (unlike)
      await existingLike.destroy();
      await resource.decrement('likes');

      return res.json({
        success: true,
        message: 'Like eliminado',
        action: 'unliked',
        likes: resource.likes - 1,
      });
    } else {
      // Crear nuevo like
      await Reaction.create({
        userId: finalUserId,
        resourceType,
        resourceId,
        reactionType: 'like',
      });
      await resource.increment('likes');

      return res.json({
        success: true,
        message: 'Like agregado',
        action: 'liked',
        likes: resource.likes + 1,
      });
    }
  } catch (error) {
    console.error('Error al procesar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar like',
      error: error.message,
    });
  }
});

// POST - Denunciar un recurso
router.post('/report', async (req, res) => {
  try {
    const { userId, resourceType, resourceId, reportReason } = req.body;
    const finalUserId = userId || 1; // Usar 1 como default si no viene userId

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

    // Verificar si el recurso existe
    const resource = await Model.findByPk(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Verificar si ya denunció este recurso
    const existingReport = await Reaction.findOne({
      where: {
        userId: finalUserId,
        resourceType,
        resourceId,
        reactionType: 'report',
      },
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'Ya has denunciado este contenido',
      });
    }

    // Crear denuncia
    await Reaction.create({
      userId: finalUserId,
      resourceType,
      resourceId,
      reactionType: 'report',
      reportReason: reportReason || 'Sin razón especificada',
    });

    // Incrementar contador de denuncias
    await resource.increment('reports');

    // Si llega a 30 denuncias, marcar para revisión
    const updatedResource = await Model.findByPk(resourceId);
    if (updatedResource.reports >= 30 && !updatedResource.underReview) {
      await updatedResource.update({ underReview: true });
    }

    res.json({
      success: true,
      message: 'Denuncia registrada',
      reports: updatedResource.reports,
      underReview: updatedResource.underReview,
    });
  } catch (error) {
    console.error('Error al procesar denuncia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar denuncia',
      error: error.message,
    });
  }
});

// GET - Obtener reacciones de un usuario para un recurso
router.get('/user/:userId/:resourceType/:resourceId', async (req, res) => {
  try {
    const { userId, resourceType, resourceId } = req.params;

    const reactions = await Reaction.findAll({
      where: {
        userId,
        resourceType,
        resourceId,
      },
    });

    const hasLiked = reactions.some((r) => r.reactionType === 'like');
    const hasReported = reactions.some((r) => r.reactionType === 'report');

    res.json({
      success: true,
      data: {
        hasLiked,
        hasReported,
        reactions,
      },
    });
  } catch (error) {
    console.error('Error al obtener reacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reacciones',
      error: error.message,
    });
  }
});

// GET - Obtener estadísticas de reacciones de un recurso
router.get('/stats/:resourceType/:resourceId', async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

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

    const reports = await Reaction.findAll({
      where: {
        resourceType,
        resourceId,
        reactionType: 'report',
      },
    });

    res.json({
      success: true,
      data: {
        likes: resource.likes,
        reports: resource.reports,
        underReview: resource.underReview,
        reportDetails: reports.map((r) => ({
          userId: r.userId,
          reason: r.reportReason,
          createdAt: r.createdAt,
        })),
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
