import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL = __DEV__
  ? "http://10.220.1.227:3333/api"  
  : "https://proestoque-api.onrender.com/api"; 

const API_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? "http://localhost:3333/api";

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
  (response) => response, // Sucesso: passa direto

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado ou inválido → limpa sessão e força re-login
      await AsyncStorage.multiRemove(["@proestoque:token", "@proestoque:user"]);
      // O NavigationGuard vai detectar isAuthenticated = false e redirecionar
    }

    // Extrai a mensagem de erro do backend (se existir) ou usa mensagem genérica
    const mensagem =
      error.response?.data?.erro ??
      (error.code === "ECONNABORTED" ? "Tempo de conexão esgotado" : "Erro de conexão");

    // Rejeita com o erro enriquecido
    return Promise.reject(new Error(mensagem));
  }
);