// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const getPasswordStrength = (password) => {
  if (password.length < 6) return { strength: 'weak', message: 'Password too short' };
  if (password.length < 8) return { strength: 'medium', message: 'Good password' };
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { strength: 'strong', message: 'Strong password' };
  }
  return { strength: 'medium', message: 'Good password' };
};

export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};