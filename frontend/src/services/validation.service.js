/**
 * Servicio centralizado de validación
 * Previene errores comunes de validación de formularios
 */

const validationRules = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Email inválido';
  },

  phone: (value) => {
    const regex = /^[\d\s\-+()]+$/;
    return regex.test(value) && value.length >= 7 ? null : 'Teléfono inválido';
  },

  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'URL inválida';
    }
  },

  required: (value) => {
    return value && value.trim() ? null : 'Este campo es requerido';
  },

  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Mínimo ${min} caracteres`;
  },

  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `Máximo ${max} caracteres`;
  },

  number: (value) => {
    return !isNaN(value) && value !== '' ? null : 'Debe ser un número';
  },

  positiveNumber: (value) => {
    return !isNaN(value) && parseFloat(value) > 0 ? null : 'Debe ser un número positivo';
  },

  date: (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : 'Fecha inválida';
  },

  futureDate: (value) => {
    const date = new Date(value);
    return date > new Date() ? null : 'La fecha debe ser en el futuro';
  },
};

export const validateField = (value, rule) => {
  if (typeof rule === 'function') {
    return rule(value);
  }
  return null;
};

export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const rules = schema[field];
    const value = formData[field];

    if (Array.isArray(rules)) {
      for (const rule of rules) {
        const error = validateField(value, rule);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else {
      const error = validateField(value, rules);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validationRules;
