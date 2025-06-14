// src/utils/axiosInstance.js
import axios from "axios";
import { API_URL } from "./api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
