// Mock data para reacciones (likes y reportes)
export const mockReactions = [];

// Funciones helper para reactions
export const addLike = (userId, resourceType, resourceId) => {
  // Verificar si ya existe el like
  const existingIndex = mockReactions.findIndex(
    r => r.userId === userId && r.resourceType === resourceType && 
         r.resourceId === resourceId && r.reactionType === 'like'
  );

  if (existingIndex !== -1) {
    // Remover like existente (unlike)
    mockReactions.splice(existingIndex, 1);
    return { action: 'unliked', data: null };
  } else {
    // Agregar nuevo like
    const newReaction = {
      id: mockReactions.length + 1,
      userId,
      resourceType,
      resourceId,
      reactionType: 'like',
      reportReason: null,
      created_at: new Date(),
    };
    mockReactions.push(newReaction);
    return { action: 'liked', data: newReaction };
  }
};

export const addReport = (userId, resourceType, resourceId, reportReason) => {
  // Verificar si ya ha reportado
  const existingReport = mockReactions.find(
    r => r.userId === userId && r.resourceType === resourceType && 
         r.resourceId === resourceId && r.reactionType === 'report'
  );

  if (existingReport) {
    return { error: 'Ya has reportado este contenido', data: null };
  }

  const newReaction = {
    id: mockReactions.length + 1,
    userId,
    resourceType,
    resourceId,
    reactionType: 'report',
    reportReason: reportReason || 'Sin razón especificada',
    created_at: new Date(),
  };
  mockReactions.push(newReaction);
  return { action: 'reported', data: newReaction };
};

export const getUserReactions = (userId, resourceType, resourceId) => {
  const reactions = mockReactions.filter(
    r => r.userId === userId && r.resourceType === resourceType && r.resourceId === resourceId
  );

  return {
    hasLiked: reactions.some(r => r.reactionType === 'like'),
    hasReported: reactions.some(r => r.reactionType === 'report'),
    reactions,
  };
};

export const getReactionStats = (resourceType, resourceId) => {
  const resourceReactions = mockReactions.filter(
    r => r.resourceType === resourceType && r.resourceId === resourceId
  );

  const likes = resourceReactions.filter(r => r.reactionType === 'like').length;
  const reports = resourceReactions.filter(r => r.reactionType === 'report');
  const underReview = reports.length >= 30;

  return {
    likes,
    reports: reports.length,
    underReview,
    reportDetails: reports.map(r => ({
      userId: r.userId,
      reason: r.reportReason,
      createdAt: r.created_at,
    })),
  };
};
