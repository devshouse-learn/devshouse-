// Mock data para candidatos (perfiles de búsqueda de empleo)
export const mockCandidates = [
  {
    id: 1,
    full_name: 'Juan David Martínez',
    email: 'juan.martinez@email.com',
    phone: '+57 300 111 2222',
    profile_photo: 'https://via.placeholder.com/150?text=JDM',
    professional_title: 'Senior Frontend Developer',
    professional_summary: 'Desarrollador Full Stack con 8 años de experiencia en React, Node.js y TypeScript',
    location: 'Bogotá, Colombia',
    current_job_title: 'Tech Lead at TechCorp',
    years_experience: 8,
    education_level: 'Profesional',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
    languages: ['Español', 'Inglés', 'Francés'],
    job_type_preference: 'Tiempo Completo',
    remote_preference: 'hybrid',
    salary_expectation_min: 5500,
    salary_expectation_max: 7500,
    currency: 'USD',
    availability: 'Inmediato',
    status: 'active',
    views: 234,
    likes: 18,
    reports: 0,
    under_review: false,
    show_in_search: true,
    linkedin_url: 'https://linkedin.com/in/juandavidmartinez',
    portfolio_url: 'https://juandaviddev.com',
    created_at: new Date('2024-08-15'),
    updated_at: new Date('2024-11-20'),
  },
  {
    id: 2,
    full_name: 'María Alejandra Rodríguez',
    email: 'maria.rodriguez@email.com',
    phone: '+57 310 333 4444',
    profile_photo: 'https://via.placeholder.com/150?text=MAR',
    professional_title: 'UX/UI Designer',
    professional_summary: 'Diseñadora UX/UI especializada en diseño responsivo y accesibilidad web',
    location: 'Medellín, Colombia',
    current_job_title: '',
    years_experience: 6,
    education_level: 'Profesional',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'CSS'],
    languages: ['Español', 'Inglés'],
    job_type_preference: 'Tiempo Completo',
    remote_preference: 'remote',
    salary_expectation_min: 3000,
    salary_expectation_max: 4000,
    currency: 'USD',
    availability: '2 semanas',
    status: 'active',
    views: 156,
    likes: 9,
    reports: 2,
    under_review: true,
    show_in_search: true,
    linkedin_url: 'https://linkedin.com/in/marodriguez',
    portfolio_url: 'https://mariadesign.com',
    created_at: new Date('2024-09-10'),
    updated_at: new Date('2024-11-15'),
  },
  {
    id: 3,
    full_name: 'Carlos Enrique López Pérez',
    email: 'carlos.lopez@email.com',
    phone: '+57 315 555 6666',
    profile_photo: 'https://via.placeholder.com/150?text=CELP',
    professional_title: 'DevOps Engineer',
    professional_summary: 'Ingeniero DevOps con experiencia en CI/CD, Kubernetes y AWS',
    location: 'Cali, Colombia',
    current_job_title: 'DevOps Engineer at Cloud Solutions',
    years_experience: 5,
    education_level: 'Profesional',
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
    languages: ['Español', 'Inglés'],
    job_type_preference: 'Tiempo Completo',
    remote_preference: 'hybrid',
    salary_expectation_min: 4500,
    salary_expectation_max: 6500,
    currency: 'USD',
    availability: 'Negociable',
    status: 'active',
    views: 178,
    likes: 12,
    reports: 0,
    under_review: false,
    show_in_search: true,
    linkedin_url: 'https://linkedin.com/in/carloslopez',
    portfolio_url: 'https://github.com/carloslopez',
    created_at: new Date('2024-09-10'),
    updated_at: new Date('2024-11-15'),
  },
  {
    id: 4,
    full_name: 'Ana Patricia García Vargas',
    email: 'ana.garcia@email.com',
    phone: '+57 320 777 8888',
    profile_photo: 'https://via.placeholder.com/150?text=APGV',
    professional_title: 'Data Scientist',
    professional_summary: 'Científica de datos con experiencia en ML y análisis predictivo',
    location: 'Bogotá, Colombia',
    current_job_title: 'Data Scientist at Analytics Corp',
    years_experience: 7,
    education_level: 'Posgrado',
    skills: ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas', 'Tableau'],
    languages: ['Español', 'Inglés', 'Portugués'],
    job_type_preference: 'Tiempo Completo',
    remote_preference: 'remote',
    salary_expectation_min: 5000,
    salary_expectation_max: 7000,
    currency: 'USD',
    availability: 'Inmediato',
    status: 'active',
    views: 612,
    likes: 67,
    reports: 1,
    under_review: false,
    show_in_search: true,
    linkedin_url: 'https://linkedin.com/in/anagarcia',
    portfolio_url: 'https://kaggle.com/anagarcia',
    created_at: new Date('2024-06-05'),
    updated_at: new Date('2024-11-22'),
  },
  {
    id: 5,
    full_name: 'Pedro Hernández Jiménez',
    email: 'pedro.hernandez@email.com',
    phone: '+57 325 999 0000',
    profile_photo: 'https://via.placeholder.com/150?text=PHJ',
    professional_title: 'Product Manager',
    professional_summary: 'Gestor de producto con experiencia en startups y empresas tech',
    location: 'Barranquilla, Colombia',
    current_job_title: 'Product Manager at SaaS Startup',
    years_experience: 6,
    education_level: 'Profesional',
    skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Figma', 'Jira'],
    languages: ['Español', 'Inglés'],
    job_type_preference: 'Tiempo Completo',
    remote_preference: 'hybrid',
    salary_expectation_min: 4000,
    salary_expectation_max: 6000,
    currency: 'USD',
    availability: 'Disponible en 1 mes',
    status: 'pending',
    views: 289,
    likes: 21,
    reports: 0,
    under_review: false,
    show_in_search: true,
    linkedin_url: 'https://linkedin.com/in/pedrohernanez',
    portfolio_url: 'https://pedropm.notion.site',
    created_at: new Date('2024-10-15'),
    updated_at: new Date('2024-11-10'),
  },
];

export const getMockCandidate = (id) => {
  return mockCandidates.find(c => c.id === parseInt(id));
};

export const filterMockCandidates = (query) => {
  let filtered = [...mockCandidates];

  if (query.status) {
    filtered = filtered.filter(c => c.status === query.status);
  }

  if (query.professionalTitle) {
    filtered = filtered.filter(c => c.professional_title.toLowerCase().includes(query.professionalTitle.toLowerCase()));
  }

  if (query.yearsExperience) {
    const minYears = parseInt(query.yearsExperience);
    filtered = filtered.filter(c => c.years_experience >= minYears);
  }

  if (query.location) {
    filtered = filtered.filter(c => c.location.toLowerCase().includes(query.location.toLowerCase()));
  }

  if (query.limit) {
    filtered = filtered.slice(0, parseInt(query.limit));
  }

  return filtered;
};

export const incrementCandidateLikes = (id) => {
  const candidate = mockCandidates.find(c => c.id === parseInt(id));
  if (candidate) {
    candidate.likes += 1;
  }
  return candidate;
};

export const decrementCandidateLikes = (id) => {
  const candidate = mockCandidates.find(c => c.id === parseInt(id));
  if (candidate && candidate.likes > 0) {
    candidate.likes -= 1;
  }
  return candidate;
};

export const incrementCandidateReports = (id) => {
  const candidate = mockCandidates.find(c => c.id === parseInt(id));
  if (candidate) {
    candidate.reports += 1;
    // Marcar como en revisión desde el primer reporte
    if (candidate.reports >= 1) {
      candidate.under_review = true;
    }
  }
  return candidate;
};
