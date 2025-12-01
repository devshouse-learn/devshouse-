// Paleta de colores profesional uniforme
export const colorPalette = {
  // Colores primarios
  primary: '#10B981', // Verde esmeralda profesional
  primaryLight: '#D1FAE5',
  primaryDark: '#059669',
  
  // Colores secundarios
  secondary: '#F97316', // Naranja profesional
  secondaryLight: '#FFEDD5',
  secondaryDark: '#EA580C',
  
  // Colores de acento
  accent: '#0EA5E9', // Azul cielo profesional
  accentLight: '#CFFAFE',
  accentDark: '#0284C7',
  
  // Colores neutros
  dark: '#1F2937',
  light: '#F3F4F6',
  gray: '#9CA3AF',
  
  // Colores por categoría
  education: '#0EA5E9', // Azul para educación
  startup: '#8B5CF6', // Púrpura para emprendimientos
  jobs: '#F59E0B', // Ámbar para empleos
  community: '#EC4899', // Rosa para comunidad
};

export const getColorByCategory = (category) => {
  const categoryColors = {
    education: colorPalette.education,
    agreements: colorPalette.education,
    students: colorPalette.education,
    ventures: colorPalette.startup,
    startups: colorPalette.startup,
    jobs: colorPalette.jobs,
    employment: colorPalette.jobs,
    community: colorPalette.community,
  };
  
  return categoryColors[category] || colorPalette.primary;
};

export default colorPalette;
