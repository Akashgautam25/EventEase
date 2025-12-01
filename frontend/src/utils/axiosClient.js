import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'https://eventease-03az.onrender.com/api',
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('selectedRole');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
