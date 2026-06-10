import { useState, useRef } from "react";
import { KeyboardAvoidingView, ScrollView, Platform, StatusBar, StyleSheet, Text, View, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter, router } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import LogoProEstoque from "@/src/components/LogoProEstoque";

export default function Login({ children }: { children: React.ReactNode }) {

  const emailRef    = useRef<TextInput>(null);
  const senhaRef    = useRef<TextInput>(null);

  const { login, isLoading } = useAuth(); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      await login(email, senha); 
    } catch (error: any) {
      Alert.alert("Erro", error?.message ?? "E-mail ou senha inválidos.");
    }
  };

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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="at"
              placeholder="seuemail@gmail.com"
              returnKeyType="next"    
              ref={emailRef}
              onSubmitEditing={() => senhaRef.current?.focus()}                 
            />
            <Input
              ref={senhaRef}
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              leftIcon="lock-closed-sharp"
              placeholder="********"
              isPassword={true}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Link href="/recuperar-senha" style={styles.forgotPassword}>
              Esqueci minha senha
            </Link>

            <View style={styles.buttonGroup}>
              <Button
                label="Entrar"
                onPress={handleLogin}
                loading={isLoading}
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
