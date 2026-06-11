import { useEffect } from "react";
import { View, ScrollView, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { useProducts } from "@/src/contexts/ProductsContext";
import { useCategorias } from "@/src/hooks/useCategorias";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { Colors, Spacing, Typography, Radius } from "@/src/constants/theme";

const UNIDADES = [
  { value: "un", label: "Unidade" },
  { value: "kg", label: "Kg" },
  { value: "cx", label: "Caixa" },
  { value: "L", label: "Litro" },
  { value: "m", label: "Metro" },
] as const;

function SeletorCategoria({ control, error }: { control: any; error?: string }) {
  const { categorias, isLoading } = useCategorias();

  return (
    <Controller
      control={control}
      name="categoriaId"
      render={({ field: { value, onChange } }) => (
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Categoria *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.row}>
              {categorias.map((cat) => {
                const selected = value === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => onChange(cat.id)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {cat.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          {isLoading && <Text style={styles.helperText}>Carregando categorias...</Text>}
          {!isLoading && categorias.length === 0 && (
            <Text style={styles.helperText}>Nenhuma categoria disponível.</Text>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    />
  );
}
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
    try {
      if (modoEdicao && id) {
        await editarProduto(id, data);
      } else {
        await adicionarProduto(data);
      }
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Não foi possível salvar",
        error.message ?? "Verifique sua conexão e tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleDeletar = () => {
    Alert.alert("Excluir produto", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            if (id) await deletarProduto(id);
            router.back();
          } catch (error: any) {
            Alert.alert("Erro ao excluir", error.message ?? "Tente novamente.");
          }
        },
      },
    ]);
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

      {/* Campo: Categoria */}
      <SeletorCategoria control={control} error={errors.categoriaId?.message} />

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

      {/* Campo: Unidade */}
      <Controller control={control} name="unidade"
        render={({ field: { value, onChange } }) => (
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Unidade de medida *</Text>
            <View style={styles.chipsRow}>
              {UNIDADES.map((un) => {
                const selected = value === un.value;
                return (
                  <Pressable key={un.value} onPress={() => onChange(un.value)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {un.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.unidade?.message && (
              <Text style={styles.errorText}>{errors.unidade.message}</Text>
            )}
          </View>
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
  fieldWrapper: { marginBottom: Spacing[4] },
  fieldLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing[2],
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
  },
  row: {
    flexDirection: "row",
    gap: Spacing[2],
  },
  helperText: {
    marginTop: Spacing[2],
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[400],
  },
  chip: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.semibold,
  },
  errorText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
  },
});