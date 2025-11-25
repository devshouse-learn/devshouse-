// Servicio centralizado para almacenar datos de formularios en localStorage

const STORAGE_KEYS = {
  AGREEMENTS: 'devshouse_agreements',
  VENTURES: 'devshouse_ventures',
  JOBS: 'devshouse_jobs',
  JOB_APPLICATIONS: 'devshouse_job_applications',
  USERS: 'devshouse_registered_users',
};

// Helper para obtener datos de localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error al obtener datos de ${key}:`, error);
    return [];
  }
};

// Helper para guardar datos en localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error al guardar datos en ${key}:`, error);
    return false;
  }
};

// ============ CONVENIOS EDUCATIVOS ============
export const agreementsStorage = {
  // Obtener todos los convenios
  getAll: () => {
    return getFromStorage(STORAGE_KEYS.AGREEMENTS);
  },

  // Obtener convenio por ID
  getById: (id) => {
    const agreements = getFromStorage(STORAGE_KEYS.AGREEMENTS);
    return agreements.find(agreement => agreement.id === id);
  },

  // Crear nuevo convenio
  create: (agreementData) => {
    const agreements = getFromStorage(STORAGE_KEYS.AGREEMENTS);
    const newAgreement = {
      id: Date.now().toString(),
      ...agreementData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    agreements.push(newAgreement);
    saveToStorage(STORAGE_KEYS.AGREEMENTS, agreements);
    return newAgreement;
  },

  // Actualizar convenio
  update: (id, agreementData) => {
    const agreements = getFromStorage(STORAGE_KEYS.AGREEMENTS);
    const index = agreements.findIndex(agreement => agreement.id === id);
    if (index !== -1) {
      agreements[index] = {
        ...agreements[index],
        ...agreementData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.AGREEMENTS, agreements);
      return agreements[index];
    }
    return null;
  },

  // Eliminar convenio
  delete: (id) => {
    const agreements = getFromStorage(STORAGE_KEYS.AGREEMENTS);
    const filtered = agreements.filter(agreement => agreement.id !== id);
    saveToStorage(STORAGE_KEYS.AGREEMENTS, filtered);
    return true;
  },

  // Buscar convenios
  search: (filters) => {
    const agreements = getFromStorage(STORAGE_KEYS.AGREEMENTS);
    return agreements.filter(agreement => {
      if (filters.schoolType && agreement.schoolType !== filters.schoolType) return false;
      if (filters.location && !agreement.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.status && agreement.status !== filters.status) return false;
      return true;
    });
  },
};

// ============ EMPRENDIMIENTOS ============
export const venturesStorage = {
  getAll: () => {
    return getFromStorage(STORAGE_KEYS.VENTURES);
  },

  getById: (id) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    return ventures.find(venture => venture.id === id);
  },

  create: (ventureData) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    const newVenture = {
      id: Date.now().toString(),
      ...ventureData,
      status: 'active',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ventures.push(newVenture);
    saveToStorage(STORAGE_KEYS.VENTURES, ventures);
    return newVenture;
  },

  update: (id, ventureData) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    const index = ventures.findIndex(venture => venture.id === id);
    if (index !== -1) {
      ventures[index] = {
        ...ventures[index],
        ...ventureData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.VENTURES, ventures);
      return ventures[index];
    }
    return null;
  },

  delete: (id) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    const filtered = ventures.filter(venture => venture.id !== id);
    saveToStorage(STORAGE_KEYS.VENTURES, filtered);
    return true;
  },

  search: (filters) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    return ventures.filter(venture => {
      if (filters.category && venture.category !== filters.category) return false;
      if (filters.fundingStage && venture.fundingStage !== filters.fundingStage) return false;
      if (filters.status && venture.status !== filters.status) return false;
      return true;
    });
  },

  // Incrementar vistas
  incrementViews: (id) => {
    const ventures = getFromStorage(STORAGE_KEYS.VENTURES);
    const index = ventures.findIndex(venture => venture.id === id);
    if (index !== -1) {
      ventures[index].views = (ventures[index].views || 0) + 1;
      saveToStorage(STORAGE_KEYS.VENTURES, ventures);
      return ventures[index];
    }
    return null;
  },
};

