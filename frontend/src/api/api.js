import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL === "DEVELOPMENT"
      ? "http://localhost:3000/api"
      : "/api",

  withCredentials: true,
});

let access_token = localStorage.getItem("access_token");

export const setAccessToken = (token) => {
  access_token=token;
  localStorage.setItem("access_token", token);
};

export const clearAccessToken = () => {
  access_token = null;
  localStorage.removeItem("access_token");
};

// Add access token to every request
api.interceptors.request.use((config) => {
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

// Handle expired/missing access token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    // Only try refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Browser automatically sends refresh-token cookie
        const response = await api.post("/auth/refresh");

        const newAccessToken = response.data.ACCESS_TOKEN;

        // Save new access token
        setAccessToken(newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
