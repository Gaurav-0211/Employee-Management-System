// src/api.js
import axios from "axios";
import { getToken, logout, setToken } from "./utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true, // sends refreshToken cookie
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 and refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:8081/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data.accessToken;
        setToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
