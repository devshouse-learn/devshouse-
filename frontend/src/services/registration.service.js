import apiService from './api.service';

// Función auxiliar para obtener el usuario actual
const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = parseInt(user.id, 10) || 1;
  return userId;
};

// Función auxiliar para verificar reacciones de un usuario
const getUserReactions = async (resourceType, resourceId) => {
  try {
    const userId = getCurrentUserId();
    const response = await apiService.get(`/reactions/user/${userId}/${resourceType}/${resourceId}`);
    return response.data || { hasLiked: false, hasReported: false };
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return { hasLiked: false, hasReported: false };
  }
};

// Factory function para crear servicios de recursos
const createResourceService = (endpoint, resourceType) => ({
  create: (data) => apiService.post(endpoint, data),
  getAll: () => apiService.get(endpoint),
  getById: (id) => apiService.get(`${endpoint}/${id}`),
  delete: (id) => apiService.delete(`${endpoint}/${id}`),
  like: (id) => apiService.post('/reactions/like', { 
    userId: getCurrentUserId(), 
    resourceType, 
    resourceId: id, 
    reactionType: 'like' 
  }),
  report: (id, reason) => apiService.post('/reactions/report', { 
    userId: getCurrentUserId(), 
    resourceType, 
    resourceId: id, 
    reactionType: 'report', 
    reportReason: reason 
  }),
  getUserReactions: (id) => getUserReactions(resourceType, id),
});

export const agreementsService = createResourceService('/agreements', 'agreement');
export const venturesService = createResourceService('/ventures', 'venture');
export const jobsService = createResourceService('/jobs', 'job');
export const candidatesService = createResourceService('/candidates', 'candidate');
