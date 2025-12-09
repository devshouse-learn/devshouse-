import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agreementsService } from '../../services/registration.service';
import { useAuth } from '../../context/AuthContext';
import '../job-search/JobSearchList.css';

const StudentsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      console.log(' Cargando estudiantes desde API...');
      const response = await agreementsService.getAll();
      console.log(' Respuesta del API:', response);
      let loadedStudents = response.data || [];
      
      // Filtrar solo los registros que sean de estudiantes
      // (usando un marcador en la descripción para identificarlos)
      loadedStudents = loadedStudents.filter(s => 
        s.description && s.description.includes('Estudiante buscando oportunidades')
      );
      
      console.log(' Estudiantes cargados:', loadedStudents);
      setStudents(loadedStudents);
      
      // Cargar reacciones del usuario
      const reactions = {};
      for (const student of loadedStudents) {
        const userReaction = await agreementsService.getUserReactions(student.id);
        reactions[student.id] = userReaction;
      }
      setUserReactions(reactions);
      console.log(' Estudiantes y reacciones cargados exitosamente');
    } catch (err) {
      console.error(' Error loading students:', err);
      if (err.message.includes('Failed to fetch')) {
        setError(' No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.message.includes('timeout')) {
        setError(' La conexión tardó demasiado. Por favor, intenta de nuevo.');
      } else {
        setError(' Error al cargar los estudiantes. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await agreementsService.like(id);
      console.log('Like response:', result);
      
      const isLiking = result.action === 'liked';
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === id 
            ? { ...student, likes: isLiking ? (student.likes || 0) + 1 : (student.likes || 1) - 1 }
            : student
        )
      );
      
      setUserReactions(prev => ({
        ...prev,
        [id]: { ...prev[id], hasLiked: isLiking }
      }));
    } catch (err) {
      console.error('Error al dar like:', err);
      alert('Error al registrar like: ' + err.message);
    }
  };

  const handleReport = async (id) => {
    if (userReactions[id]?.hasReported) {
      return;
    }
    
    try {
      const reason = prompt('¿Cuál es el motivo de la denuncia?');
      if (reason) {
        const result = await agreementsService.report(id, reason);
        console.log('Report response:', result);
        
        setStudents(prevStudents => 
          prevStudents.map(student => 
            student.id === id 
              ? { ...student, reports: (student.reports || 0) + 1 }
              : student
          )
        );
        
        setUserReactions(prev => ({
          ...prev,
          [id]: { ...prev[id], hasReported: true }
        }));
        
        alert(' Denuncia registrada correctamente');
      }
    } catch (err) {
      console.error('Error al reportar:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>⏳ Cargando estudiantes...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/agreements')}
            title="Volver a Convenios"
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1> Estudiantes y Talentos</h1>
          <p>Descubre perfiles de estudiantes registrados</p>
        </div>
        <button 
          className="btn-primary-large"
          onClick={() => navigate('/agreements/student')}
        >
           Registrar el tuyo
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadStudents}
            style={{
              marginLeft: '15px',
              padding: '5px 15px',
              background: '#c33',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          ><span className="emoji">🔄</span> Reintentar </button>
        </div>
      )}

      {students.length === 0 ? (
        <div className="empty-state">
          <h2> Sin estudiantes registrados aún</h2>
          <p>Sé el primero en registrarte como estudiante</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/agreements/student')}
          >
             Registrarte
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {students.map((student) => (
            <div key={student.id} className="item-card">
              <div className="card-header">
                <div className="header-title">
                  <h3>{student.contactPerson || 'Estudiante'}</h3>
                  <span className="badge">{student.schoolType}</span>
                </div>
                <div className="header-menu">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}
                    title="Más opciones"
                  >
                    ⋮
                  </button>
                  {openMenuId === student.id && (
                    <div className="menu-dropdown">
                      <button
                        className="menu-item"
                        onClick={() => {
                          handleReport(student.id);
                          setOpenMenuId(null);
                        }}
                        disabled={userReactions[student.id]?.hasReported}
                      >
                        {userReactions[student.id]?.hasReported ? '🚨 Denunciado' : '🚨 Reportar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-content">
                <div className="card-body">
                  {/* Información Básica */}
                  <div className="info-row">
                    <span className="label"><span className="emoji">🏫</span> Institución:</span>
                    <span className="value">{student.schoolName}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📍</span> Ubicación:</span>
                    <span className="value">{student.location || 'No especificada'}</span>
                  </div>

                  {student.schoolType && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">🎓</span> Tipo:</span>
                      <span className="value">{student.schoolType}</span>
                    </div>
                  )}

                  {student.program && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📚</span> Programa:</span>
                      <span className="value">{student.program}</span>
                    </div>
                  )}

                  {student.grade && (
                    <div className="info-row">
                      <span className="label"><span className="emoji">📊</span> Grado:</span>
                      <span className="value">{student.grade}</span>
                    </div>
                  )}

                  <div className="info-row">
                    <span className="label"><span className="emoji">📧</span> Email:</span>
                    <span className="value">{student.contactEmail}</span>
                  </div>

                  <div className="info-row">
                    <span className="label"><span className="emoji">📱</span> Teléfono:</span>
                    <span className="value">{student.contactPhone || 'No disponible'}</span>
                  </div>

                  {student.interests && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">🎯</span> Intereses:</span>
                      <span className="value">{student.interests.substring(0, 100)}{student.interests.length > 100 ? '...' : ''}</span>
                    </div>
                  )}

                  {student.description && (
                    <div className="info-row description-preview">
                      <span className="label"><span className="emoji">📝</span> Descripción:</span>
                      <span className="value">{student.description.substring(0, 100)}{student.description.length > 100 ? '...' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="card-stats">
                  <span><span className="emoji">👁️</span> Vistas: {student.views || 0}</span>
                  <span><span className="emoji">❤️</span> Likes: {student.likes || 0}</span>
                  <span><span className="emoji">🚨</span> Reportes: {student.reports || 0}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`btn-like ${userReactions[student.id]?.hasLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(student.id)}
                  title={userReactions[student.id]?.hasLiked ? 'Quitar like' : 'Dar like'}
                >
                  <span className="emoji">🤍</span> {userReactions[student.id]?.hasLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  className="btn-contact"
                  onClick={() => {
                    // Intenta múltiples fuentes de email
                    const email = student.contactEmail 
                      || student.email 
                      || student.emailStudent
                      || student.contact?.email;
                    
                    console.log(' Trying email:', email, 'from student:', student);
                    
                    if (email && String(email).trim()) {
                      window.location.href = `mailto:${String(email).trim()}`;
                    } else {
                      console.warn(' No email found in student object:', student);
                      alert(' Email no disponible para este contacto. Por favor contacta al administrador.');
                    }
                  }}
                  title="Contactar al estudiante"
                ><span className="emoji">📬</span> Contactar </button>
                {(user?.role === 'admin' || user?.id === student.createdBy) && (
                  <button
                    onClick={() => {
                      const isAdmin = user?.role === 'admin';
                      const isCreator = user?.id === student.createdBy;

                      if (!isAdmin && !isCreator) {
                        alert(' No tienes permiso para eliminar este perfil');
                        return;
                      }

                      if (window.confirm(' ¿Estás seguro de que quieres eliminar este perfil?')) {
                        try {
                          agreementsService.delete(student.id);
                          setStudents(prevStudents => prevStudents.filter(s => s.id !== student.id));
                        } catch (err) {
                          alert(' Error al eliminar: ' + err.message);
                        }
                      }
                    }}
                    title={user?.role === 'admin' ? 'Eliminar perfil (admin)' : 'Eliminar tu perfil'}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: 'none',
                      padding: '0',
                      borderRadius: '0',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'none',
                      fontSize: '20px',
                    }}
                  ><span className="emoji">🗑️</span></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;
