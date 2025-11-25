import apiService from './api.service';

// Función auxiliar para obtener el usuario actual (simulado por ahora)
const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Convertir a número, usar 1 como default si no es válido
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

export const agreementsService = {
  create: (data) => apiService.post('/agreements', data),
  getAll: () => apiService.get('/agreements'),
  getById: (id) => apiService.get(`/agreements/${id}`),
  like: (id) => apiService.post(`/reactions/like`, { userId: getCurrentUserId(), resourceType: 'agreement', resourceId: id, reactionType: 'like' }),
  report: (id, reason) => apiService.post(`/reactions/report`, { userId: getCurrentUserId(), resourceType: 'agreement', resourceId: id, reactionType: 'report', reportReason: reason }),
  getUserReactions: (id) => getUserReactions('agreement', id),
};

export const venturesService = {
  create: (data) => apiService.post('/ventures', data),
  getAll: () => apiService.get('/ventures'),
  getById: (id) => apiService.get(`/ventures/${id}`),
  like: (id) => apiService.post(`/reactions/like`, { userId: getCurrentUserId(), resourceType: 'venture', resourceId: id, reactionType: 'like' }),
  report: (id, reason) => apiService.post(`/reactions/report`, { userId: getCurrentUserId(), resourceType: 'venture', resourceId: id, reactionType: 'report', reportReason: reason }),
  getUserReactions: (id) => getUserReactions('venture', id),
};

export const jobsService = {
  create: (data) => apiService.post('/jobs', data),
  getAll: () => apiService.get('/jobs'),
  getById: (id) => apiService.get(`/jobs/${id}`),
  like: (id) => apiService.post(`/reactions/like`, { userId: getCurrentUserId(), resourceType: 'job', resourceId: id, reactionType: 'like' }),
  report: (id, reason) => apiService.post(`/reactions/report`, { userId: getCurrentUserId(), resourceType: 'job', resourceId: id, reactionType: 'report', reportReason: reason }),
  getUserReactions: (id) => getUserReactions('job', id),
};

export const candidatesService = {
  create: (data) => apiService.post('/candidates', data),
  getAll: () => apiService.get('/candidates'),
  getById: (id) => apiService.get(`/candidates/${id}`),
  like: (id) => apiService.post(`/reactions/like`, { userId: getCurrentUserId(), resourceType: 'candidate', resourceId: id, reactionType: 'like' }),
  report: (id, reason) => apiService.post(`/reactions/report`, { userId: getCurrentUserId(), resourceType: 'candidate', resourceId: id, reactionType: 'report', reportReason: reason }),
  getUserReactions: (id) => getUserReactions('candidate', id),
};
