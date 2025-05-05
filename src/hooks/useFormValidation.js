import { useState } from 'react';
import { VALIDATION } from '../constants';

const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fieldValues = values) => {
    const newErrors = { ...errors };
    
    Object.keys(fieldValues).forEach(field => {
      if (validationRules[field]) {
        const fieldRules = validationRules[field];
        
        // Required validation
        if (fieldRules.required && !fieldValues[field]) {
          newErrors[field] = fieldRules.message || VALIDATION.REQUIRED;
        }
        
        // Email validation
        if (fieldRules.email && fieldValues[field] && !/\S+@\S+\.\S+/.test(fieldValues[field])) {
          newErrors[field] = fieldRules.message || VALIDATION.EMAIL;
        }
        
        // Min length validation
        if (fieldRules.minLength && fieldValues[field] && fieldValues[field].length < fieldRules.minLength) {
          newErrors[field] = fieldRules.message || `Must be at least ${fieldRules.minLength} characters`;
        }
        
        // Match validation
        if (fieldRules.match && fieldValues[field] !== values[fieldRules.match]) {
          newErrors[field] = fieldRules.message || VALIDATION.PASSWORD_MATCH;
        }
        
        // Pattern validation
        if (fieldRules.pattern && fieldValues[field] && !fieldRules.pattern.test(fieldValues[field])) {
          newErrors[field] = fieldRules.message || 'Invalid format';
        }
        
        // Custom validation
        if (fieldRules.custom && typeof fieldRules.custom === 'function') {
          const customError = fieldRules.custom(fieldValues[field], values);
          if (customError) {
            newErrors[field] = customError;
          }
        }
        
        // If validation passes, remove the error
        if (fieldValues[field] && !newErrors[field]) {
          delete newErrors[field];
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    if (touched[name]) {
      validate({ [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validate({ [name]: values[name] });
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(values).forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);
    
    const isValid = validate();
    if (isValid) {
      callback(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
};

export default useFormValidation;