export type Categoria = {
  id: string;
  nome: string;
  icone: string; 
  cor: string;   
};

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  quantidade: number;
  quantidadeMinima: number; 
  preco: number;
  unidade: string;         
  ultimaMovimentacao: string;
};

export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  observacao?: string;
};