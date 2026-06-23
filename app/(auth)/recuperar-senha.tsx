import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import Input from "@/src/components/Input";
import { useRouter } from "expo-router";
import Button from "@/src/components/Button";
import { useState } from "react";

export default function RecuperarSenha({ children }: { children?: React.ReactNode }) {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEnviar = () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, informe seu e-mail.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Erro", "Por favor, informe um e-mail válido.");
      return;
    }

    Alert.alert(
      "E-mail Enviado",
      "Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.",
      [{ text: "OK", onPress: () => setIsSubmitted(true) }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoProEstoque size="md" />

          <View style={styles.card}>
            {isSubmitted ? (
              <>
                <Text style={styles.title}>Verifique seu e-mail</Text>
                <Text style={styles.subTitle}>
                  Enviamos as instruções de recuperação para:
                </Text>
                <Text style={styles.emailHighlight}>{email}</Text>

                <View style={styles.buttonGroup}>
                  <Button
                    label="Voltar ao Login"
                    variant="outline"
                    onPress={() => router.back()}
                    fullWidth
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Recuperar Senha</Text>
                <Text style={styles.subTitle}>
                  Informe seu e-mail para receber as instruções de recuperação de senha.
                </Text>

                <Input
                  label="Email"
                  leftIcon="at"
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleEnviar}
                />

                <View style={styles.buttonGroup}>
                  <Button
                    label="Enviar"
                    onPress={handleEnviar}
                    fullWidth
                  />
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    label="Voltar ao Login"
                    variant="outline"
                    onPress={() => router.back()}
                    fullWidth
                  />
                </View>
              </>
            )}
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginTop: 24,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing[2],
  },
  subTitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
    textAlign: "center",
    lineHeight: 22,
  },
  emailHighlight: {
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: "center",
    marginBottom: Spacing[5],
  },
  buttonGroup: {
    marginBottom: Spacing[3],
  },
});