// Mock data para convenios educativos
export const mockAgreements = [
  {
    id: 1,
    school_name: 'Colegio San José',
    school_contact: 'coordinador@sanjose.edu.co',
    school_phone: '+57 300 111 2222',
    school_location: 'Bogotá, Colombia',
    school_level: '',
    agreement_type: 'Práctica Educativa',
    description: 'Convenio para prácticas de estudiantes en empresas tecnológicas',
    company_name: 'TechCorp Colombia',
    company_contact: 'hr@techcorp.com',
    company_phone: '+57 310 333 4444',
    duration_months: 12,
    start_date: new Date('2024-01-15'),
    end_date: new Date('2025-01-15'),
    students_count: 25,
    status: 'active',
    created_by: 1,
    views: 156,
    likes: 12,
    reports: 3,
    under_review: true,
    show_in_search: true,
    created_at: new Date('2023-11-20'),
    updated_at: new Date('2024-11-20'),
  },
  {
    id: 2,
    school_name: 'Instituto Técnico María Auxiliadora',
    school_contact: 'rectoria@itma.edu.co',
    school_phone: '+57 315 555 6666',
    school_location: 'Medellín, Colombia',
    school_level: 'Técnico',
    agreement_type: 'Intercambio Académico',
    description: 'Intercambio de estudiantes y docentes con institución europea',
    company_name: 'Academia Européa de Formación',
    company_contact: 'contact@aef.eu',
    company_phone: '+34 91 234 5678',
    duration_months: 24,
    start_date: new Date('2024-03-01'),
    end_date: new Date('2026-03-01'),
    students_count: 15,
    status: 'active',
    created_by: 2,
    views: 234,
    likes: 28,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2023-09-10'),
    updated_at: new Date('2024-10-15'),
  },
  {
    id: 3,
    school_name: 'Universidad Distrital Francisco José de Caldas',
    school_contact: 'convenios@udistrital.edu.co',
    school_phone: '+57 320 777 8888',
    school_location: 'Bogotá, Colombia',
    school_level: 'Universidad',
    agreement_type: 'Investigación y Desarrollo',
    description: 'Colaboración en investigación de tecnologías emergentes',
    company_name: 'Innova Labs',
    company_contact: 'research@innovalabs.com',
    company_phone: '+57 325 999 0000',
    duration_months: 36,
    start_date: new Date('2024-06-01'),
    end_date: new Date('2027-06-01'),
    students_count: 40,
    status: 'pending',
    created_by: 3,
    views: 89,
    likes: 6,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2024-08-05'),
    updated_at: new Date('2024-11-10'),
  },
  {
    id: 4,
    school_name: 'Escuela Politécnica Nacional',
    school_contact: 'admin@epn.edu.ec',
    school_phone: '+593 2 298 8000',
    school_location: 'Quito, Ecuador',
    school_level: 'Universidad',
    agreement_type: 'Doble Titulación',
    description: 'Programa de doble grado con enfoque en ingeniería digital',
    company_name: 'Global Tech Partners',
    company_contact: 'partnerships@globaltech.com',
    company_phone: '+593 2 600 1000',
    duration_months: 48,
    start_date: new Date('2024-01-20'),
    end_date: new Date('2028-01-20'),
    students_count: 50,
    status: 'active',
    created_by: 4,
    views: 445,
    likes: 62,
    reports: 1,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2023-07-15'),
    updated_at: new Date('2024-11-15'),
  },
  {
    id: 5,
    school_name: 'Colegio Bilingüe La Salle',
    school_contact: 'coordinacion@lasalle.edu.co',
    school_phone: '+57 311 222 3333',
    school_location: 'Cali, Colombia',
    school_level: '',
    agreement_type: 'Capacitación Docente',
    description: 'Programa de capacitación en metodologías STEM para docentes',
    company_name: 'STEM Education Global',
    company_contact: 'training@stemeduglobal.org',
    company_phone: '+1 202 555 1234',
    duration_months: 18,
    start_date: new Date('2024-02-01'),
    end_date: new Date('2025-08-01'),
    students_count: 120,
    status: 'active',
    created_by: 5,
    views: 567,
    likes: 89,
    reports: 0,
    under_review: false,
    show_in_search: true,
    created_at: new Date('2023-12-01'),
    updated_at: new Date('2024-11-22'),
  },
];

export const getMockAgreement = (id) => {
  return mockAgreements.find(a => a.id === parseInt(id));
};

export const filterMockAgreements = (query) => {
  let filtered = [...mockAgreements];

  if (query.status) {
    filtered = filtered.filter(a => a.status === query.status);
  }

  if (query.agreementType) {
    filtered = filtered.filter(a => a.agreement_type.toLowerCase().includes(query.agreementType.toLowerCase()));
  }

  if (query.schoolLevel) {
    filtered = filtered.filter(a => a.school_level.toLowerCase().includes(query.schoolLevel.toLowerCase()));
  }

  if (query.limit) {
    filtered = filtered.slice(0, parseInt(query.limit));
  }

  return filtered;
};

export const incrementAgreementLikes = (id) => {
  const agreement = mockAgreements.find(a => a.id === parseInt(id));
  if (agreement) {
    agreement.likes += 1;
  }
  return agreement;
};

export const decrementAgreementLikes = (id) => {
  const agreement = mockAgreements.find(a => a.id === parseInt(id));
  if (agreement && agreement.likes > 0) {
    agreement.likes -= 1;
  }
  return agreement;
};

export const incrementAgreementReports = (id) => {
  const agreement = mockAgreements.find(a => a.id === parseInt(id));
  if (agreement) {
    agreement.reports += 1;
    // Marcar como en revisión desde el primer reporte
    if (agreement.reports >= 1) {
      agreement.under_review = true;
    }
  }
  return agreement;
};
