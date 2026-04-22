import { useRef, useState } from "react";
import { View, Alert, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Text } from "react-native";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Typography } from "@/src/constants/theme";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Link } from "expo-router";

// Tipagem do formulário (TypeScript)
type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function Cadastro() {
  
  const [form, setForm] = useState<FormFields>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  // ✅ Estado de erros separado (usa as mesmas chaves do form)
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Uma única função para atualizar qualquer campo
  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpa o erro do campo assim que o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ✅ Validação centralizada — retorna true se tudo OK
  const validate = (): boolean => {
    const newErrors: Partial<FormFields> = {};

    if (!form.nome.trim())
      newErrors.nome = "Nome é obrigatório";

    if (!form.email.includes("@") || !form.email.includes("."))
      newErrors.email = "Informe um e-mail válido";

    if (form.senha.length < 6)
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres";

    if (form.senha !== form.confirmarSenha)
      newErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(newErrors);
    // Se o objeto de erros estiver vazio, o formulário é válido
    return Object.keys(newErrors).length === 0;
  };

  const handleCadastro = async () => {
    if (!validate()) return; // Aborta se houver erros

    setLoading(true);
    // Simula chamada à API (remover quando integrar com o backend)
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Conta criada!", "Bem-vindo ao ProEstoque.");
    }, 2000);
  };

  

  return (

    <SafeAreaView style={styles.safe}>

      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <LogoProEstoque />

      <Text style={styles.title}>
        Criar Conta
      </Text>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <Input
            label="Nome completo"
            placeholder="João da Silva"
            leftIcon="person"
            value={form.nome}
            onChangeText={(v) => updateField("nome", v)}
            error={errors.nome}          // Passa o erro para o componente
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Input
            label="E-mail"
            placeholder="seuemail@gmail.com"
            leftIcon="at"
            value={form.email}
            onChangeText={(v) => updateField("email", v)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <Input
            label="Senha"
            placeholder="********"
            leftIcon="lock-closed-sharp"
            value={form.senha}
            onChangeText={(v) => updateField("senha", v)}
            error={errors.senha}
            isPassword
            returnKeyType="next"
          />
          <Input
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

          <Button
            label="Criar Conta"
            onPress={handleCadastro}
            loading={loading}
            fullWidth
          />

          <Link
            href="/login"
            style={styles.haveAccount}>
            Já tenho uma conta
          </Link>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center"
  },

  flex: {
    flex: 1
  },

  scroll: {
    flexGrow: 1,
    padding: 24
  },

  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },

  haveAccount: {
    alignSelf: "center",
    marginTop: 24,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },  

});