// ============ EMPLEOS ============
export const jobsStorage = {
  getAll: () => {
    return getFromStorage(STORAGE_KEYS.JOBS);
  },

  getById: (id) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    return jobs.find(job => job.id === id);
  },

  create: (jobData) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      status: 'active',
      applicants: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: jobData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días por defecto
    };
    jobs.push(newJob);
    saveToStorage(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },

  update: (id, jobData) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      jobs[index] = {
        ...jobs[index],
        ...jobData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.JOBS, jobs);
      return jobs[index];
    }
    return null;
  },

  delete: (id) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    const filtered = jobs.filter(job => job.id !== id);
    saveToStorage(STORAGE_KEYS.JOBS, filtered);
    return true;
  },

  search: (filters) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    return jobs.filter(job => {
      if (filters.jobType && job.jobType !== filters.jobType) return false;
      if (filters.workMode && job.workMode !== filters.workMode) return false;
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.status && job.status !== filters.status) return false;
      if (filters.salaryMin && job.salaryMin < filters.salaryMin) return false;
      if (filters.salaryMax && job.salaryMax > filters.salaryMax) return false;
      return true;
    });
  },

  // Incrementar contador de aplicantes
  incrementApplicants: (id) => {
    const jobs = getFromStorage(STORAGE_KEYS.JOBS);
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      jobs[index].applicants = (jobs[index].applicants || 0) + 1;
      saveToStorage(STORAGE_KEYS.JOBS, jobs);
      return jobs[index];
    }
    return null;
  },
};

// ============ APLICACIONES A EMPLEOS ============
export const jobApplicationsStorage = {
  getAll: () => {
    return getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
  },

  getByJobId: (jobId) => {
    const applications = getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
    return applications.filter(app => app.jobId === jobId);
  },

  getByUserId: (userId) => {
    const applications = getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
    return applications.filter(app => app.userId === userId);
  },

  create: (applicationData) => {
    const applications = getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
    const newApplication = {
      id: Date.now().toString(),
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    applications.push(newApplication);
    saveToStorage(STORAGE_KEYS.JOB_APPLICATIONS, applications);
    
    // Incrementar contador de aplicantes en el empleo
    jobsStorage.incrementApplicants(applicationData.jobId);
    
    return newApplication;
  },

  update: (id, applicationData) => {
    const applications = getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...applicationData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.JOB_APPLICATIONS, applications);
      return applications[index];
    }
    return null;
  },

  delete: (id) => {
    const applications = getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS);
    const filtered = applications.filter(app => app.id !== id);
    saveToStorage(STORAGE_KEYS.JOB_APPLICATIONS, filtered);
    return true;
  },
};

// ============ UTILIDADES ============
export const storageUtils = {
  // Limpiar todos los datos
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  },

  // Exportar todos los datos
  exportAll: () => {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data[name] = getFromStorage(key);
    });
    return data;
  },

  // Importar datos
  importAll: (data) => {
    Object.entries(data).forEach(([name, items]) => {
      const key = STORAGE_KEYS[name];
      if (key) {
        saveToStorage(key, items);
      }
    });
    return true;
  },

  // Obtener estadísticas
  getStats: () => {
    return {
      agreements: getFromStorage(STORAGE_KEYS.AGREEMENTS).length,
      ventures: getFromStorage(STORAGE_KEYS.VENTURES).length,
      jobs: getFromStorage(STORAGE_KEYS.JOBS).length,
      applications: getFromStorage(STORAGE_KEYS.JOB_APPLICATIONS).length,
      users: getFromStorage(STORAGE_KEYS.USERS).length,
    };
  },
};

export default {
  agreements: agreementsStorage,
  ventures: venturesStorage,
  jobs: jobsStorage,
  jobApplications: jobApplicationsStorage,
  utils: storageUtils,
};
