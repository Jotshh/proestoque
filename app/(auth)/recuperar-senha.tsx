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
import { Colors, Typography } from "@/src/constants/theme";
import Input from "@/src/components/Input";
import { useRouter } from "expo-router";
import Button from "@/src/components/Button";
import { useState } from "react";

export default function RecuperarSenha({ children }: { children?: React.ReactNode }) {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEnviar = () => {
    
    if (!email.includes("@") || !email.includes(".")) {
       
        return;
    }
    
    setIsSubmitted(true);
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

          <View style={styles.container}>
            {isSubmitted ? (
              
              <>
                <Text style={styles.title}>E-mail Enviado!</Text>
                <Text style={styles.subTitle}>
                  Enviamos as instruções de recuperação para:{"\n"}
                  <Text style={{ fontWeight: "bold" }}>{email}</Text>
                </Text>

                <Button
                  label="Voltar ao Login"
                  variant="outline"
                  onPress={() => router.back()}
                  fullWidth
                />
              </>
            ) : (
             
              <>
                <Text style={styles.title}>Recuperar Senha</Text>
                <Text style={styles.subTitle}>
                  Informe seu e-mail para receber as instruções de recuperação de
                  senha.
                </Text>
                <View>
                <Input
                  label="Email"
                  leftIcon="at"
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Button 
                  label="Enviar" 
                  onPress={handleEnviar} 
                  fullWidth 
                />

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
    alignItems: "center",
  },
  flex: {
    flex: 1,
  
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },
  container: {
    width: "100%",
    marginTop: 24,
    alignItems: "center",
  },
  title: {
    alignSelf: "center",
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    alignSelf: "center",
    fontSize: Typography.fontSize.md, // Reduzi levemente o subtítulo para melhorar o contraste com o título
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
});