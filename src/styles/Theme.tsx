import { extendTheme } from "native-base";

export const Theme = extendTheme({
  colors: {
    primary: "#820AD1", // Cor roxa
    secondary: "#F3F4F6", // Cor cinza claro
    background: "#000", // Cor de fundo escura
    card: "#161616",
    textPrimary: "#FFFFFF", // Cor branca para texto
    textSecondary: "#CCCCCC", // Texto secundário em cinza claro
    success: "#00C851", // Cor verde para sucesso
    error: "#ff4444", // Cor vermelha para erro
    iconColor: "#FFFFFF", // Cor dos ícones
    border: "#333333", // Borda para inputs e botões
  },
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 20,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
});
