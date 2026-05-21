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
  observacao?: string;
};

export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: "entrada" | "saida";
  quantidade: number;
  data: string;
  observacao?: string;
};

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: "cat_1", nome: "Bebidas",      icone: "cafe-outline",        cor: "#7c3aed" },
  { id: "cat_2", nome: "Alimentos",    icone: "fast-food-outline",   cor: "#059669" },
  { id: "cat_3", nome: "Limpeza",      icone: "sparkles-outline",    cor: "#0284c7" },
  { id: "cat_4", nome: "Eletrônicos",  icone: "hardware-chip-outline",cor: "#d97706" },
  { id: "cat_5", nome: "Papelaria",    icone: "document-outline",    cor: "#db2777" },
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: "prod_1",
    nome: "Café Especial 250g",
    categoriaId: "cat_1",
    quantidade: 4,
    quantidadeMinima: 10,
    preco: 32.90,
    unidade: "un",
    ultimaMovimentacao: "2024-11-14T10:30:00Z",
  },
  {
    id: "prod_2",
    nome: "Água Mineral 500ml",
    categoriaId: "cat_1",
    quantidade: 48,
    quantidadeMinima: 24,
    preco: 2.50,
    unidade: "un",
    ultimaMovimentacao: "2024-11-13T14:20:00Z",
  },
  {
    id: "prod_3",
    nome: "Suco de Laranja 1L",
    categoriaId: "cat_1",
    quantidade: 6,
    quantidadeMinima: 12,
    preco: 8.90,
    unidade: "un",
    ultimaMovimentacao: "2024-11-12T09:15:00Z",
  },
  {
    id: "prod_4",
    nome: "Arroz Branco 5kg",
    categoriaId: "cat_2",
    quantidade: 15,
    quantidadeMinima: 5,
    preco: 28.00,
    unidade: "cx",
    ultimaMovimentacao: "2024-11-11T16:45:00Z",
  },
  {
    id: "prod_5",
    nome: "Feijão Carioca 1kg",
    categoriaId: "cat_2",
    quantidade: 3,
    quantidadeMinima: 8,
    preco: 9.50,
    unidade: "un",
    ultimaMovimentacao: "2024-11-10T11:00:00Z",
  },
  {
    id: "prod_6",
    nome: "Azeite Extra Virgem",
    categoriaId: "cat_2",
    quantidade: 2,
    quantidadeMinima: 5,
    preco: 45.00,
    unidade: "un",
    ultimaMovimentacao: "2024-11-09T08:30:00Z",
  },
  {
    id: "prod_7",
    nome: "Detergente 500ml",
    categoriaId: "cat_3",
    quantidade: 22,
    quantidadeMinima: 10,
    preco: 3.99,
    unidade: "un",
    ultimaMovimentacao: "2024-11-08T13:20:00Z",
  },
  {
    id: "prod_8",
    nome: "Sabão em Pó 3kg",
    categoriaId: "cat_3",
    quantidade: 0,
    quantidadeMinima: 4,
    preco: 24.90,
    unidade: "cx",
    ultimaMovimentacao: "2024-11-07T10:10:00Z",
  },
  {
    id: "prod_9",
    nome: "Cabo USB-C 1m",
    categoriaId: "cat_4",
    quantidade: 12,
    quantidadeMinima: 5,
    preco: 29.90,
    unidade: "un",
    ultimaMovimentacao: "2024-11-06T15:00:00Z",
  },
  {
    id: "prod_10",
    nome: "Caneta Esferográfica",
    categoriaId: "cat_5",
    quantidade: 1,
    quantidadeMinima: 20,
    preco: 1.50,
    unidade: "cx",
    ultimaMovimentacao: "2024-11-05T09:45:00Z",
  },
];

export const MOVIMENTACOES_MOCK: Movimentacao[] = [
  { id: "mov_1", produtoId: "prod_2", tipo: "entrada", quantidade: 24, data: "2024-11-13T14:20:00Z", observacao: "Reposição semanal" },
  { id: "mov_2", produtoId: "prod_1", tipo: "saida",   quantidade: 6,  data: "2024-11-14T10:30:00Z" },
  { id: "mov_3", produtoId: "prod_8", tipo: "saida",   quantidade: 4,  data: "2024-11-07T10:10:00Z", observacao: "Fim do estoque" },
  { id: "mov_4", produtoId: "prod_4", tipo: "entrada", quantidade: 10, data: "2024-11-11T16:45:00Z" },
  { id: "mov_5", produtoId: "prod_5", tipo: "saida",   quantidade: 5,  data: "2024-11-10T11:00:00Z" },
];

export const getProdutosComEstoqueBaixo = () =>
  PRODUTOS_MOCK.filter((p) => p.quantidade < p.quantidadeMinima);

export const getValorTotalEstoque = () =>
  PRODUTOS_MOCK.reduce((acc, p) => acc + p.quantidade * p.preco, 0);

export const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
