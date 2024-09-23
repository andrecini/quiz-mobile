import { extendTheme } from "native-base";

export const Theme = extendTheme({
  colors: {
    primary: "#3498db", // Azul claro vibrante
    primaryLight: "#5dade2", // Azul ainda mais claro para botões
    secondary: "#2c3e50", // Azul escuro para contraste
    background: "#ecf0f1", // Fundo claro
    backgroundLight: "#f9f9f9", // Cor de fundo mais clara
    card: "#FFFFFF", // Cor de fundo para cards (adicionada)
    heading: "#2980b9", // Azul escuro para headings
    textPrimary: "#2c3e50", // Cor escura para textos
    textSecondary: "#7f8c8d", // Cinza suave para textos secundários
    success: "#27ae60", // Verde forte para sucesso
    successLight: "#58d68d", // Verde claro para botões
    error: "#c0392b", // Vermelho escuro para erro
    errorLight: "#e74c3c", // Vermelho mais claro para botões
    textButton: "#ffffff", // Branco para textos nos botões
    iconColorDark: "#2c3e50", // Ícones mais escuros
    border: "#dcdcdc", // Borda suave
  },
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24, // Tamanho maior para destaques
  },
  spacing: {
    xs: 6, // Espaçamento um pouco maior para mais "respiro"
    sm: 12,
    md: 20,
    lg: 28,
    xl: 36,
  },
  radii: {
    sm: 5,
    md: 10,
    lg: 15, // Cantos mais arredondados
    xl: 20,
  },
});
