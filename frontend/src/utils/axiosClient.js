import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://eventease-03az.onrender.com/api";

console.log('API Base URL:', BASE_URL);

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptors for handling auth errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("User not authenticated. Redirect to login.");
      // You can also do: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
