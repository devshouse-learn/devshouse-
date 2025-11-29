import express from 'express';
import { addLike, addReport, getUserReactions, getReactionStats, mockReactions } from '../mocks/reactions.mock.js';
import { incrementAgreementLikes, decrementAgreementLikes, incrementAgreementReports } from '../mocks/agreements.mock.js';
import { incrementVentureLikes, decrementVentureLikes, incrementVentureReports } from '../mocks/ventures.mock.js';
import { incrementJobLikes, decrementJobLikes, incrementJobReports } from '../mocks/jobs.mock.js';
import { incrementCandidateLikes, decrementCandidateLikes, incrementCandidateReports } from '../mocks/candidates.mock.js';

const router = express.Router();

// Función para incrementar likes según tipo de recurso
const incrementResourceLikes = (resourceType, resourceId) => {
  switch (resourceType) {
    case 'agreement':
      return incrementAgreementLikes(resourceId);
    case 'venture':
      return incrementVentureLikes(resourceId);
    case 'job':
      return incrementJobLikes(resourceId);
    case 'candidate':
      return incrementCandidateLikes(resourceId);
    default:
      return null;
  }
};

// Función para decrementar likes según tipo de recurso
const decrementResourceLikes = (resourceType, resourceId) => {
  switch (resourceType) {
    case 'agreement':
      return decrementAgreementLikes(resourceId);
    case 'venture':
      return decrementVentureLikes(resourceId);
    case 'job':
      return decrementJobLikes(resourceId);
    case 'candidate':
      return decrementCandidateLikes(resourceId);
    default:
      return null;
  }
};

// Función para incrementar reports según tipo de recurso
const incrementResourceReports = (resourceType, resourceId) => {
  switch (resourceType) {
    case 'agreement':
      return incrementAgreementReports(resourceId);
    case 'venture':
      return incrementVentureReports(resourceId);
    case 'job':
      return incrementJobReports(resourceId);
    case 'candidate':
      return incrementCandidateReports(resourceId);
    default:
      return null;
  }
};

// POST - Dar like a un recurso
router.post('/like', async (req, res) => {
  try {
    const { userId, resourceType, resourceId } = req.body;
    const finalUserId = userId || 1;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: resourceType, resourceId',
      });
    }

    const result = addLike(finalUserId, resourceType, resourceId);

    if (result.action === 'liked') {
      incrementResourceLikes(resourceType, resourceId);
      return res.json({
        success: true,
        message: 'Like agregado',
        action: 'liked',
      });
    } else {
      decrementResourceLikes(resourceType, resourceId);
      return res.json({
        success: true,
        message: 'Like eliminado',
        action: 'unliked',
      });
    }
  } catch (error) {
    console.error('Error al procesar like:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar like',
      error: error.message || '',
    });
  }
});

// POST - Denunciar un recurso
router.post('/report', async (req, res) => {
  try {
    const { userId, resourceType, resourceId, reportReason } = req.body;
    const finalUserId = userId || 1;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: resourceType, resourceId',
      });
    }

    const result = addReport(finalUserId, resourceType, resourceId, reportReason);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const resource = incrementResourceReports(resourceType, resourceId);

    res.json({
      success: true,
      message: 'Denuncia registrada',
      reports: resource?.reports || 1,
      underReview: resource?.under_review || false,
    });
  } catch (error) {
    console.error('Error al procesar denuncia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar denuncia',
      error: error.message || '',
    });
  }
});

// GET - Obtener reacciones de un usuario para un recurso
router.get('/user/:userId/:resourceType/:resourceId', async (req, res) => {
  try {
    const { userId, resourceType, resourceId } = req.params;

    const reactions = getUserReactions(parseInt(userId), resourceType, resourceId);

    res.json({
      success: true,
      data: reactions,
    });
  } catch (error) {
    console.error('Error al obtener reacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reacciones',
      error: error.message || '',
    });
  }
});

// GET - Obtener estadísticas de reacciones de un recurso
router.get('/stats/:resourceType/:resourceId', async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    const stats = getReactionStats(resourceType, resourceId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message || '',
    });
  }
});

export default router;
