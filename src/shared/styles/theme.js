/**
 * Paleta e tipografia do app — mesma estrutura do theme.js do app da
 * igreja, com as cores do modo escuro da página Rota B1 → C2.
 */

export const colors = {
  background: '#10121A',
  surface: '#191C27',
  sunk: '#141722',
  line: '#2A2F40',

  textPrimary: '#E8EAF3',
  textSecondary: '#C3C7D6',
  textMuted: '#9BA1B8',

  primary: '#8C9BFF', // acento — botões principais, barra de progresso
  primaryInk: '#10121A', // texto sobre primary
  primarySoft: '#252B4D',

  success: '#4CC995',
  successSoft: '#173628',
  warning: '#fbbf24',
  danger: '#f87171',
}

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weight: {
    regular: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
}
