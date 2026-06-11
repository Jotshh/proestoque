import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { api } from "@/src/services/api";

type User = { 
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEYS = {
  TOKEN: "@proestoque:token",
  USER:  "@proestoque:user",
} as const;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [token, setToken]       = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [tokenSalvo, userString] = await AsyncStorage.multiGet([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER,
        ]);

        const token = tokenSalvo[1]; 
        const user  = userString[1] ? JSON.parse(userString[1]) : null;

        if (token && user) {
          setToken(token);
          setUser(user);
        }
      } catch (error) {
        console.warn("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarSessao();
  }, []);

  const salvarSessao = useCallback(async (token: string, user: User) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.USER, JSON.stringify(user)],
    ]);
    setToken(token);
    setUser(user);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, senha });
      // data = { usuario: {...}, token: "eyJ..." }
      await salvarSessao(data.token, data.usuario);
    } finally {
      setIsLoading(false);
    }
    // Se a API retornar erro, o interceptor já formatou a mensagem.
    // O componente de login deve fazer try/catch e exibir o Alert.
  }, [salvarSessao]);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/registro", { nome, email, senha });
      await salvarSessao(data.token, data.usuario);
    } finally {
      setIsLoading(false);
    }
  }, [salvarSessao]);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!token,
      login, registrar, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}