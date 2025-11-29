// Mock data para ofertas de empleo
export const mockJobs = [
  {
    id: 1,
    company_name: 'TechCorp Solutions',
    company_logo: 'https://via.placeholder.com/100?text=TechCorp',
    job_title: 'Senior Frontend Developer',
    job_description: 'Buscamos desarrollador Senior con experiencia en React y Node.js',
    job_category: 'Desarrollo',
    experience_level: 'Senior',
    job_type: 'Tiempo Completo',
    contract_type: 'Indefinido',
    salary_min: 5000,
    salary_max: 7000,
    currency: 'USD',
    location: 'Bogotá, Colombia',
    remote: 'hybrid',
    skills_required: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    education_required: 'Profesional',
    applications_count: 45,
    status: 'active',
    created_by: 1,
    views: 892,
    likes: 67,
    reports: 0,
    under_review: false,
    show_in_search: true,
    deadline: new Date('2024-12-31'),
    created_at: new Date('2024-10-15'),
    updated_at: new Date('2024-11-20'),
  },
  {
    id: 2,
    company_name: 'EcoSolutions Inc',
    company_logo: 'https://via.placeholder.com/100?text=EcoSolutions',
    job_title: 'Environmental Analyst',
    job_description: 'Especialista en análisis ambiental y sostenibilidad empresarial',
    job_category: 'Sostenibilidad',
    experience_level: 'Mid-Level',
    job_type: 'Tiempo Completo',
    contract_type: 'Indefinido',
    salary_min: 2500,
    salary_max: 3500,
    currency: 'USD',
    location: 'Medellín, Colombia',
    remote: 'onsite',
    skills_required: ['Análisis ambiental', 'Reportes', 'Excel', 'Inglés'],
    education_required: 'Profesional',
    applications_count: 12,
    status: 'active',
    created_by: 2,
    views: 345,
    likes: 23,
    reports: 0,
    under_review: false,
    show_in_search: true,
    deadline: new Date('2024-12-15'),
    created_at: new Date('2024-11-01'),
    updated_at: new Date('2024-11-18'),
  },
  {
    id: 3,
    company_name: 'FinTech Global',
    company_logo: 'https://via.placeholder.com/100?text=FinTech',
    job_title: 'Blockchain Developer',
    job_description: 'Desarrollador de smart contracts y aplicaciones blockchain',
    job_category: 'Blockchain',
    experience_level: 'Mid-Level',
    job_type: 'Tiempo Completo',
    contract_type: 'Indefinido',
    salary_min: 6000,
    salary_max: 8000,
    currency: 'USD',
    location: 'Remoto',
    remote: 'remote',
    skills_required: ['Solidity', 'Web3.js', 'Python', 'Seguridad'],
    education_required: 'Profesional',
    applications_count: 78,
    status: 'active',
    created_by: 3,
    views: 1245,
    likes: 156,
    reports: 2,
    under_review: false,
    show_in_search: true,
    deadline: new Date('2025-01-15'),
    created_at: new Date('2024-09-20'),
    updated_at: new Date('2024-11-22'),
  },
  {
    id: 4,
    company_name: 'Marketing Innovators',
    company_logo: 'https://via.placeholder.com/100?text=MarketingInno',
    job_title: 'Digital Marketing Specialist',
    job_description: 'Especialista en marketing digital y gestión de redes sociales',
    job_category: 'Marketing',
    experience_level: 'Junior',
    job_type: 'Tiempo Parcial',
    contract_type: 'Por Proyecto',
    salary_min: 1500,
    salary_max: 2000,
    currency: 'USD',
    location: 'Cali, Colombia',
    remote: 'hybrid',
    skills_required: ['Google Analytics', 'Meta Ads', 'Copywriting', 'SEO'],
    education_required: 'Técnico',
    applications_count: 34,
    status: 'pending',
    created_by: 4,
    views: 567,
    likes: 41,
    reports: 0,
    under_review: false,
    show_in_search: true,
    deadline: new Date('2024-12-20'),
    created_at: new Date('2024-11-05'),
    updated_at: new Date('2024-11-19'),
  },
  {
    id: 5,
    company_name: 'Data Science Hub',
    company_logo: 'https://via.placeholder.com/100?text=DataScience',
    job_title: 'Machine Learning Engineer',
    job_description: 'Ingeniero ML para desarrollo de modelos predictivos',
    job_category: 'Data Science',
    experience_level: 'Senior',
    job_type: 'Tiempo Completo',
    contract_type: 'Indefinido',
    salary_min: 7000,
    salary_max: 9000,
    currency: 'USD',
    location: 'Bogotá, Colombia',
    remote: 'hybrid',
    skills_required: ['Python', 'TensorFlow', 'SQL', 'AWS', 'Docker'],
    education_required: 'Profesional',
    applications_count: 67,
    status: 'active',
    created_by: 5,
    views: 1567,
    likes: 234,
    reports: 1,
    under_review: false,
    show_in_search: true,
    deadline: new Date('2025-02-01'),
    created_at: new Date('2024-08-10'),
    updated_at: new Date('2024-11-21'),
  },
];

export const getMockJob = (id) => {
  return mockJobs.find(j => j.id === parseInt(id));
};

export const filterMockJobs = (query) => {
  let filtered = [...mockJobs];

  if (query.status) {
    filtered = filtered.filter(j => j.status === query.status);
  }

  if (query.jobCategory) {
    filtered = filtered.filter(j => j.job_category.toLowerCase().includes(query.jobCategory.toLowerCase()));
  }

  if (query.experienceLevel) {
    filtered = filtered.filter(j => j.experience_level.toLowerCase().includes(query.experienceLevel.toLowerCase()));
  }

  if (query.remote) {
    filtered = filtered.filter(j => j.remote === query.remote);
  }

  if (query.limit) {
    filtered = filtered.slice(0, parseInt(query.limit));
  }

  return filtered;
};

export const incrementJobLikes = (id) => {
  const job = mockJobs.find(j => j.id === parseInt(id));
  if (job) {
    job.likes += 1;
  }
  return job;
};

export const decrementJobLikes = (id) => {
  const job = mockJobs.find(j => j.id === parseInt(id));
  if (job && job.likes > 0) {
    job.likes -= 1;
  }
  return job;
};

export const incrementJobReports = (id) => {
  const job = mockJobs.find(j => j.id === parseInt(id));
  if (job) {
    job.reports += 1;
    if (job.reports >= 30) {
      job.under_review = true;
    }
  }
  return job;
};
