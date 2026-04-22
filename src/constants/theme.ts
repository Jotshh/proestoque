// Este arquivo é a fonte da verdade visual do seu app.
// NUNCA coloque cores, tamanhos ou fontes hardcoded fora daqui.

export const Colors = {
  // Paleta primária (violeta)
  primary: {
    50:  "#f5f3ff",
    100: "#3217EA",
    300: "#2511CF",
    500: "#190BB4",
    600: "#0C0699",
    700: "#00007E",
    900: "#000058",
  },
  
  // Tons neutros (cinza)
  neutral: {
    50:  "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    400: "#9ca3af",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },

  // Status
  success: { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  warning: { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  danger:  { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
  info:    { bg: "#dbeafe", text: "#1e40af", border: "#60a5fa" },

  // Atalhos semânticos (os mais usados no dia a dia)
  background: "#f9fafbe0",    // Fundo das telas
  surface:    "#ffffff",    // Fundo de cards
  textPrimary:   "#111827", // Texto principal
  textSecondary: "#6b7280", // Texto secundário/legenda
  border:        "#e5e7eb", // Bordas de inputs e cards
  white:         "#ffffff",
  black:         "#000000",
};

export const Typography = {
  // Tamanhos de fonte padronizados
  fontSize: {
    xs:   10, sm: 12, base: 14, md: 16,
    lg: 18, xl: 22, "2xl": 28, "3xl": 36,
  },
  fontWeight: {
    regular: "400" as const,
    medium:  "500" as const,
    semibold:"600" as const,
    bold:    "700" as const,
    black:   "900" as const,
  },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 },
};

export const Spacing = {
  // Escala de 4px (padrão da indústria)
  1: 4,   2: 8,  3: 12, 4: 16, 5: 20,
  6: 24,  8: 32, 10: 40, 12: 48, 16: 64,
};

export const Radius = {
  sm: 6, md: 8, lg: 12, xl: 16, full: 9999,
};