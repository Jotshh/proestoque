// Este arquivo pode ser tanto novo.tsx quanto [id].tsx
// A diferença é só se o parâmetro 'id' existe na rota

import { useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { useProducts } from "@/src/contexts/ProductsContext";
import { CATEGORIAS_MOCK } from "@/src/data/mockData";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { Colors, Spacing } from "@/src/constants/theme";

export default function FormularioProduto() {
  // Se vier de [id].tsx, o id está na rota; se vier de novo.tsx, id é undefined
  const { id } = useLocalSearchParams<{ id?: string }>();
  const modoEdicao = !!id;

  const { adicionarProduto, editarProduto, deletarProduto, getProdutoById } = useProducts();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProdutoFormData>({
      resolver: zodResolver(produtoSchema),
      defaultValues: {
        nome: "", categoriaId: "", quantidade: 0,
        quantidadeMinima: 0, preco: 0, unidade: "un", observacao: "",
      },
    });

  // Modo edição: preenche os campos ao montar
  useEffect(() => {
    if (modoEdicao && id) {
      const produto = getProdutoById(id);
      if (produto) {
        reset({
          nome: produto.nome,
          categoriaId: produto.categoriaId,
          quantidade: produto.quantidade,
          quantidadeMinima: produto.quantidadeMinima,
          preco: produto.preco,
          unidade: produto.unidade as ProdutoFormData["unidade"],
          observacao: produto.observacao ?? "",
        });
      }
    }
  }, [id]);

  const onSubmit = async (data: ProdutoFormData) => {
    if (modoEdicao && id) {
      await editarProduto(id, data);
    } else {
      await adicionarProduto(data);
    }
    router.back(); // Volta para a lista após salvar
  };

  const handleDeletar = () => {
    Alert.alert(
      "Excluir produto",
      "Esta ação não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (id) await deletarProduto(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">

      {/* Campo: Nome */}
      <Controller control={control} name="nome"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Nome do produto *" value={value} onChangeText={onChange}
            onBlur={onBlur} error={errors.nome?.message}
            autoCapitalize="sentences" returnKeyType="next" />
        )}
      />

      {/* Campo: Quantidade */}
      <Controller control={control} name="quantidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Quantidade em estoque *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur} error={errors.quantidade?.message}
            keyboardType="numeric" returnKeyType="next" />
        )}
      />

      {/* Campo: Quantidade Mínima */}
      <Controller control={control} name="quantidadeMinima"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Quantidade mínima (alerta) *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur} error={errors.quantidadeMinima?.message}
            keyboardType="numeric" returnKeyType="next"
            hint="Abaixo desse valor, aparece o alerta de estoque baixo" />
        )}
      />

      {/* Campo: Preço */}
      <Controller control={control} name="preco"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Preço (R$) *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t.replace(",", ".")))}
            onBlur={onBlur} error={errors.preco?.message}
            keyboardType="decimal-pad" returnKeyType="next" />
        )}
      />

      {/* Campo: Observação */}
      <Controller control={control} name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Observação (opcional)" value={value ?? ""}
            onChangeText={onChange} onBlur={onBlur}
            error={errors.observacao?.message}
            returnKeyType="done" onSubmitEditing={handleSubmit(onSubmit)} />
        )}
      />

      {/* Botão Salvar */}
      <Button label={modoEdicao ? "Salvar alterações" : "Cadastrar produto"}
        onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />

      {/* Botão Excluir (só no modo edição) */}
      {modoEdicao && (
        <Button label="Excluir produto" onPress={handleDeletar}
          variant="danger" fullWidth />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[6], gap: Spacing[1], paddingBottom: Spacing[10] },
});