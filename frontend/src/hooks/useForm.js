import { useState, useCallback } from 'react';
import { validateForm } from '../services/validation.service';

export const useForm = (initialValues, onSubmit, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const validateFormData = useCallback(() => {
    if (Object.keys(validationSchema).length === 0) {
      return true;
    }

    const { isValid, errors: newErrors } = validateForm(values, validationSchema);
    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Marcar todos como touched
    const newTouched = {};
    Object.keys(values).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // Validar
    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Error al enviar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validateFormData]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError('');
    setSubmitSuccess(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    clearFieldError,
    validateFormData,
  };
};

export default useForm;
