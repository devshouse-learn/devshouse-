import React from 'react';
import { MdLightbulb, MdWorkspaces, MdPublic, MdStar, MdVerified, MdSecurity, MdEdit } from 'react-icons/md';
import { FiBook, FiZap, FiGlobe } from 'react-icons/fi';

// Componente wrapper de iconos con tamaño y color personalizables
export const Icon = ({ name, size = 24, color = '#000000', className = '' }) => {
  const iconProps = {
    size,
    color,
    className: `icon ${className}`,
  };

  const icons = {
    // Educación
    book: <MdBook {...iconProps} />,
    education: <FiBook {...iconProps} />,
    
    // Emprendimiento/Ideas
    lightbulb: <MdLightbulb {...iconProps} />,
    idea: <MdLightbulb {...iconProps} />,
    
    // Empleos/Trabajo
    work: <MdWorkspaces {...iconProps} />,
    jobs: <MdWorkspaces {...iconProps} />,
    
    // Comunidad/Global
    global: <MdPublic {...iconProps} />,
    community: <FiGlobe {...iconProps} />,
    
    // Misión/Éxito
    star: <MdStar {...iconProps} />,
    mission: <MdStar {...iconProps} />,
    
    // Visión
    verified: <MdVerified {...iconProps} />,
    vision: <MdVerified {...iconProps} />,
    
    // Seguridad/Login
    security: <MdSecurity {...iconProps} />,
    login: <MdSecurity {...iconProps} />,
    
    // Crear/Editar
    edit: <MdEdit {...iconProps} />,
    create: <MdEdit {...iconProps} />,
    
    // Rapidez
    lightning: <FiZap {...iconProps} />,
    speed: <FiZap {...iconProps} />,
  };

  return icons[name] || null;
};

// Objeto con configuración de iconos por categoría
export const IconConfig = {
  education: {
    name: 'book',
    size: 32,
    color: '#000000',
  },
  startup: {
    name: 'lightbulb',
    size: 32,
    color: '#000000',
  },
  jobs: {
    name: 'work',
    size: 32,
    color: '#000000',
  },
  community: {
    name: 'global',
    size: 32,
    color: '#000000',
  },
  mission: {
    name: 'star',
    size: 28,
    color: '#000000',
  },
  vision: {
    name: 'verified',
    size: 28,
    color: '#000000',
  },
  security: {
    name: 'security',
    size: 24,
    color: '#000000',
  },
  create: {
    name: 'edit',
    size: 24,
    color: '#000000',
  },
  speed: {
    name: 'lightning',
    size: 32,
    color: '#000000',
  },
};

export default Icon;
