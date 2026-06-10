import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { PRODUTOS_MOCK, type Produto } from "@/src/data/mockData";
import type { ProdutoFormData } from "@/src/schemas/produtoSchema";
import { api } from "@/src/services/api";

// ── Tipos ────────────────────────────────────────────────────
type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: "LOAD"; payload: Produto[] }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string }; // string = id do produto

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

// ── Reducer ─────────────────────────────────────────────────
// Função PURA: recebe estado atual + ação, retorna NOVO estado
// Nunca modifica o estado diretamente (imutabilidade)
function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD":
      return { ...state, produtos: action.payload, isLoading: false };

    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };

    case "UPDATE":
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE":
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
const ProductsContext = createContext<ProductsContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: true,
  });

  // Carrega produtos do backend na inicialização
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await api.get<Produto[]>("/produtos");
        dispatch({ type: "LOAD", payload: response.data });
      } catch {
        dispatch({ type: "LOAD", payload: PRODUTOS_MOCK });
      }
    }
    carregarProdutos();
  }, []);

  // ── CRUD ─────────────────────────────────────────────────
  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const response = await api.post<Produto>("/produtos", data);
    dispatch({ type: "ADD", payload: response.data });
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const response = await api.put<Produto>(`/produtos/${id}`, data);
    dispatch({ type: "UPDATE", payload: response.data });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((p) => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider value={{
      produtos: state.produtos,
      isLoading: state.isLoading,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ── Hook customizado ─────────────────────────────────────────
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return context;
}