import { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import { api } from "@/src/services/api";
import type { ProdutoFormData } from "@/src/schemas/produtoSchema";

// ── Tipos ────────────────────────────────────────────────────
export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  categoriaId: string;
  categoria?: { id: string; nome: string; icone: string; cor: string };
  ultimaMovimentacao: string;
  criadoEm: string;
};

type ProductsState = { produtos: Produto[]; isLoading: boolean; error: string | null };
type ProductsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Produto[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

// ── Reducer ──────────────────────────────────────────────────
function reducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { produtos: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case "UPDATE":
      return { ...state, produtos: state.produtos.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE":
      return { ...state, produtos: state.produtos.filter(p => p.id !== action.payload) };
    default: return state;
  }
}

// ── Context + Provider ───────────────────────────────────────
const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    produtos: [],
    isLoading: false,
    error: null,
  });

  // ── Carregar produtos da API ─────────────────────────────
  const carregarProdutos = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const { data } = await api.get<Produto[]>("/produtos");
      // Normaliza campos numéricos que podem vir como string/null do backend
      const normalized = data.map((p) => ({
        ...p,
        quantidade: Number(p.quantidade ?? 0),
        quantidadeMinima: Number(p.quantidadeMinima ?? 0),
        preco: Number(p.preco ?? 0),
      }));
      dispatch({ type: "LOAD_SUCCESS", payload: normalized });
    } catch (error: any) {
      dispatch({ type: "LOAD_ERROR", payload: error.message });
    }
  }, []);

  // Carrega ao montar — o JWT já está no interceptor
  useEffect(() => { carregarProdutos(); }, [carregarProdutos]);

  // ── Criar ────────────────────────────────────────────────
  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const { data: novo } = await api.post<Produto>("/produtos", data);
    const normalized = {
      ...novo,
      quantidade: Number(novo.quantidade ?? 0),
      quantidadeMinima: Number(novo.quantidadeMinima ?? 0),
      preco: Number(novo.preco ?? 0),
    };
    dispatch({ type: "ADD", payload: normalized });
    // Sem AsyncStorage — o banco é a fonte da verdade
  }, []);

  // ── Editar ───────────────────────────────────────────────
  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const { data: atualizado } = await api.put<Produto>(`/produtos/${id}`, data);
    const normalized = {
      ...atualizado,
      quantidade: Number(atualizado.quantidade ?? 0),
      quantidadeMinima: Number(atualizado.quantidadeMinima ?? 0),
      preco: Number(atualizado.preco ?? 0),
    };
    dispatch({ type: "UPDATE", payload: normalized });
  }, []);

  // ── Deletar ──────────────────────────────────────────────
  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find(p => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider value={{
      produtos: state.produtos,
      isLoading: state.isLoading,
      error: state.error,
      carregarProdutos,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return ctx;
}