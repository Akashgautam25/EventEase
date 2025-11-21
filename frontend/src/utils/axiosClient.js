import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  timeout: 5000,
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
