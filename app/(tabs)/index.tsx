import { useAuth } from "@/src/contexts/AuthContext";
import { useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  PRODUTOS_MOCK,
  CATEGORIAS_MOCK,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque, 
  formatarPreco,
  type Produto,
} from "@/src/data/mockData";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";

const getStatusStyle = (item: Produto) => {
  const semEstoque = item.quantidade === 0;
  const emAlerta = !semEstoque && item.quantidade < item.quantidadeMinima;

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
  const [refreshing, setRefreshing] = useState(false);
  
  const alertas = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotal = useMemo(() => getValorTotalEstoque(), []);

  const hoje = useMemo(
    () =>
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }),
    []
  );

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const cardsResumo = useMemo(
    () => [
      {
        id: "total",
        titulo: "Produtos",
        valor: PRODUTOS_MOCK.length,
        icone: "📦",
        backgroundColor: Colors.surface,     
      },
      {
        id: "alertas",
        titulo: "Alertas",
        valor: alertas.length,
        icone: "⚠️",
        backgroundColor: Colors.warning.bg,
      },
      {
        id: "categorias",
        titulo: "Categorias",
        valor: CATEGORIAS_MOCK.length,
        icone: "🗂️",
        backgroundColor: Colors.surface,
      },
      {
        id: "valor",
        titulo: "Em Estoque",
        valor: formatarPreco(valorTotal),
        icone: "💰",
        backgroundColor: Colors.success.bg,
      },
    ],
    [alertas.length, valorTotal]
  );

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.greeting}>{saudacao}, {user?.nome?.split(" ")[0]} 👋</Text>
          <Text style={styles.subtitle}>Visão geral do estoque · {hoje}</Text>
        </View>

        <Ionicons
          name="add-circle-outline"
          size={28}
          color={Colors.primary[700]}
          onPress={() => router.push("/(tabs)/produtos")}
        />
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map((card) => (
          <View key={card.id} style={[styles.cardResumo, { backgroundColor: card.backgroundColor }]}>
            <View style={styles.cardIconWrapper}>
              <Text style={{ fontSize: 20 }}>{card.icone}</Text>
            </View>
            <Text style={styles.cardValue}>{card.valor}</Text>
            <Text style={styles.cardLabel}>{card.titulo}</Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>⚠️ Estoque crítico ({alertas.length})</Text>
          {alertas.slice(0, 3).map((produto) => (
            <View key={produto.id} style={styles.alertItem}>
              <Text style={styles.alertName}>{produto.nome}</Text>
              <Text style={styles.alertSubtitle}>
                {produto.quantidade} / {produto.quantidadeMinima} {produto.unidade}
              </Text>
            </View>
          ))}
          {alertas.length > 3 && <Text style={styles.alertLink}>Ver todos os {alertas.length} alertas →</Text>}
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    const status = getStatusStyle(item);

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <View style={styles.productIconContainer}>
            <Text style={{ fontSize: 18 }}>📦</Text>
          </View>
          <View style={styles.productTextContainer}>
            <Text style={styles.productName}>{item.nome}</Text>
            <Text style={styles.productMeta}>{item.quantidade} {item.unidade}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.bg }]}> 
          <Text style={[styles.statusLabel, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <FlatList<Produto>
        data={PRODUTOS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[700]} />
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
