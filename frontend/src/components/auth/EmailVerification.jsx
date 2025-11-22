import React, { useState } from 'react';
import './EmailVerification.css';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // success, error, info

  // Verificar email con token (desde URL)
  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/verification/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('✅ ' + data.message);
      } else {
        setMessageType('error');
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessageType('error');
      setMessage('❌ Error al verificar el email');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar email de verificación
  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessageType('error');
      setMessage('Por favor ingresa tu email');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const response = await fetch('/api/verification/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('✅ Email de verificación enviado. Revisa tu bandeja de entrada.');
        setEmail('');
      } else {
        setMessageType('error');
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessageType('error');
      setMessage('❌ Error al enviar el email de verificación');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si hay token en la URL al cargar el componente
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      verifyEmail(token);
    }
  }, []);

  return (
    <div className="email-verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h1>📧 Verificación de Email</h1>
        </div>

        {message && (
          <div className={`verification-message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="verification-content">
          <p>
            Si no has recibido el email de verificación, puedes solicitar uno nuevo ingresando tu dirección de correo.
          </p>

          <form onSubmit={handleResendVerification} className="resend-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="resend-button"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Reenviar Email de Verificación'}
            </button>
          </form>

          <div className="verification-info">
            <h3>📌 Información importante:</h3>
            <ul>
              <li>El enlace de verificación expira en 24 horas</li>
              <li>Revisa tu carpeta de spam si no ves el email</li>
              <li>Solo puedes usar cada enlace una vez</li>
              <li>Puedes solicitar un nuevo email cuando lo necesites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
