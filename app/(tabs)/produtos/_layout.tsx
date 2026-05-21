import { Stack } from "expo-router";
import { Colors } from "@/src/constants/theme";


export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary[600],
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Produtos" }} />
      <Stack.Screen name="novo" options={{ title: "Novo Produto" }} />
      <Stack.Screen name="[id]" options={{ title: "Editar Produto" }} />
    </Stack>
  );
}