// Dashboard menu items configuration
export const DASHBOARD_MENU_ITEMS = [
  {
    id: 1,
    path: '/agreements',
    title: 'Convenios Educativos',
    description: 'Accede a convenios educativos y conexiones académicas',
    icon: '🎓',
    color: 'blue',
    roles: ['usuario', 'moderador', 'admin']
  },
  {
    id: 2,
    path: '/ventures',
    title: 'Emprendimientos',
    description: 'Crea y gestiona tus proyectos emprendedores',
    icon: '🚀',
    color: 'purple',
    roles: ['usuario', 'moderador', 'admin']
  },
  {
    id: 4,
    path: '/recruiting',
    title: 'Centro de Reclutamiento',
    description: 'Busca talentos o publica oportunidades laborales',
    icon: '💼',
    color: 'orange',
    roles: ['usuario', 'moderador', 'admin']
  },
  {
    id: 6,
    path: '/admin',
    title: 'Panel de Administración',
    description: 'Gestiona usuarios, permisos y configuraciones',
    icon: '⚙️',
    color: 'red',
    roles: ['admin', 'moderador']
  },
  {
    id: 7,
    path: '/moderation-panel',
    title: 'Panel de Moderación',
    description: 'Revisa y modera contenido de la plataforma',
    icon: '🛡️',
    color: 'green',
    roles: ['moderador', 'admin']
  }
];
