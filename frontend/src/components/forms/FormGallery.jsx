import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VenturesForm from './VenturesForm';
import JobsForm from './JobsForm';
import AgreementsForm from './AgreementsForm';
import './FormGallery.css';

const FormGallery = () => {
  const navigate = useNavigate();

  return (
    <div className="form-gallery-container">
      <div className="gallery-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/')}
          title="Volver al inicio"
        >
          ← Volver
        </button>
        <h1>Formularios de Registro</h1>
        <p>Completa cualquiera de estos formularios para registrarte</p>
      </div>

      <div className="forms-grid">
        <div className="form-column">
          <VenturesForm />
        </div>
        <div className="form-column">
          <JobsForm />
        </div>
        <div className="form-column">
          <AgreementsForm />
        </div>
      </div>
    </div>
  );
};

export default FormGallery;
