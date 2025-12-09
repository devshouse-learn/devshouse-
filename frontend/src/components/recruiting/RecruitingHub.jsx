import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruitingHub.css';

const RecruitingHub = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null); // 'search' o 'publish'
  const [selectedType, setSelectedType] = useState(null); // 'empresa', 'talento', 'empleo', 'hoja-vida'

  const handleSearchClick = () => {
    setActiveMode('search');
    setSelectedType(null);
  };

  const handlePublishClick = () => {
    setActiveMode('publish');
    setSelectedType(null);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleNavigate = () => {
    if (selectedType === 'empresa') {
      navigate('/recruiting/search-companies');
    } else if (selectedType === 'talento') {
      navigate('/recruiting/search-talent');
    } else if (selectedType === 'empleo') {
      navigate('/recruiting/publish-job');
    } else if (selectedType === 'hoja-vida') {
      navigate('/recruiting/publish-profile');
    }
  };

  return (
    <div className="recruiting-container">
      <div className="list-header">
        <div className="header-top">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          ><span className="emoji">↩️</span> Volver </button>
        </div>
        <div className="header-content">
          <h1>Centro de Reclutamiento</h1>
          <p>Busca talento, publica ofertas y encuentra el mejor equipo</p>
        </div>
      </div>

      {!activeMode ? (
        <div className="mode-selector">
          <button
            className="mode-button search-mode"
            onClick={handleSearchClick}
          >
            <div className="mode-icon"><span className="emoji">🔍</span></div>
            <div className="mode-title">Buscar</div>
            <div className="mode-description">Encontra empresas o talentos</div>
          </button>

          <button
            className="mode-button publish-mode"
            onClick={handlePublishClick}
          >
            <div className="mode-icon"><span className="emoji">📤</span></div>
            <div className="mode-title">Publicar</div>
            <div className="mode-description">Comparte ofertas o perfiles</div>
          </button>
        </div>
      ) : (
        <div className="mode-content">
          <div className="mode-actions">
            <button className="back-button" onClick={() => setActiveMode(null)}>
              <span className="emoji">↩️</span> Atrás
            </button>
            <button 
              className="clear-button" 
              onClick={() => {
                setActiveMode(null);
                setSelectedType(null);
              }}
            >
               Limpiar
            </button>
          </div>

          {activeMode === 'search' && (
            <div className="search-mode-content">
              <h2></h2>

              <div className="type-selector">
                <button
                  className={`type-button ${
                    selectedType === 'empresa' ? 'active' : ''
                  }`}
                  onClick={() => handleTypeSelect('empresa')}
                >
                  <div className="type-icon"><span className="emoji">🏢</span></div>
                  <div className="type-name">Empresas</div>
                </button>

                <button
                  className={`type-button ${
                    selectedType === 'talento' ? 'active' : ''
                  }`}
                  onClick={() => handleTypeSelect('talento')}
                >
                  <div className="type-icon"><span className="emoji">👤</span></div>
                  <div className="type-name">Talentos</div>
                </button>
              </div>

              {selectedType && (
                <div className="filter-section">
                  <button
                    className="action-button"
                    onClick={handleNavigate}
                  >
                    Buscar {selectedType === 'empresa' ? 'Empresas' : 'Talentos'}
                  </button>
                  <button
                    className="action-button secondary"
                    onClick={() => setSelectedType(null)}
                  >
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          )}

          {activeMode === 'publish' && (
            <div className="publish-mode-content">
              <h2>¿Qué deseas publicar?</h2>

              <div className="type-selector">
                <button
                  className={`type-button ${
                    selectedType === 'empleo' ? 'active' : ''
                  }`}
                  onClick={() => handleTypeSelect('empleo')}
                >
                  <div className="type-icon"><span className="emoji">💼</span></div>
                  <div className="type-name">Oferta de Empleo</div>
                </button>

                <button
                  className={`type-button ${
                    selectedType === 'hoja-vida' ? 'active' : ''
                  }`}
                  onClick={() => handleTypeSelect('hoja-vida')}
                >
                  <div className="type-icon"><span className="emoji">📄</span></div>
                  <div className="type-name">Hoja de Vida</div>
                </button>
              </div>

              {selectedType && (
                <div className="publish-section">
                  <button
                    className="action-button publish"
                    onClick={handleNavigate}
                  >
                    Publicar {selectedType === 'empleo' ? 'Oferta' : 'Perfil'}
                  </button>
                  <button
                    className="action-button secondary"
                    onClick={() => setSelectedType(null)}
                  >
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruitingHub;
