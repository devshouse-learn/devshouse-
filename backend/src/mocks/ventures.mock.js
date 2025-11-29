// Mock data para emprendimientos (ventures)
export const mockVentures = [
  {
    id: 1,
    company_name: 'TechInnovate',
    industry: 'Tecnología',
    founded_year: 2022,
    location: 'Bogotá, Colombia',
    founder_name: 'Juan Pérez',
    founder_email: 'juan@techinnovate.com',
    founder_phone: '+57 300 123 4567',
    description: 'Plataforma de IA para optimización de procesos empresariales',
    website: 'https://techinnovate.com',
    investment_stage: 'seed',
    funding_needed: '$50,000 - $100,000',
    team_size: '3-5',
    revenue_model: 'SaaS - Suscripción mensual',
    status: 'active',
    created_by: 1,
    views: 245,
    likes: 18,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2023-06-15'),
    updated_at: new Date('2024-10-10'),
  },
  {
    id: 2,
    company_name: 'EcoSolutions',
    industry: 'Sostenibilidad',
    founded_year: 2021,
    location: 'Medellín, Colombia',
    founder_name: 'María García',
    founder_email: 'maria@ecosolutions.com',
    founder_phone: '+57 310 987 6543',
    description: 'Soluciones de reciclaje inteligente con IoT',
    website: 'https://ecosolutions.co',
    investment_stage: 'growth',
    funding_needed: '$200,000 - $500,000',
    team_size: '8-12',
    revenue_model: 'B2B - Contrato anual',
    status: 'active',
    created_by: 2,
    views: 512,
    likes: 45,
    reports: 1,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2023-01-20'),
    updated_at: new Date('2024-11-15'),
  },
  {
    id: 3,
    company_name: 'FinTech Hub',
    industry: 'Finanzas',
    founded_year: 2023,
    location: 'Cali, Colombia',
    founder_name: 'Carlos López',
    founder_email: 'carlos@fintechhub.com',
    founder_phone: '+57 320 456 7890',
    description: 'Plataforma de pagos para pequeños negocios',
    website: 'https://fintechhub.com',
    investment_stage: 'idea',
    funding_needed: '$30,000 - $50,000',
    team_size: '2-3',
    revenue_model: 'Comisión por transacción',
    status: 'pending',
    created_by: 3,
    views: 89,
    likes: 7,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2024-09-01'),
    updated_at: new Date('2024-11-20'),
  },
  {
    id: 4,
    company_name: 'EdTech Makers',
    industry: 'Educación',
    founded_year: 2020,
    location: 'Bucaramanga, Colombia',
    founder_name: 'Ana Rodríguez',
    founder_email: 'ana@edmake.com',
    founder_phone: '+57 315 234 5678',
    description: 'Plataforma educativa interactiva para escuelas rurales',
    website: 'https://edmake.com',
    investment_stage: 'expansion',
    funding_needed: '$400,000 - $800,000',
    team_size: '15-20',
    revenue_model: 'Freemium - Premium features',
    status: 'active',
    created_by: 4,
    views: 678,
    likes: 92,
    reports: 2,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2022-11-10'),
    updated_at: new Date('2024-11-10'),
  },
  {
    id: 5,
    company_name: 'HealthConnect',
    industry: 'Salud',
    founded_year: 2024,
    location: 'Barranquilla, Colombia',
    founder_name: 'Dr. Miguel Santos',
    founder_email: 'miguel@healthconnect.com',
    founder_phone: '+57 325 678 9012',
    description: 'App de telemedicina para consultas rápidas',
    website: 'https://healthconnect.com',
    investment_stage: 'seed',
    funding_needed: '$100,000 - $200,000',
    team_size: '5-8',
    revenue_model: 'Por consulta + Suscripción premium',
    status: 'active',
    created_by: 5,
    views: 234,
    likes: 23,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2024-02-28'),
    updated_at: new Date('2024-11-25'),
  },
];

export const getMockVenture = (id) => {
  return mockVentures.find(v => v.id === parseInt(id));
};

export const filterMockVentures = (query) => {
  let filtered = [...mockVentures];

  if (query.status) {
    filtered = filtered.filter(v => v.status === query.status);
  }

  if (query.industry) {
    filtered = filtered.filter(v => v.industry.toLowerCase().includes(query.industry.toLowerCase()));
  }

  if (query.investmentStage) {
    filtered = filtered.filter(v => v.investment_stage === query.investmentStage);
  }

  if (query.limit) {
    filtered = filtered.slice(0, parseInt(query.limit));
  }

  return filtered;
};

export const incrementVentureLikes = (id) => {
  const venture = mockVentures.find(v => v.id === parseInt(id));
  if (venture) {
    venture.likes += 1;
  }
  return venture;
};

export const decrementVentureLikes = (id) => {
  const venture = mockVentures.find(v => v.id === parseInt(id));
  if (venture && venture.likes > 0) {
    venture.likes -= 1;
  }
  return venture;
};

export const incrementVentureReports = (id) => {
  const venture = mockVentures.find(v => v.id === parseInt(id));
  if (venture) {
    venture.reports += 1;
    if (venture.reports >= 30) {
      venture.under_review = true;
    }
  }
  return venture;
};
