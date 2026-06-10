import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = __DEV__
  ? "http://10.220.1.53:3333/api"  
  : "https://proestoque-api.onrender.com/api"; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o servidor retornou 401, o token expirou → redirecionar para login
    if (error.response?.status === 401) {
      // Emitir um evento ou setar um estado global de "sessão expirada"
      // Implementar na próxima aula (integração completa)
    }
    return Promise.reject(error);
  }
);