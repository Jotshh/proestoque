import { useAuth } from "@/src/contexts/AuthContext";
import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useProducts, type Produto } from "@/src/contexts/ProductsContext";
import { LoadingView } from "@/src/components/LoadingView";
import { formatarPreco } from "@/src/utils/formatters";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";

  const getStatusStyle = (item: Produto) => {
  const semEstoque = Number(item.quantidade ?? 0) === 0;
  const emAlerta = !semEstoque && Number(item.quantidade ?? 0) < Number(item.quantidadeMinima ?? 0);

  if (semEstoque) {
    return { label: "Sem estoque", bg: Colors.danger.bg, text: Colors.danger.text };
  }

  if (emAlerta) {
    return { label: "Baixo", bg: Colors.warning.bg, text: Colors.warning.text };
  }

  return { label: "Normal", bg: Colors.success.bg, text: Colors.success.text };
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { produtos, isLoading, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  // Cálculos derivados — useMemo para não recalcular a cada re-render
  const alertas = useMemo(
    () => produtos.filter(p => Number(p.quantidade ?? 0) < Number(p.quantidadeMinima ?? 0)),
    [produtos]
  );

  const valorTotalEstoque = useMemo(
    () => produtos.reduce((acc, p) => acc + Number(p.quantidade ?? 0) * Number(p.preco ?? 0), 0),
    [produtos]
  );

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const cardsResumo = useMemo(() => [
    { id: "total",      titulo: "Produtos",       valor: produtos.length,              icone: "cube-outline" as const },
    { id: "alertas",    titulo: "Alertas",         valor: alertas.length,               icone: "alert-circle-outline" as const },
    { id: "valor",      titulo: "Valor em estoque", valor: formatarPreco(valorTotalEstoque), icone: "cash-outline" as const },
  ], [produtos.length, alertas.length, valorTotalEstoque]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  const renderItem = useCallback(({ item }: { item: Produto }) => {
    const status = getStatusStyle(item);

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <View style={styles.productIconContainer}>
            <Ionicons name="cube-outline" size={20} color={Colors.primary[600]} />
          </View>
          <View style={styles.productTextContainer}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productMeta}>{item.quantidade} {item.unidade} • {formatarPreco(item.preco)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.bg }]}> 
          <Text style={[styles.statusLabel, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>
    );
  }, []);

  if (isLoading && produtos.length === 0) {
    return <LoadingView mensagem="Carregando dashboard..." />;
  }

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.greeting}>{saudacao}, {user?.nome?.split(" ")[0]} 👋</Text>
          <Text style={styles.subtitle}>Visão geral do estoque em tempo real.</Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map((card) => (
          <View key={card.id} style={styles.cardResumo}>
            <View style={styles.cardIconWrapper}>
              <Ionicons name={card.icone} size={20} color={Colors.primary[600]} />
            </View>
            <Text style={styles.cardValue}>{card.valor}</Text>
            <Text style={styles.cardLabel}>{card.titulo}</Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>⚠️ Estoque crítico ({alertas.length})</Text>
          {alertas.slice(0, 3).map(p => (
            <View key={p.id} style={styles.alertItem}>
              <Text style={styles.alertName}>{p.nome}</Text>
              <Text style={styles.alertSubtitle}>{p.quantidade}/{p.quantidadeMinima} {p.unidade}</Text>
            </View>
          ))}
          <Text style={styles.alertLink}>Verificar estoque</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={DashboardHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  headerContainer: {
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[4],
  },
  greeting: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing[1],
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.md,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  cardResumo: {
    width: "48%",
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[3],
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },
  cardValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  cardLabel: {
    marginTop: Spacing[1],
    color: Colors.textSecondary,
  },
  alertContainer: {
    backgroundColor: Colors.danger.bg,
    borderRadius: Radius.lg,
    borderColor: Colors.danger.border,
    borderWidth: 1,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  alertTitle: {
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.danger.text,
    marginBottom: Spacing[3],
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },
  alertName: {
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  alertSubtitle: {
    color: Colors.textSecondary,
  },
  alertLink: {
    marginTop: Spacing[2],
    color: Colors.primary[700],
    fontWeight: Typography.fontWeight.medium,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3],
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  productMeta: {
    marginTop: Spacing[1],
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});
