import axios from "axios";

// Replace this with your deployed backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "https://your-backend-domain.com/api";

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
