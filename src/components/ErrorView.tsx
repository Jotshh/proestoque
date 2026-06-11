import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/src/constants/theme";

interface ErrorViewProps {
  mensagem: string;
  onRetry?: () => void;
}

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={Colors.neutral[400]} />
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.botao} onPress={onRetry}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: Spacing[3], padding: Spacing[6] },
  titulo: { fontSize: 18, fontWeight: "600", color: Colors.textPrimary },
  mensagem: { fontSize: 14, color: Colors.textSecondary, textAlign: "center" },
  botao: { backgroundColor: Colors.primary[600], paddingHorizontal: Spacing[6], paddingVertical: Spacing[3], borderRadius: 8 },
  botaoTexto: { color: "#fff", fontWeight: "600" },
});