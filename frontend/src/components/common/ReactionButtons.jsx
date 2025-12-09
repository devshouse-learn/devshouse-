import { useState, useEffect } from 'react';
import { reactionsService } from '../../services/reactions.service';
import { useAuth } from '../../context/AuthContext';
import './ReactionButtons.css';

const ReactionButtons = ({ resourceType, resourceId, initialLikes = 0, initialReports = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserReactions();
    }
  }, [isAuthenticated, user, resourceType, resourceId]);

  const loadUserReactions = async () => {
    try {
      const response = await reactionsService.getUserReactions(
        user.id,
        resourceType,
        resourceId
      );
      setHasLiked(response.data.hasLiked);
      setHasReported(response.data.hasReported);
    } catch (error) {
      console.error('Error al cargar reacciones:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      setLoading(true);
      const response = await reactionsService.like(user.id, resourceType, resourceId);
      
      setHasLiked(response.action === 'liked');
      setLikes(response.likes);
    } catch (error) {
      console.error('Error al dar like:', error);
      alert('Error al procesar tu like');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert('Por favor escribe una razón para la denuncia');
      return;
    }

    try {
      setLoading(true);
      await reactionsService.report(user.id, resourceType, resourceId, reportReason);
      
      setHasReported(true);
      setReports(prev => prev + 1);
      setShowReportModal(false);
      setReportReason('');
      alert(' Denuncia enviada. Gracias por ayudar a mantener la calidad del contenido.');
    } catch (error) {
      console.error('Error al denunciar:', error);
      if (error.message?.includes('Ya has denunciado')) {
        alert('Ya has denunciado este contenido anteriormente');
      } else {
        alert('Error al enviar la denuncia');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-buttons">
      <button
        className={`btn-like ${hasLiked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={loading}
        title={hasLiked ? 'Quitar like' : 'Dar like'}
      >
        {hasLiked ? '' : ''} {likes}
      </button>

      <button
        className={`btn-report ${hasReported ? 'reported' : ''}`}
        onClick={() => setShowReportModal(true)}
        disabled={loading || hasReported || !isAuthenticated}
        title={hasReported ? 'Ya denunciaste este contenido' : 'Denunciar contenido inapropiado'}
      >
        {hasReported ? '' : ''} Denunciar
      </button>

      {/* Modal de denuncia */}
      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <h3> Denunciar Contenido</h3>
            <p>Por favor indica la razón de tu denuncia:</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Ejemplo: Contenido ofensivo, spam, información falsa, etc."
              rows="4"
              maxLength="500"
            />
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-submit-report"
                onClick={handleReportSubmit}
                disabled={loading || !reportReason.trim()}
              >
                {loading ? 'Enviando...' : 'Enviar Denuncia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
