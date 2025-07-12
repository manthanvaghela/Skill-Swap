import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true,  // Send cookies (e.g., refresh token) with each request
});

// Add a request interceptor to include the access token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);