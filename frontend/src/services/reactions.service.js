import apiService from './api.service';

export const reactionsService = {
  // Dar like a un recurso
  like: async (userId, resourceType, resourceId) => {
    return await apiService.post('/reactions/like', {
      userId,
      resourceType,
      resourceId,
    });
  },

  // Denunciar un recurso
  report: async (userId, resourceType, resourceId, reportReason) => {
    return await apiService.post('/reactions/report', {
      userId,
      resourceType,
      resourceId,
      reportReason,
    });
  },

  // Obtener reacciones de un usuario para un recurso
  getUserReactions: async (userId, resourceType, resourceId) => {
    return await apiService.get(
      `/reactions/user/${userId}/${resourceType}/${resourceId}`
    );
  },

  // Obtener estadísticas de reacciones
  getStats: async (resourceType, resourceId) => {
    return await apiService.get(`/reactions/stats/${resourceType}/${resourceId}`);
  },
};

export const moderationService = {
  // Obtener recursos en revisión
  getPending: async () => {
    return await apiService.get('/moderation/pending');
  },

  // Aprobar un recurso
  approve: async (resourceType, resourceId) => {
    return await apiService.post('/moderation/approve', {
      resourceType,
      resourceId,
    });
  },

  // Eliminar un recurso
  delete: async (resourceType, resourceId) => {
    return await apiService.delete('/moderation/delete', {
      resourceType,
      resourceId,
    });
  },

  // Obtener estadísticas de moderación
  getStats: async () => {
    return await apiService.get('/moderation/stats');
  },
};
