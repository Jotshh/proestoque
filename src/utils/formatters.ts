export const formatarPreco = (valor: number): string => {
  if (isNaN(valor) || valor === null || valor === undefined) return "R$ 0,00";
  return `R$ ${valor.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
};

export const formatarData = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatarQuantidade = (qtd: number, unidade: string) =>
  `${qtd} ${unidade}`;