import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import Input from "@/src/components/Input";
import { Link, useRouter } from "expo-router";
import Button from "@/src/components/Button";

export default function Login({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (

    <SafeAreaView style={styles.safe}>


      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />


      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoProEstoque size="md" />

          <View style={styles.card}>
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subTitle}>
              Acesse sua conta para gerenciar seu estoque de forma rápida e segura.
            </Text>

            <Input
              label="Email"
              leftIcon="at"
              placeholder="seuemail@gmail.com"
            />

            <Input
              label="Senha"
              leftIcon="lock-closed-sharp"
              placeholder="********"
              isPassword={true}
            />

            <Link href="/recuperar-senha" style={styles.forgotPassword}>
              Esqueci minha senha
            </Link>

            <View style={styles.buttonGroup}>
              <Button
                label="Entrar"
                onPress={() => router.push("/")}
                fullWidth
              />
            </View>
          </View>

          <Link href="/cadastro" style={styles.noAccount}>
            Não tem uma conta? Cadastrar-se
          </Link>

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
  forgotPassword: {
    alignSelf: "flex-end",
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    marginBottom: 24,
  },
  buttonGroup: {
    marginBottom: Spacing[3],
  },
  noAccount: {
    alignSelf: "center",
    marginTop: Spacing[4],
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },

});
