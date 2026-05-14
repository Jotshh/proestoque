import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//posso colocar esse types no src/types/index.ts ?

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

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!email || !senha) throw new Error("Preencha todos os campos");

      const tokenSimulado = "token_simulado_" + Date.now();
      const userSimulado: User = {
        id: "user_1",
        nome: email.split("@")[0],
        email,
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, tokenSimulado],
        [STORAGE_KEYS.USER, JSON.stringify(userSimulado)],
      ]);

      setToken(tokenSimulado);
      setUser(userSimulado);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}