import { useEffect, useState } from 'react';
import { API_CONFIG } from '../../config/constants';

const BackendMonitor = () => {
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          setIsBackendDown(false);
          setRetryCount(0);
        } else {
          setIsBackendDown(true);
        }
      } catch (err) {
        console.warn('Backend health check failed:', err.message);
        setIsBackendDown(true);
      }
    };

    // Verificar cada 10 segundos
    const healthCheckInterval = setInterval(checkBackendHealth, 10000);
    
    // Verificación inicial inmediata
    checkBackendHealth();

    return () => clearInterval(healthCheckInterval);
  }, []);

  useEffect(() => {
    if (isBackendDown) {
      setRetryCount(prev => prev + 1);
      
      // Si el backend está caído y ya pasaron 3 intentos, mostrar overlay
      if (retryCount >= 3) {
        // El backend está caído hace tiempo, esperar a que vuelva
      }
    }
  }, [isBackendDown, retryCount]);

  if (!isBackendDown) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      color: 'white',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        maxWidth: '500px',
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 20px 0' }}>⏳ Backend Caído</h1>
        <p style={{ fontSize: '1.1rem', margin: '0 0 30px 0', lineHeight: '1.6' }}>
          El servidor backend no está disponible en este momento. 
          <br />La aplicación está esperando a que se reconecte...
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '30px',
        }}>
          <div style={{
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: '#ff6b6b',
            animation: 'pulse 1s infinite',
          }}></div>
          <span>Intentando reconectar...</span>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🔄 Reintentar Ahora
        </button>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BackendMonitor;
