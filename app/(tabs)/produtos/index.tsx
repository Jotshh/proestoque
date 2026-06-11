import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProducts, type Produto } from "@/src/contexts/ProductsContext";
import Input from "@/src/components/Input";
import { Colors, Spacing } from "@/src/constants/theme";
import { useCategorias } from "@/src/hooks/useCategorias";
import { LoadingView } from "@/src/components/LoadingView";
import { ErrorView } from "@/src/components/ErrorView";
import { ProdutoListaSkeleton } from "@/src/components/ProdutoSkeleton";

export default function ListaProdutos() {

  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const { categorias } = useCategorias();
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const categoriaOk = categoriaAtiva ? p.categoriaId === categoriaAtiva : true;
      return buscaOk && categoriaOk;
    });
  }, [produtos, busca, categoriaAtiva]); // ← 'produtos' é a dependência do contexto

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  const renderProduto = useCallback(({ item }: { item: Produto }) => {
    const semEstoque = Number(item.quantidade ?? 0) === 0;
    const emAlerta = !semEstoque && Number(item.quantidade ?? 0) < Number(item.quantidadeMinima ?? 0);

    return (
      // Toque no item → editar
      <TouchableOpacity
        onPress={() => router.push(`/produtos/${item.id}`)}
        style={styles.item}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemQtd}>{item.quantidade} {item.unidade}</Text>
        </View>
        <View style={[
          styles.badge,
          semEstoque ? styles.badgeSemEstoque :
            emAlerta ? styles.badgeAlerta : styles.badgeNormal
        ]}>
          <Text style={styles.badgeText}>
            {semEstoque ? "Sem estoque" : emAlerta ? "Baixo" : "Normal"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [router]);

  // ── Estados de UI ────────────────────────────────────────
  if (isLoading && produtos.length === 0) {

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ProdutoListaSkeleton count={7} />
      </SafeAreaView>
    );
  }

  if (error && produtos.length === 0) {
    // Só mostra erro se não há dados para exibir
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={styles.header}>
            <Input value={busca} onChangeText={setBusca}
              placeholder="Buscar produto..." leftIcon="search-outline"
              autoCapitalize="none" autoCorrect={false} />
            {/* Chips de categoria */}
            <View style={styles.chips}>
              {categorias.map((cat) => (
                <TouchableOpacity key={cat.id}
                  style={[styles.chip, categoriaAtiva === cat.id && styles.chipAtivo]}
                  onPress={() => setCategoriaAtiva(p => p === cat.id ? null : cat.id)}>
                  <Text style={[styles.chipText, categoriaAtiva === cat.id && styles.chipTextoAtivo]}>
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        // Botão flutuante de adicionar
        ListFooterComponent={<View style={{ height: 80 }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="cube-outline" size={48} color={Colors.neutral[400]} />
            <Text style={styles.vazioText}>Nenhum produto encontrado</Text>
            <TouchableOpacity onPress={() => router.push("/produtos/novo")}>
              <Text style={styles.vazioLink}>Cadastrar produto</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing[4] }}
      />

      {/* FAB — Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/produtos/novo")}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: Spacing[4], gap: Spacing[3], marginBottom: Spacing[2] },
  chips: { flexDirection: "row", gap: Spacing[2], flexWrap: "wrap" },
  chip: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: 999, backgroundColor: Colors.neutral[100] },
  chipAtivo: { backgroundColor: Colors.primary[600] },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  chipTextoAtivo: { color: Colors.white },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: Spacing[4], backgroundColor: Colors.surface, borderRadius: 12, marginBottom: Spacing[2], borderWidth: 1, borderColor: Colors.border },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  itemQtd: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeNormal: { backgroundColor: "#d1fae5" },
  badgeAlerta: { backgroundColor: "#fef3c7" },
  badgeSemEstoque: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 11, fontWeight: "600", color: Colors.textPrimary },
  vazio: { alignItems: "center", justifyContent: "center", paddingTop: 80, gap: Spacing[3] },
  vazioText: { color: Colors.textSecondary, fontSize: 16 },
  vazioLink: { color: Colors.primary[600], fontWeight: "600", fontSize: 14 },
  fab: { position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary[600], alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6 },
});