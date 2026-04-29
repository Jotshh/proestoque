import { useState, useMemo, useCallback } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  PRODUTOS_MOCK,
  CATEGORIAS_MOCK,
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

export default function ProdutosScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = PRODUTOS_MOCK;

    if (selectedCategoryId) {
      filtered = filtered.filter((p) => p.categoriaId === selectedCategoryId);
    }

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((p) => p.nome.toLowerCase().includes(searchLower));
    }

    return filtered;
  }, [searchText, selectedCategoryId]);

  const toggleCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    },
    []
  );

  const renderCategoryChip = useCallback(
    (category: typeof CATEGORIAS_MOCK[0]) => {
      const isSelected = selectedCategoryId === category.id;
      return (
        <Pressable
          key={category.id}
          style={[
            styles.categoryChip,
            isSelected && styles.categoryChipActive,
          ]}
          onPress={() => toggleCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryChipText,
              isSelected && styles.categoryChipTextActive,
            ]}
          >
            {category.nome}
          </Text>
        </Pressable>
      );
    },
    [selectedCategoryId, toggleCategory]
  );

  const renderProduct = useCallback(
    ({ item }: { item: Produto }) => {
      const categoryIcon = CATEGORIAS_MOCK.find((c) => c.id === item.categoriaId)?.icone ?? "cube-outline";
      const status = getStatusStyle(item);

      return (
        <View style={styles.productCard}>
          <View style={styles.productLeft}>
            <View style={styles.productIconContainer}>
             <Text style={{ fontSize: 18 }}>📦</Text>
            </View>
            <View style={styles.productTextContainer}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productMeta}>
                {item.quantidade} {item.unidade}
              </Text>
            </View>
          </View>

          <View style={styles.productRight}>
            <Text style={styles.productPrice}>{formatarPreco(item.preco)}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.bg }]}>
              <Text style={[styles.statusLabel, { color: status.text }]}>{status.label}</Text>
            </View>
          </View>
        </View>
      );
    },
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
        <Text style={styles.emptySubtitle}>
          {selectedCategoryId && searchText.trim()
            ? "Tente ajustar sua busca ou categoria"
            : selectedCategoryId
            ? "Nenhum produto nesta categoria"
            : "Comece a digitar para buscar"}
        </Text>
      </View>
    ),
    [selectedCategoryId, searchText]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Produtos</Text>
          <View style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.primary[700]} />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.textSecondary}
              onPress={() => setSearchText("")}
            />
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          style={styles.categoriesContainer}
        >
          {CATEGORIAS_MOCK.map((category) => renderCategoryChip(category))}
        </ScrollView>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[4],
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
  },
  categoriesContainer: {
    marginBottom: Spacing[4],
  },
  categoriesScroll: {
    paddingRight: Spacing[4],
    paddingLeft: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing[2],
    alignSelf: "flex-start",
  },
  categoryChipActive: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
  },
  categoryChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  categoryChipTextActive: {
    color: Colors.surface,
  },
  listContent: {
    paddingBottom: Spacing[8],
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
  productLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
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
    fontSize: Typography.fontSize.sm,
  },
  productRight: {
    alignItems: "flex-end",
    marginLeft: Spacing[3],
  },
  productPrice: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  statusBadge: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing[12],
  },
  emptyTitle: {
    marginTop: Spacing[4],
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: Spacing[2],
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing[4],
  },
});
