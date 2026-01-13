import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // No mostrar el botón solo en la página de inicio exacta sin secciones específicas
  if (location.pathname === '/' && !location.search) {
    return null;
  }

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button className="back-button-floating" onClick={handleClick}>
      Volver
    </button>
  );
};

export default BackButton;
