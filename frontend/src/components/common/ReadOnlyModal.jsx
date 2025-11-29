import './ReadOnlyModal.css';

const ReadOnlyModal = ({ isOpen, onClose, data, type }) => {
  if (!isOpen || !data) return null;

  const renderField = (label, value, isLongText = false) => {
    if (!value) return null;

    return (
      <div className="readonly-field">
        <label className="readonly-label">{label}</label>
        {isLongText ? (
          <textarea 
            className="readonly-textarea"
            value={value}
            readOnly
            disabled
          />
        ) : (
          <input 
            type="text"
            className="readonly-input"
            value={value}
            readOnly
            disabled
          />
        )}
      </div>
    );
  };

  const renderAgreement = () => (
    <div className="readonly-form">
      <h2>� Convenio Educativo (Solo Lectura)</h2>
      
      <fieldset disabled>
        <legend>Información de la Institución</legend>
        {renderField('Nombre de la Institución', data.schoolName)}
        {renderField('Tipo de Institución', data.schoolType)}
        {renderField('Ubicación', data.location)}
      </fieldset>

      <fieldset disabled>
        <legend>Información de Contacto</legend>
        {renderField('Persona de Contacto', data.contactPerson)}
        {renderField('Email', data.contactEmail)}
        {renderField('Teléfono', data.contactPhone)}
      </fieldset>

      <fieldset disabled>
        <legend>Detalles del Programa</legend>
        {renderField('Programa Académico', data.academicProgram)}
        {renderField('Duración', data.duration)}
        {renderField('Beneficios', data.benefits, true)}
      </fieldset>

      <fieldset disabled>
        <legend>Información Adicional</legend>
        {renderField('Descripción', data.description, true)}
        {renderField('Fecha de Inicio', data.startDate)}
        {renderField('Estado', data.status)}
        {renderField('Creado', new Date(data.createdAt).toLocaleString())}
      </fieldset>
    </div>
  );

  const renderVenture = () => (
    <div className="readonly-form">
      <h2>� Emprendimiento (Solo Lectura)</h2>
      
      <fieldset disabled>
        <legend>Información de la Empresa</legend>
        {renderField('Nombre de la Empresa', data.companyName)}
        {renderField('Sector/Industria', data.industry)}
        {renderField('Año de Fundación', data.foundedYear?.toString())}
        {renderField('Ubicación', data.location)}
      </fieldset>

      <fieldset disabled>
        <legend>Información del Fundador</legend>
        {renderField('Nombre del Fundador', data.founderName)}
        {renderField('Email', data.founderEmail)}
        {renderField('Teléfono', data.founderPhone)}
      </fieldset>

      <fieldset disabled>
        <legend>Detalles del Proyecto</legend>
        {renderField('Descripción', data.description, true)}
        {renderField('Sitio Web', data.website)}
        {renderField('Redes Sociales', data.socialMedia)}
        {renderField('Etapa de Inversión', data.investmentStage)}
        {renderField('Tamaño del Equipo', data.teamSize)}
      </fieldset>

      <fieldset disabled>
        <legend>Información Adicional</legend>
        {renderField('Estado', data.status)}
        {renderField('Vistas', data.views?.toString())}
        {renderField('Likes', data.likes?.toString())}
        {renderField('Creado', new Date(data.createdAt).toLocaleString())}
      </fieldset>
    </div>
  );

  const renderJob = () => (
    <div className="readonly-form">
      <h2>🎯 Oferta de Empleo (Solo Lectura)</h2>
      
      <fieldset disabled>
        <legend>Información de la Posición</legend>
        {renderField('Posición', data.position)}
        {renderField('Empresa', data.company)}
        {renderField('Ubicación', data.location)}
        {renderField('Tipo de Contrato', data.contractType)}
      </fieldset>

      <fieldset disabled>
        <legend>Detalles de la Oferta</legend>
        {renderField('Descripción', data.description, true)}
        {renderField('Requisitos', data.requirements, true)}
        {renderField('Salario', data.salary)}
        {renderField('Nivel de Experiencia', data.experienceLevel)}
      </fieldset>

      <fieldset disabled>
        <legend>Información de Contacto</legend>
        {renderField('Email de Contacto', data.contactEmail)}
        {renderField('Teléfono', data.contactPhone)}
      </fieldset>

      <fieldset disabled>
        <legend>Información Adicional</legend>
        {renderField('Estado', data.status)}
        {renderField('Vistas', data.views?.toString())}
        {renderField('Aplicaciones', data.applications?.toString())}
        {renderField('Creado', new Date(data.createdAt).toLocaleString())}
      </fieldset>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'agreement':
        return renderAgreement();
      case 'venture':
        return renderVenture();
      case 'job':
        return renderJob();
      default:
        return <p>Tipo de documento no reconocido</p>;
    }
  };

  return (
    <div className="readonly-modal-overlay" onClick={onClose}>
      <div className="readonly-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="readonly-modal-header">
          <h1>👁️ Visualización Solo Lectura</h1>
          <button 
            className="readonly-modal-close"
            onClick={onClose}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="readonly-modal-content">
          {renderContent()}
        </div>

        <div className="readonly-modal-footer">
          <p className="info-message">ℹ️ Este formulario está en modo solo lectura. No puedes hacer cambios.</p>
          <button 
            className="btn-close-modal"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlyModal;
