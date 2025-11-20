export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ROUTES = {
  HOME: '/',
  AGREEMENTS: '/agreements',
  VENTURES: '/ventures',
  JOBS: '/jobs',
  JOB_SEARCH: '/job-search',
};

export const COMMUNITY_LINKS = {
  WHATSAPP: {
    agreements: 'https://chat.whatsapp.com/convenios-educativos',
    ventures: 'https://chat.whatsapp.com/emprendedores',
    jobs: 'https://chat.whatsapp.com/reclutadores',
    candidates: 'https://chat.whatsapp.com/candidatos',
  },
  DISCORD: {
    agreements: 'https://discord.gg/convenios-educativos',
    ventures: 'https://discord.gg/emprendedores',
    jobs: 'https://discord.gg/reclutadores',
    candidates: 'https://discord.gg/candidatos',
  },
};
