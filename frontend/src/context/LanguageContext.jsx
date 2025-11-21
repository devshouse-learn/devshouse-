import { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../config/translations-extended';

const LanguageContext = createContext(null);

// Códigos de idiomas soportados
const VALID_LANGUAGES = SUPPORTED_LANGUAGES.map(lang => lang.code);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  // Cargar idioma desde localStorage al montar
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && VALID_LANGUAGES.includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (VALID_LANGUAGES.includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const value = {
    language,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de LanguageProvider');
  }
  return context;
};
