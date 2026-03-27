import axios from "axios";
import { clearAuthSession, getStoredToken } from "./auth.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://horse-flow-api-production.up.railway.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Erro na requisicao.";

    if (error.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(new Error(message));
  }
);

export async function request(config) {
  const response = await api(config);
  return response.data;
}
