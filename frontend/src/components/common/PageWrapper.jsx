import { useNavigate } from 'react-router-dom';
import './PageWrapper.css';

const PageWrapper = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
