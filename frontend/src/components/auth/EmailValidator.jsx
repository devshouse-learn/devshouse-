import React, { useState } from 'react';
import './EmailValidator.css';

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const validateEmail = async () => {
    if (!email) return;

    setValidating(true);
    setResult(null);
    setSuggestions([]);

    try {
      // Validación completa
      const response = await fetch('/api/email-validation/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);

        // Si no es válido, obtener sugerencias
        if (!data.data.valid) {
          const suggestResponse = await fetch('/api/email-validation/suggest-correction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          const suggestData = await suggestResponse.json();
          if (suggestData.success && suggestData.data.suggestions.length > 0) {
            setSuggestions(suggestData.data.suggestions);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        valid: false,
        errors: ['Error al validar el email'],
      });
    } finally {
      setValidating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateEmail();
    }
  };

  const applySuggestion = (suggestedEmail) => {
    setEmail(suggestedEmail);
    setSuggestions([]);
    setResult(null);
  };

  return (
    <div className="email-validator-container">
      <div className="validator-card">
        <h2> Validador de Email</h2>
        <p className="validator-description">
          Verifica que tu email sea real y esté correctamente configurado
        </p>

        <div className="validator-input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ejemplo@gmail.com"
            disabled={validating}
            className="validator-input"
          />
          <button
            onClick={validateEmail}
            disabled={!email || validating}
            className="validator-button"
          >
            {validating ? 'Validando...' : 'Validar'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-box">
            <p className="suggestions-title">¿Quisiste decir?</p>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => applySuggestion(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {result && (
          <div className={`result-box ${result.valid ? 'valid' : 'invalid'}`}>
            <div className="result-header">
              <span className="result-icon">
                {result.valid ? '' : ''}
              </span>
              <h3>
                {result.valid ? 'Email Válido' : 'Email No Válido'}
              </h3>
            </div>

            {/* Checks */}
            <div className="checks-container">
              <div className={`check-item ${result.checks.format ? 'pass' : 'fail'}`}>
                <span className="check-icon">
                  {result.checks.format ? '' : ''}
                </span>
                <span>Formato correcto</span>
              </div>

              <div className={`check-item ${result.checks.disposable ? 'pass' : 'fail'}`}>
                <span className="check-icon">
                  {result.checks.disposable ? '' : ''}
                </span>
                <span>No es email desechable</span>
              </div>

              <div className={`check-item ${result.checks.mxRecords ? 'pass' : 'fail'}`}>
                <span className="check-icon">
                  {result.checks.mxRecords ? '' : ''}
                </span>
                <span>Servidor de correo válido</span>
              </div>

              {result.checks.smtpServer !== undefined && (
                <div className={`check-item ${result.checks.smtpServer ? 'pass' : 'fail'}`}>
                  <span className="check-icon">
                    {result.checks.smtpServer ? '' : ''}
                  </span>
                  <span>Servidor SMTP activo</span>
                </div>
              )}
            </div>

            {/* Details */}
            {result.details && (
              <div className="details-container">
                {result.details.domain && (
                  <div className="detail-item">
                    <strong>Dominio:</strong> {result.details.domain}
                  </div>
                )}

                {result.details.trusted !== undefined && (
                  <div className="detail-item">
                    <strong>Proveedor confiable:</strong>{' '}
                    {result.details.trusted ? 'Sí' : 'No'}
                  </div>
                )}

                {result.details.mxRecords?.primaryMX && (
                  <div className="detail-item">
                    <strong>Servidor principal:</strong>{' '}
                    {result.details.mxRecords.primaryMX}
                  </div>
                )}
              </div>
            )}

            {/* Errors */}
            {result.errors && result.errors.length > 0 && (
              <div className="errors-container">
                <strong>Problemas encontrados:</strong>
                <ul>
                  {result.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="validator-info">
          <h4> ¿Qué verificamos?</h4>
          <ul>
            <li> Formato válido del email</li>
            <li> No es un email temporal o desechable</li>
            <li> El dominio existe y tiene servidor de correo</li>
            <li> El servidor de correo está activo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailValidator;
