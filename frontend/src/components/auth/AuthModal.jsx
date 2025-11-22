import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/auth.service';
import { translations, SUPPORTED_LANGUAGES } from '../../config/translations';
import './AuthModal.css';

const AuthModal = ({ onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });

  // Escuchar tecla Escape para cerrar
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.login(formData.email, formData.password);
      // Agregar la contraseña al userData para que el contexto pueda guardarla
      userData.password = formData.password;
      login(userData);
      // La modal desaparecerá automáticamente cuando isAuthenticated sea true
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      
      // Si el error es que no está registrado, ofrecer cambiar a registro
      if (errorMessage.includes('no está registrada') || errorMessage.includes('crea una cuenta')) {
        setError(
          <div>
            <p>{errorMessage}</p>
            <button
              type="button"
              className="error-action-button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setFormData({ name: '', email: formData.email, password: '', confirmPassword: '', adminCode: '' });
              }}
            >
              📝 Crear cuenta ahora
            </button>
          </div>
        );
      } else {
        setError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      register(userData);
      // La modal desaparecerá automáticamente cuando isAuthenticated sea true
    } catch (err) {
      const errorMessage = err.message || 'Error al registrarse';
      
      // Si el error es que el correo ya está registrado, ofrecer ir a login
      if (errorMessage.includes('ya está registrado')) {
        setError(
          <div>
            <p>{errorMessage}</p>
            <button
              type="button"
              className="error-action-button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setFormData({ name: '', email: formData.email, password: '', confirmPassword: '', adminCode: '' });
              }}
            >
              🔑 Ir a Iniciar Sesión
            </button>
          </div>
        );
      } else {
        setError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <button 
            className="auth-modal-close" 
            onClick={onClose}
            title="Presiona ESC o haz clic para cerrar"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
          <div className="language-selector-wrapper">
            <select 
              className="language-dropdown"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              title="Selecciona un idioma"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="auth-modal-container">
          {/* Tab de Login */}
          {isLogin ? (
            <div className="auth-form-wrapper">
              <h2>{t('signIn')}</h2>
              <p className="auth-subtitle">{t('welcomeToDevsHouse')}</p>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">{t('password')}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('atLeast6Chars')}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? `${t('signInButton')}...` : t('signInButton')}
                </button>
              </form>

              <div className="auth-divider">
                <span>{t('noAccount')}</span>
              </div>

              <button
                className="auth-toggle-button"
                onClick={() => {
                  setIsLogin(false);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', adminCode: '' });
                  setError('');
                }}
              >
                {t('createAccountLink')}
              </button>
            </div>
          ) : (
            /* Tab de Registro */
            <div className="auth-form-wrapper">
              <h2>{t('createAccount')}</h2>
              <p className="auth-subtitle">{t('welcomeToDevsHouse')}</p>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="name">{t('name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('name')}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Campos de contraseña */}
                <div className="form-group">
                  <label htmlFor="password">{t('password')}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('atLeast6Chars')}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={t('repeatPassword')}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? `${t('registerButton')}...` : t('registerButton')}
                </button>
              </form>

              <div className="auth-divider">
                <span>{t('alreadyHaveAccount')}</span>
              </div>

              <button
                className="auth-toggle-button"
                onClick={() => {
                  setIsLogin(true);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '', adminCode: '' });
                  setError('');
                }}
              >
                {t('signInLink')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
