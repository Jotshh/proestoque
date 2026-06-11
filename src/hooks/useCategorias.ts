import { useState, useEffect } from "react";
import { api } from "@/src/services/api";

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<Categoria[]>("/categorias")
      .then(({ data }) => setCategorias(data))
      .catch(() => {}) 
      .finally(() => setIsLoading(false));
  }, []);

  return { categorias, isLoading };
}