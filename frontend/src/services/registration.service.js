import apiService from './api.service';

export const agreementsService = {
  create: (data) => apiService.post('/agreements', data),
  getAll: () => apiService.get('/agreements'),
  getById: (id) => apiService.get(`/agreements/${id}`),
};

export const venturesService = {
  create: (data) => apiService.post('/ventures', data),
  getAll: () => apiService.get('/ventures'),
  getById: (id) => apiService.get(`/ventures/${id}`),
};

export const jobsService = {
  create: (data) => apiService.post('/jobs', data),
  getAll: () => apiService.get('/jobs'),
  getById: (id) => apiService.get(`/jobs/${id}`),
};

export const candidatesService = {
  create: (data) => apiService.post('/candidates', data),
  getAll: () => apiService.get('/candidates'),
  getById: (id) => apiService.get(`/candidates/${id}`),
};
