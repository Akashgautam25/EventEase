// Environment-based configuration
const config = {
  // API Base URL - uses environment variable or falls back to local development
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Google OAuth URL - dynamically constructed
  get GOOGLE_AUTH_URL() {
    const baseUrl = this.API_BASE_URL.replace('/api', '');
    return `${baseUrl}/api/auth/google`;
  },
  
  // App environment
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

export default config;