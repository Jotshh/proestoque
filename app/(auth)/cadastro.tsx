import { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput, Alert
} from "react-native";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";

// Tipagem do formulário (TypeScript)
type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function Cadastro() {
  const router = useRouter();
  
  const [form, setForm] = useState<FormFields>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nomeRef     = useRef<TextInput>(null);
  const emailRef    = useRef<TextInput>(null);
  const senhaRef    = useRef<TextInput>(null);
  const confirmaRef = useRef<TextInput>(null);

  const { registrar, isLoading } = useAuth();

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormFields> = {};

    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.email.includes("@") || !form.email.includes(".")) newErrors.email = "Informe um e-mail válido";
    if (form.senha.length < 6) newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    if (form.senha !== form.confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validate()) return;

    try {
      // usar o registrar do contexto (o isLoading do contexto informa o estado)
      await registrar(form.nome, form.email, form.senha);
      // NavigationGuard deve redirecionar automaticamente para /(tabs)
      setIsSubmitted(true);
    } catch (error: any) {
      Alert.alert("Erro ao criar conta", error.message ?? "Tente novamente.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <LogoProEstoque size="md" />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {isSubmitted ? (
              <>
                <Text style={styles.title}>Conta criada!</Text>
                <Text style={styles.subTitle}>Sua conta foi criada com sucesso.</Text>

                <View style={styles.buttonGroup}>
                  <Button label="Ir para Login" onPress={() => router.push("/login")} fullWidth />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subTitle}>Preencha seus dados para acessar o ProEstoque.</Text>

                <Input
                  ref={nomeRef}
                  label="Nome completo"
                  placeholder="João da Silva"
                  leftIcon="person"
                  value={form.nome}
                  onChangeText={(v) => updateField("nome", v)}
                  error={errors.nome}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                <Input
                  ref={emailRef}
                  label="E-mail"
                  placeholder="seuemail@gmail.com"
                  leftIcon="at"
                  value={form.email}
                  onChangeText={(v) => updateField("email", v)}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                />
                <Input
                  ref={senhaRef}
                  label="Senha"
                  placeholder="********"
                  leftIcon="lock-closed-sharp"
                  value={form.senha}
                  onChangeText={(v) => updateField("senha", v)}
                  error={errors.senha}
                  isPassword
                  returnKeyType="next"
                  onSubmitEditing={() => confirmaRef.current?.focus()}
                />
                <Input
                  ref={confirmaRef}
                  label="Confirmar senha"
                  placeholder="********"
                  leftIcon="lock-closed-sharp"
                  value={form.confirmarSenha}
                  onChangeText={(v) => updateField("confirmarSenha", v)}
                  error={errors.confirmarSenha}
                  isPassword
                  returnKeyType="done"
                  onSubmitEditing={handleCadastro}
                />

                <View style={styles.buttonGroup}>
                  <Button label="Criar Conta" onPress={handleCadastro} loading={isLoading} fullWidth />
                </View>
                <Link href="/login" style={styles.haveAccount}>
                  Já tenho uma conta
                </Link>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center"
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
  haveAccount: {
    alignSelf: "center",
    marginTop: Spacing[3],
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  buttonGroup: {
    marginBottom: Spacing[3],
  },
});