export default {
  expo: {
    name: "ProEstoque",
    slug: "proestoque",
    version: "1.0.0",
    // ... outras configs

    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api",
    },
  },
};