import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  Text
} from "react-native";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "@/src/constants/theme";
import Input from "@/src/components/Input";
import { Link } from "expo-router";
import Button from "@/src/components/Button";

export default function Login({ children }: { children: React.ReactNode }) {
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
            <LogoProEstoque />

            <Text style={styles.subTitle}>
              Bem-vindo de volta!
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

            <Link 
            href="/recuperar-senha" 
            style={styles.forgotPassword}>
              Esqueci minha senha
            </Link>

            <Button 
            label="Entrar" 
            onPress={() => {}}
            fullWidth
            />

            <Link 
            href="/cadastro" 
            style={styles.noAccount}>
              Não tem uma conta? Cadastrar-se
            </Link>

          {children}
        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

safe:   { 
    flex: 1, 
    backgroundColor: Colors.background, 
    alignItems: "center" 
},

flex:   { 
    flex: 1,
},

scroll: { 
    flexGrow: 1, 
    padding: 24 
},

subTitle: {
    alignSelf: "center",
    fontSize: Typography.fontSize.lg,
    fontWeight: "bold",
    color: Colors.textSecondary,
    marginBottom: 8,
},

forgotPassword: {
    alignSelf: "flex-end",
    fontSize: Typography.fontSize.sm,
    color: Colors.primary[600],
    marginBottom: 24,
},

noAccount: {
    alignSelf: "center",
    marginTop: 24,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
},  

});
