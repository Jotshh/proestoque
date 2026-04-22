import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Radius } from "@/src/constants/theme";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
}

export default function LogoProEstoque({
  size = "md"
}: LogoProps) {

  return (

    <View style={styles.container}>
      <Text style={styles.title}>ProEstoque</Text>
      <Ionicons
        name="cube-outline"
        size={size === "sm" ? 24 : size === "md" ? 32 : 40}
        color={Colors.neutral[400]}
      />
    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: Spacing[4],
    alignItems: "center",
  },

  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },

});