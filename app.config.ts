export default {
  expo: {
    name: "ProEstoque",
    slug: "proestoque",
    version: "1.0.0",
    android: {
      package: "com.josielphelipe.proestoque",
    },
    // ... outras configs

    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api",
      eas: {
        projectId: "9afc1f31-ae1d-4cd9-9d80-62807c331fe8",
      },
    },

    plugins: [["expo-notifications"]],
    
  },
};